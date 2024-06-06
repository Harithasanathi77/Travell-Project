const express = require("express");
const holidayPackagesDataModel = require("../models/holidayPackagesDataSchema");
const holidayPackageBookingDataModel = require("../models/holidayPackageBookingData");
const holidayPackageTicketModel = require("../models/holidayPackageTicketSchema");
const jwtAuthorization = require("../utils/jwtmiddleware");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.get("/get-all-holiday-packages", async (request, response) => {
  try {
    holidayPackagesDataModel
      .find()
      .then((dataObject) => {
        return response.status(200).json({ packages: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/payment-checkout", async (request, response) => {
  try {
    const { userId, name, email, bookingData } = request.body;

    const customer = await stripe.customers.create({
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
            currency: "inr",
            product_data: {
              name: bookingData.name,
              images: [bookingData.image],
              metadata: {
                packageId: bookingData.packageId,
                userId: userId,
                categoryId: bookingData.categoryId,
              },
            },
            unit_amount: bookingData.price * 100,
          },
          quantity: bookingData.quantity,
        },
      ],
      metadata: {
        packageId: bookingData.packageId,
        userId: userId,
        categoryId: bookingData.categoryId,
      },
      customer: customer.id,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failure",
    });

    const packageBooking = new holidayPackageBookingDataModel({
      packageId: bookingData.packageId,
      categoryId: bookingData.categoryId,
      price: bookingData.price * bookingData.quantity,
      checkoutId: session.id,
      paymentStatus: "pending",
      userId: userId,
      totalPersons: bookingData.quantity,
    });

    await packageBooking
      .save()
      .then((data) => {
        return response.status(200).json({ session: session });
      })
      .catch(async (error) => {
        await packageBooking.deleteOne;
        console.log(error.message);
        return response.status(400).json({ message: "Something Went Wrong" });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/saveTicketData", jwtAuthorization, async (req, res) => {
  const {
    packageId,
    mainImage,
    packageName,
    price,
    journeyDate,
    departureTime,
    adultCount,
    childCount,
    infantCount,
    totalAdultPrice,
    totalChildPrice,
    totalPrice,
    ticketsToName,
    ticketsToSurname,
    ticketsToMobileNumber,
    ticketsToEmail,
  } = req.body;
  try {
    let data;
    data = await holidayPackageTicketModel.create({
      userId: req.user.id,
      packageId,
      mainImage,
      packageName,
      price,
      journeyDate,
      departureTime,
      adultCount,
      childCount,
      infantCount,
      totalAdultPrice,
      totalChildPrice,
      totalPrice,
      ticketsToSend: {
        ticketsToName,
        ticketsToSurname,
        ticketsToMobileNumber,
        ticketsToEmail,
      },
      isPayment: false,
    });
    if (!data) {
      return res.status(400).send({ message: "Data Not Saved" });
    }
    return res.json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

router.post("/addpackage", async (req, res) => {
  const { packageName, price, mainImage } = req.body;
  try {
    let data;
    data = await holidayPackagesDataModel.create({
      packageName,
      price,
      mainImage,
    });
    if (!data) {
      return res.status(400).send({ message: "Data Not Saved" });
    }
    return res.json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});
router.put("/updatePackage/:id", async (req, res) => {
  const id = req.params.id;
  const {
    noOfGroup,
    duration,
    departureArrivingAreas,
    guideService,
    language,
    entryFees,
    entryTransportation,
  } = req.body;
  const updateData = {
    noOfGroup,
    duration,
    departureArrivingAreas,
    guideService,
    language,
    entryFees,
    entryTransportation,
  };
  try {
    let data;
    data = await holidayPackagesDataModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!data) {
      return res.status(400).send({ message: "Data Not Saved" });
    }
    return res.json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
