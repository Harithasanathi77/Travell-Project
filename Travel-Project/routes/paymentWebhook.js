const express = require("express");
const {
  flightCheckoutSessionFunctions,
  hotelCheckoutSessionFunctions,
  busCheckoutSessionFunctions,
  trainCheckoutSessionFunctions,
  holidayPackagesCheckoutSessionFunctions,
} = require("../controller/controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEB_END_POINT
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSession = event.data.object;

        // Then define and call a function to handle the event
        switch (checkoutSession.metadata.categoryId) {
          case "FLIGHT":
            flightCheckoutSessionFunctions(checkoutSession);
            break;

          case "HOTEL":
            hotelCheckoutSessionFunctions(checkoutSession);
            break;

          case "BUS":
            busCheckoutSessionFunctions(checkoutSession);
            break;

          case "TRAIN":
            trainCheckoutSessionFunctions(checkoutSession);
            break;

          case "HOLIDAY_PACKAGES":
            holidayPackagesCheckoutSessionFunctions(checkoutSession);
            break;

          default:
            console.log("No Event Matched");
            break;
        }
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    // response.send();
  }
);

module.exports = router;
