const express = require("express");
const busesDataModel = require("../models/busesDataSchema");
const busBookingDataModel = require("../models/busesBookingDataSchema");
const busesSearchModel = require("../models/busesSchema");
const busesUserModel = require("../models/busUsersSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const jwtAuthorization = require("../utils/jwtmiddleware");
const { generateBookingNo , generateBusTicketNumber} = require("../controller/controller");

const router = express.Router();

router.get("/get-all-buses", async (request, response) => {
  try {
    busesDataModel
      .find()
      .then((dataObject) => {
        return response.status(200).json({ buses: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/payment-checkout",
  jwtAuthorization,
  async (request, response) => {
    let busDetailsBookingId = null;
    let customer = null;
    try {
      const { userId, name, email, bookingData } = request.body;
      busDetailsBookingId = bookingData.bookingDetailsId;

      customer = await stripe.customers.create({
        name: name,
        email: email,
        metadata: {
          userId: userId,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "aed",
              product_data: {
                name: bookingData.busDetails.busName,
                description: `From: ${bookingData.busDetails.fromDeparture} 
              To: ${bookingData.busDetails.toDestination}
              Passengers: ${Number(bookingData.quantity)}`,
                metadata: {
                  journeyId: bookingData.busDetails._id,
                  userId: userId,
                  categoryId: bookingData.categoryId,
                  bookingDetailsId: bookingData.bookingDetailsId,
                },
              },
              unit_amount: Number(bookingData.price) * 100,
            },
            quantity: Number(bookingData.quantity),
          },
        ],
        metadata: {
          journeyId: bookingData.busDetails._id,
          userId: userId,
          categoryId: bookingData.categoryId,
          bookingDetailsId: bookingData.bookingDetailsId,
        },
        customer: customer.id,
        mode: "payment",
        success_url: `http://localhost:3000/bus/ticket/${bookingData.bookingDetailsId}`,
        cancel_url: "http://localhost:3000/failure",
      });

      const busBooking = busesUserModel
        .updateOne(
          { _id: bookingData.bookingDetailsId },
          {
            $set: {
              checkoutId: session.id,
              paymentStatus: "pending",
            },
          }
        )
        .then((data) => {
          return response.status(200).json({ session: session });
        })
        .catch(async (error) => {
          await busesUserModel.deleteOne({ _id: bookingData.bookingDetailsId });
          await stripe.customers.del(customer?.id);
          console.log(error.message);
          return response.status(400).json({ message: error.message });
        });
    } catch (error) {
      await busesUserModel.deleteOne({ _id: busDetailsBookingId });
      customer && (await stripe.customers.del(customer?.id));
      console.log(error.message);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//bus routes for fetching data in front-end starts

router.post("/insertBusesData", async (req, res) => {
  console.log(busesData);
  const insertedBusData = await busesSearchModel.insertMany(busesData);
  console.log("Inserted data:", insertedBusData);

  res.status(201).json({ message: "Buses data inserted successfully" });
});

router.get("/getAllBuses", async (req, res) => {
  try {
    const getAllBuses = await busesSearchModel.find();
    res.status(200).json(getAllBuses);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getSearchBuses", async (req, res) => {
  const fromCity = req.query.fromCity;
  const toCity = req.query.toCity;
  const journeyDate = req.query.journeyDate;
  const journeyDateObj = new Date(journeyDate);
  const buses = await busesSearchModel.find({
    fromDeparture: fromCity,
    toDestination: toCity,
    "journeyDateRange.startDate": { $lte: journeyDateObj },
    "journeyDateRange.endDate": { $gte: journeyDateObj },
  });
  res.json(buses);
});

//bus routes for fetching data in front-end ends

//bus routes for saving user data starts

router.post("/saveUsers", jwtAuthorization, async (req, res) => {
 
  try {
    const {
      passengers,
      email,
      contactPrefix,
      contactNo,
      seatNumbers,
      busId,
      userId,
      busDetails,
      journeyDate,
      boardingPoint,
      droppingPoint,
    } = req.body;

   
    const ticketNumber = await generateBusTicketNumber();
   
    
    const newUser = new busesUserModel({
      passengers,
      email,
      contactPrefix,
      contactNo,
      seatNumbers,
      busId,
      userId,
      busDetails,
      journeyDate,
      droppingPoint,
      boardingPoint,
      ticketNumber,
    });

    await newUser
      .save()
      .then((data) => {
        console.log(data);
        return res
          .status(201)
          .json({ message: "User data saved successfully", data: data });
      })
      .catch((error) => {
        console.log(error.message);
        return res.status(401).json({ message: error.message });
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
});

//bus routes for savig user data ends

//get booking details
router.get(
  "/fetch-booking-details/:bookingId",
  jwtAuthorization,
  async (request, response) => {
    try {
      const { bookingId } = request.params;

      await busesUserModel
        .findOne({ _id: bookingId })
        .then((data) => {
          return response.status(200).json({ data: data });
        })
        .catch((error) => {
          console.log(err.message);
          return res.status(400).json({ error: err.message });
        });
    } catch (error) {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    }
  }
);

//adding reviews
router.post("/add-review", jwtAuthorization, async (request, response) => {
  try {
    const { busId, reviewText, rating, userId } = request.body;

    const review = {
      rating: Number(rating),
      review: reviewText,
      userId: userId,
      reviewDate: new Date(Date.now()),
    };

    await busesSearchModel
      .findByIdAndUpdate(
        { _id: busId },
        { $push: { reviews: review } },
        { new: true, useFindAndModify: false }
      )
      .then((data) => {
        return response
          .status(200)
          .json({ message: "Review Added", review: data });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.get("/fetch-reviews-users/:busId", async (request, response) => {
  try {
    const { busId } = request.params;

    const reviewsData = await busesSearchModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(busId),
          },
        },
        { $unwind: "$reviews" },
        { $match: { "reviews.isReviewApproved": "APPROVED" } },
        {
          $lookup: {
            from: "userData",
            let: { userId: { $toObjectId: "$reviews.userId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }],
            as: "usersLoginData",
          },
        },
        {
          $unwind: {
            path: "$usersLoginData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "GoogleUserData",
            let: { userId: { $toObjectId: "$reviews.userId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }],
            as: "googleUsersDetails",
          },
        },
        {
          $unwind: {
            path: "$googleUsersDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            userDetails: {
              $ifNull: ["$usersLoginData", "$googleUsersDetails"],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            reviews: {
              $push: {
                _id: "$reviews._id",
                rating: "$reviews.rating",
                review: "$reviews.review",
                reviewDate: "$reviews.reviewDate",
                userId: "$reviews.userId",
                isReviewApproved: "$reviews.isReviewApproved",
                userDetails: "$userDetails",
              },
            },
            averageRating: { $avg: "$reviews.rating" },
          },
        },
        {
          $project: {
            _id: 1,
            "reviews._id": 1,
            "reviews.rating": 1,
            "reviews.review": 1,
            "reviews.reviewDate": 1,
            "reviews.userId": 1,
            "reviews.isReviewApproved": 1,
            "reviews.userDetails": 1,
            averageRating: 1,
          },
        },
      ])
      .then((data) => {
        return response.status(200).json({ reviews: data });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.put("/delete-review", jwtAuthorization, async (request, response) => {
  try {
    const { busId, reviewId } = request.body;

    await busesSearchModel
      .updateOne(
        { _id: new mongoose.Types.ObjectId(busId) },
        {
          $pull: {
            reviews: { _id: new mongoose.Types.ObjectId(reviewId) },
          },
        }
      )
      .then((data) => {
        return response
          .status(200)
          .json({ message: "Review Deleted", result: data });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

module.exports = router;
