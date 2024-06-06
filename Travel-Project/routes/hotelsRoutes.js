
const jwtAuthorization = require("../utils/jwtmiddleware");


const mongoose = require("mongoose");

const express = require("express");
const hotelsDataModel = require("../models/hotelsDataSchema");

const hotelBookingDataModel = require("../models/hotelBookingDataSchema");
const { generateBookingNo } = require("../controller/controller");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.get("/get-all-hotels", async (request, response) => {
  const { rating, levels, popularFilters, minPrice, maxPrice } = request.query;
  let query = {};

  if (rating && rating !== "All") {
    query.rating = { $gte: parseFloat(rating) };
  }

  if (levels && levels !== "All") {
    query.levels = parseInt(levels);
  }

  if (popularFilters && popularFilters !== "All") {
    query.popularFilters = { $in: popularFilters.split(",") };
  }

  if (minPrice) {
    query.price = { ...query.price, $gte: parseFloat(minPrice) };
  }

  if (maxPrice) {
    query.price = { ...query.price, $lte: parseFloat(maxPrice) };
  }

  try {
    const hotels = await hotelsDataModel.find(query);
    return response.status(200).json({ hotels });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
router.get("/get-individual-hotel/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const individualhoteldetails = await hotelsDataModel.findById({ _id: id });
    return response.status(200).json({ individualhoteldetails });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

//-check post
router.post('/book-hotel', async (req, res) => {
  try {
    const bookingData = req.body;
    const  BookingNo= await generateBookingNo();

    const newBooking = new hotelBookingDataModel({...bookingData,BookingNo});
    await newBooking.save().then(data => {
      res.status(201).json({ message: 'Booking successful', data: data });
    }).catch(error => {
      console.log(error.message)
      res.status(400).json({ message: 'Failed to save book hotel', error: error.message });
    })

  } catch (error) {
    res.status(500).json({ message: 'Failed to book hotel', error: error.message });
  }
});
// --------------------
router.get("/get-book-hotel/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const individualbookdetails = await hotelBookingDataModel.findOne({ _id: id });
    return response.status(200).json({ individualbookdetails});
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});


//add review
router.post("/add-review", async (request, response) => {
  try {
    const { hotelId, reviewText, rating, userId } = request.body;
   
    const review = {
      rating: Number(rating),
      review: reviewText,
      userId: userId,
      reviewDate: new Date(Date.now()),
    };

    await hotelsDataModel
      .findByIdAndUpdate(
        { _id: hotelId },
        { $push: { hotelUserReview: review } },
        { new: true, useFindAndModify: false }
      )
      .then((data) => {
        return response
          .status(200)
          .json({ message: "Review Added Succesfully", review: data });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });



    }
   catch (error) {

    console.log(error.message);
    return response.status(400).json({ message: error.message });
  }
});




router.get("/fetch-reviews-users/:hotelId", async (request, response) => {
  try {
    const { hotelId } = request.params;

    const reviewsData = await hotelsDataModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(hotelId),
          },
        },
        { $unwind: "$hotelUserReview" },
        { $match: { "hotelUserReview.ApprovedReview": "APPROVED" } },
        {
          $lookup: {
            from: "userData",
            let: { userId: { $toObjectId: "$hotelUserReview.userId" } },
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
            let: { userId: { $toObjectId: "$hotelUserReview.userId" } },
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
                _id: "$hotelUserReview._id",
                rating: "$hotelUserReview.rating",
                review: "$hotelUserReview.review",
                reviewDate: "$hotelUserReview.reviewDate",
                userId: "$hotelUserReview.userId",
                isReviewApproved: "$hotelUserReview.isReviewApproved",
                userDetails: "$userDetails",
              },
            },
            averageRating: { $avg: "$hotelUserReview.rating" },
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
    const { hotelId, reviewId } = request.body;

    await hotelsDataModel
      .updateOne(
        { _id: new mongoose.Types.ObjectId(hotelId) },
        {
          $pull: {
            hotelUserReview: { _id: new mongoose.Types.ObjectId(reviewId) },
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



//payment

router.post("/payment-checkout", jwtAuthorization, async (request, response) => {
  let hotelDetailsBookingId = null;
  let customer = null;

  try {
    const { userId, name, email, bookingData } = request.body;
    hotelDetailsBookingId = bookingData.bookingDetailsId;

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
              name: bookingData.hotelDetails.name,
              description: `rooms: ${bookingData.bookingDetails.rooms} 
            Nights: ${bookingData.bookingDetails.numberOfNights}
            Passengers: ${Number(bookingData.bookingDetails.passengers)}`,
              metadata: {
                hotelId: bookingData.hotelDetails._id,
                userId: userId,
                categoryId: bookingData.categoryId,
                bookingDetailsId: bookingData.bookingDetailsId,
              },
            },
            unit_amount: Number(bookingData.price) * 100,
          },
          quantity: 1

        },
      ],
      metadata: {
        hotelId: bookingData.hotelDetails._id,
        userId: userId,
        categoryId: bookingData.categoryId,
        bookingDetailsId: bookingData.bookingDetailsId,
      },
      customer: customer.id,
      mode: "payment",
      success_url: `http://localhost:3000/lastPage/${bookingData.bookingDetailsId}`,
      cancel_url: "http://localhost:3000/failure",
    });

    const hotelBooking = hotelBookingDataModel
      .updateOne(
        { _id: bookingData.bookingDetailsId },
        {
          $set: {
            checkoutSessionId: session.id,
            paymentStatus: "pending",
          },
        }
      )
      .then((data) => {
        return response.status(200).json({ session: session });
      })
      .catch(async (error) => {
        await hotelBookingDataModel.deleteOne({ _id: bookingData.bookingDetailsId });
        await stripe.customers.del(customer?.id);
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    await hotelBookingDataModel.deleteOne({ _id: hotelDetailsBookingId });
    customer && (await stripe.customers.del(customer?.id));
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }

});

module.exports = router;