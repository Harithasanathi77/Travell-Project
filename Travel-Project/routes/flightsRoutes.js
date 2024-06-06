const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const redis = require("redis");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const path = require("path");
const flightsDataModel = require("../models/flightsDataSchema");
const { format, isEqual, isBefore } = require("date-fns");
const flightBookingDataModel = require("../models/flightBookingDataSchema");
const { error } = require("console");
const jwtAuthorization = require('../utils/jwtmiddleware');
const userData = require('../models/userData')
const GoogleUserData = require("../models/googleUserData")
// In-memory cache
// let cache = {
//   data: null,
//   timestamp: null,
// };
// const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// router.get("/search-flights", async (req, res) => {
//   const now = Date.now();

//   if (cache.data && now - cache.timestamp < CACHE_DURATION) {
//     // Return cached data
//     return res.json(cache.data);
//   } else {
//     try {
//       const options = {
//         method: "GET",
//         url: "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights",
//         params: {
//           fromId: "BOM.AIRPORT",
//           toId: "DXB.AIRPORT",
//           departDate: "2024-05-22",
//           pageNo: "1",
//           adults: "1",
//           children: "0,17",
//           currency_code: "AED",
//         },
//         headers: {
//           "X-RapidAPI-Key": "9aba2da724msh82baeecc8595e60p10efa4jsna0ae58f80452",
//           "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
//         },
//       };

//       const response = await axios.request(options);

//       // Update cache
//       cache.data = response.data;
//       cache.timestamp = now;
//       console.log('abc')
//       res.status(200).json({ data: response.data });
//     } catch (error) {
//       console.error("API Request error:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
// });

router.get("/flight-search", async (request, response) => {
  console.log(request.query)
  try {
    const {
      fromId = "",
      toId = "",
      departDate = "",
      pageNo = "1",
      adults = "1",
      children = "1",
      infants = "",
      currencyCode = "",
      cabinClass = "",
      airlines = "",
      numberOfStops = "",
      departureTimeBetween = "",
      arrivalTimeBetween = "",
      rating = "",
    } = request.query;

    let offset = 0;

    const queryObject = {};
    const specificPricesFilterQuery = {
      departureTime: 1,
      arrivalTime: 1,
      categoryId: 1,
      currencyCode: 1,
      departureDay: 1,
      departureAirport: 1,
      arrivalAirport: 1,
      facilities: 1,
      flightNumber: 1,
      planeType: 1,
      carrierInfo: 1,
      duration: 1,
      flightStops: 1,
      baggage: 1,
      ratings: 1,
    };

    const noOfStopsSizeQuery = {};
    const timeBetweenQueryAdd = {};
    const departTimeMatchQuery = {};
    const arrivalTimeMatchQuery = {};
    let ratingCalculateQuery = {
      _id: "$_id",
      averageRating: { $avg: "$ratings.rating" },
      departureTime: { $first: "$departureTime" },
      arrivalTime: { $first: "$arrivalTime" },
      categoryId: { $first: "$categoryId" },
      currencyCode: { $first: "$currencyCode" },
      departureDay: { $first: "$departureDay" },
      departureAirport: { $first: "$departureAirport" },
      arrivalAirport: { $first: "$arrivalAirport" },
      cabinClass: { $first: "$cabinClass" },
      flightNumber: { $first: "$flightNumber" },
      planeType: { $first: "$planeType" },
      carrierInfo: { $first: "$carrierInfo" },
      duration: { $first: "$duration" },
      flightStops: { $first: "$flightStops" },
      prices: { $first: "$prices" },
      totalNumberOfSeats: { $first: "$totalNumberOfSeats" },
      numberOfAvailableSeats: { $first: "$numberOfAvailableSeats" },
      baggage: { $first: "$baggage" },
      discount: { $first: "$discount" },
      ratings: { $push: "$ratings" },
    };

    if (fromId !== "") {
      queryObject["departureAirport.code"] = fromId;
    }

    if (toId !== "") {
      queryObject["arrivalAirport.code"] = toId;
    }

    if (departDate !== "") {
      const dateFormatDepartDate = new Date(departDate);
      // const dayStart = new Date(dateFormatDepartDate.setHours(0, 0, 0, 0));
      // const dayEnd = new Date(dateFormatDepartDate.setHours(23, 59, 59, 999));
      const nowDate = new Date();

      let newDepartDate = null;

      const todaysDateZeroHours = new Date();
      todaysDateZeroHours.setUTCHours(0, 0, 0, 0);

      if (isEqual(dateFormatDepartDate, todaysDateZeroHours)) {
        newDepartDate = new Date(
          new Date(departDate).setUTCHours(
            nowDate.getHours(),
            nowDate.getMinutes(),
            nowDate.getSeconds(),
            nowDate.getMilliseconds()
          )
        );
      } else if (isBefore(dateFormatDepartDate, todaysDateZeroHours)) {
        return response
          .status(401)
          .json({ message: "Enter the Date Greater than now" });
        throw error;
      } else {
        newDepartDate = new Date(dateFormatDepartDate.setUTCHours(0, 0, 0, 0));
      }

      const dayFormat = format(dateFormatDepartDate, "EEEE");

      queryObject.departureTime = { $gte: newDepartDate };
      queryObject.departureDay = { $regex: dayFormat, $options: "i" };
    }

    if (cabinClass !== "") {
      const totalTravelers =
        Number(adults) + Number(children) + Number(infants);
      if (totalTravelers !== 0) {
        queryObject.numberOfAvailableSeats = {
          $elemMatch: {
            cabinClassId: cabinClass,
            availableSeats: { $gte: totalTravelers },
          },
        };

        specificPricesFilterQuery.cabinClass = {
          $filter: {
            input: "$cabinClass",
            as: "class",
            cond: { $eq: ["$$class.typeId", cabinClass] },
          },
        };

        specificPricesFilterQuery.prices = {
          $filter: {
            input: "$prices",
            as: "price",
            cond: { $eq: ["$$price.cabinClassId", cabinClass] },
          },
        };
        specificPricesFilterQuery.numberOfAvailableSeats = {
          $filter: {
            input: "$numberOfAvailableSeats",
            as: "numberOfAvailableSeat",
            cond: { $eq: ["$$numberOfAvailableSeat.cabinClassId", cabinClass] },
          },
        };
        specificPricesFilterQuery.totalNumberOfSeats = {
          $filter: {
            input: "$totalNumberOfSeats",
            as: "totalNumberOfSeat",
            cond: { $eq: ["$$totalNumberOfSeat.cabinClassId", cabinClass] },
          },
        };
      }
    }

    if (airlines !== "") {
      const airlinesArray = airlines.split(",");

      queryObject["carrierInfo.code"] = {
        $in: airlinesArray.map((type) => new RegExp(type, "i")),
      };
    }

    if (numberOfStops !== "") {
      noOfStopsSizeQuery.totalStops = { $size: "$flightStops" };
      queryObject.totalStops = Number(numberOfStops);
    }

    if (departureTimeBetween !== "") {
      const timeArray = departureTimeBetween.split(",");

      timeBetweenQueryAdd.departHour = {
        $hour: "$departureTime",
      };

      timeBetweenQueryAdd.departMinute = {
        $minute: "$departureTime",
      };

      departTimeMatchQuery["$or"] = timeArray.map((eachDur) => {
        const [startTime, endTime] = eachDur
          .split("-")
          .map((eachItem) => eachItem.trim());
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        return {
          $or: [
            {
              $and: [{ departHour: { $gt: startHour, $lt: endHour } }],
            },
            {
              $and: [
                { departHour: startHour, departMinute: { $gte: startMin } },
              ],
            },
            {
              $and: [{ departHour: endHour, departMinute: { $lte: endMin } }],
            },
          ],
        };
      });
    }

    if (arrivalTimeBetween !== "") {
      const timeArray = arrivalTimeBetween.split(",");

      timeBetweenQueryAdd.arrivalHour = {
        $hour: "$arrivalTime",
      };

      timeBetweenQueryAdd.arrivalMinute = {
        $minute: "$arrivalTime",
      };

      arrivalTimeMatchQuery["$or"] = timeArray.map((eachDur) => {
        const [startTime, endTime] = eachDur
          .split("-")
          .map((eachItem) => eachItem.trim());
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        return {
          $or: [
            {
              $and: [{ arrivalHour: { $gte: startHour, $lte: endHour } }],
            },
            {
              $and: [
                { arrivalHour: startHour, arrivalMinute: { $gte: startMin } },
              ],
            },
            {
              $and: [{ arrivalHour: endHour, arrivalMinute: { $lte: endMin } }],
            },
          ],
        };
      });
    }

    if (rating !== "") {
      queryObject.averageRating = { $gte: Number(rating) };
    }

    if (Number(pageNo) === 1) {
      offset = 0;
    } else if (Number(pageNo) !== 0 && Number(pageNo) !== 1) {
      offset = (Number(pageNo) - 1) * limit;
    }
    // console.log( queryObject );

    // const responseObj = await flightsDataModel
    //   .find(queryObject, specificPricesFilterQuery)
    //   .limit(Number(10))
    //   .skip(offset);

    const responseObj = await flightsDataModel.aggregate([
      { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },
      { $group: ratingCalculateQuery },
      { $addFields: noOfStopsSizeQuery },
      { $addFields: timeBetweenQueryAdd },
      { $match: queryObject },
      { $match: departTimeMatchQuery },
      { $match: arrivalTimeMatchQuery },
      { $project: specificPricesFilterQuery },
      { $skip: Number(offset) },
      { $limit: Number(10) },
    ]);

    // console.log(responseObj);
    return response.status(200).json({ flights: responseObj });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

const saveRating = async (flightId, rating) => {
  try {
    const flight = await flightsDataModel.findOne(
      { _id: flightId, "ratings.userId": rating.userId },
      { "ratings.$": 1 }
    );

    if (flight) {
      return 'User has already rated this flight';
    }

    const result = await flightsDataModel.updateOne(
      { _id: flightId },
      { $push: { ratings: rating } }
    );

    console.log("Update Result:", result);

    if (result.matchedCount === 0) {
      return 'Flight not found';
    }

    return result.modifiedCount > 0 ? 'Rating added successfully' : 'Rating not added';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

router.post('/saveratings', jwtAuthorization, async (req, res) => {
  try {
    const { flightId, rating } = req.body;
    let data;

    data = await userData.findOne({ _id: req.user.id });
    if (!data) {
      data = await GoogleUserData.findOne({ _id: req.user.id });
    }

    if (!data) {
      return res.status(400).send({ message: 'User Not Found' });
    }

    if (!flightId || !rating) {
      return res.status(400).json({ message: "Flight ID and rating are required." });
    }

    const extendedRating = {
      ...rating,
      userId: data._id,
      userName: data.userName
    };

    const result = await saveRating(flightId, extendedRating);
    console.log(result + " from saveRating");

    return res.status(200).json({ message: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server Error');
  }
});

router.post("/getratings", async (req, res) => {
  const { flightId } = req.body;
  if (!flightId) {
    return res.status(400).json({ message: "Flight ID is required." });
  }

  try {
    const flight = await flightsDataModel.findById(flightId, 'ratings');
    if (flight) {
      return res.status(200).json({ ratings: flight.ratings });
    } else {
      return res.status(400).json({ message: 'Flight not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});
router.post("/updaterating", async (req, res) => {
  const { flightId, rating } = req.body;

  if (!flightId || !rating || !rating.userId) {
    return res.status(400).json({ message: "Flight ID, rating, and userId are required." });
  }

  try {
    const flight = await flightsDataModel.findById(flightId);
    if (flight) {
      console.log('Flight found:', flight);
      const reviewIndex = flight.ratings.findIndex(r => r.userId === rating.userId);
      console.log('Review index:', reviewIndex);

      if (reviewIndex !== -1) {
        flight.ratings[reviewIndex] = { ...flight.ratings[reviewIndex], ...rating };
        console.log('Updated existing rating:', flight.ratings[reviewIndex]);
      } else {
        flight.ratings.push(rating);
        console.log('Added new rating:', rating);
      }

      await flight.save();
      return res.status(200).json({ message: 'Rating updated successfully', ratings: flight.ratings });
    } else {
      return res.status(400).json({ message: 'Flight not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});
router.get("/getdapartureairports", async (req, res) => {


  try {
    const departureAirport = await flightsDataModel.find({}, 'departureAirport');

    if (departureAirport) {
      return res.status(200).json({ departureAirport });
    } else {
      return res.status(400).json({ message: 'departureAirport not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});
router.get("/getarrivalairports", async (req, res) => {


  try {
    const arrivalAirport = await flightsDataModel.find({}, 'arrivalAirport');

    if (arrivalAirport) {
      return res.status(200).json({ arrivalAirport });
    } else {
      return res.status(400).json({ message: 'departureAirport not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

router.get("/flight-details/:id", async (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({ message: "id in not defined" });
    }

    await flightsDataModel
      .findOne({ _id: id })
      .then((data) => {
        return response.status(200).json({ flightDetails: data });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(500).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.post("/payment-checkout/flights", jwtAuthorization, async (req, response) => {
  try {
    const { bookingData } = req.body;
    let data;
    data = await userData.findOne({ _id: req.user.id });
    if (!data) {
      data = await GoogleUserData.findOne({ _id: req.user.id });
    }

    if (!data) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    console.log(data.id, "data._id")
    const customer = await stripe.customers.create({
      name: data.name,
      email: data.email,
      metadata: {
        userId: data.id,
      },
    });

    // const totalPrice =
    //   Number(bookingData.price?.adults) *
    //     Number(bookingData.totalPassengers?.adults) +
    //   Number(bookingData.price?.children) *
    //     Number(bookingData.totalPassengers?.children) +
    //   Number(bookingData.price?.infants) *
    //     Number(bookingData.totalPassengers?.infants);
    const totalPrice = bookingData?.price

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: bookingData.name,
              images: [bookingData.image],
              metadata: {
                journeyId: String(bookingData.journeyId),
                userId: String(data.id),  // Convert to string
                categoryId: bookingData.categoryId,
              },
            },
            unit_amount: totalPrice * 100,
          },
          quantity: Number(bookingData.totalPassengers),
        },
      ],
      metadata: {
        journeyId: String(bookingData.journeyId),
        userId: String(data.id),
        categoryId: bookingData.categoryId,
      },
      customer: customer.id,
      mode: "payment",
      success_url: "http://localhost:3000/flightpaymentsuccess",
      cancel_url: "http://localhost:3000/flightpaymentfailure",
    });

    const flightBooking = new flightBookingDataModel({
      journeyInfo: bookingData.journeyInfo,
      userId: String(data.id),  // Convert to string
      categoryId: bookingData.categoryId,
      totalPassengers: {
        adults: bookingData.totalPassengers,
      },
      passengersDetails: bookingData.passengersDetails,
      price: totalPrice,
      checkoutId: session.id,
      paymentStatus: "pending",
    });


    await flightBooking
      .save()
      .then((data) => {
        return response.status(200).json({ session: session });
      })
      .catch(async (error) => {
        await flightBooking.deleteOne;
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/flight-booking-passenger-details/:id",
  async (request, response) => {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ message: "id in not defined" });
      }

      await flightBookingDataModel
        .findOne({ _id: id })
        .then((data) => {
          return response
            .status(200)
            .json({ passengersDetails: data.passengersDetails });
        })
        .catch((error) => {
          console.log(error.message);
          return response.status(500).json({ message: error.message });
        });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
