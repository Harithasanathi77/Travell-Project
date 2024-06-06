const bwipjs = require("bwip-js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const flightsDataModel = require("../models/flightsDataSchema");
const flightBookingDataModel = require("../models/flightBookingDataSchema");
const { mailDetails } = require("../utils/mail");
const hotelsDataModel = require("../models/hotelsDataSchema");
const busesDataModel = require("../models/busesDataSchema");
const trainsDataModel = require("../models/trainsDataSchema");
const hotelBookingDataModel = require("../models/hotelBookingDataSchema");
const busBookingDataModel = require("../models/busesBookingDataSchema");
const trainBookingDataModel = require("../models/trainsBookingDataSchema");
const trainUserDataModel = require("../models/trainsUsersSchema");
const holidayPackagesDataModel = require("../models/holidayPackagesDataSchema");
const holidayPackageBookingDataModel = require("../models/holidayPackageBookingData");
const { format } = require("date-fns");
const puppeteer = require("puppeteer");
const uploadPdfToS3 = require("../utils/uploadPdfS3");
const busesSearchModel = require("../models/busesSchema");
const busesUserModel = require("../models/busUsersSchema");

exports.flightCheckoutSessionFunctions = async (checkoutSession) => {
  try {
    const customerId = checkoutSession.customer;
    const customerDetails = await stripe.customers.retrieve(customerId);
    // const successMsg = `<p>Hi, ${customerDetails.name}. Your Booking with id ${checkoutSession.id} is Confirmed.</p>`;
    // const journeyDetails = await flightsDataModel.findById({
    //   _id: checkoutSession.metadata.journeyId,
    // });

    const bookingDetailsData = await flightBookingDataModel.findOne({
      checkoutId: checkoutSession.id,
    });
    const journeyDetails = bookingDetailsData?.journeyInfo;

    let barCodeImageString = "";

    const options = {
      bcid: "code128", // Barcode type
      text: checkoutSession.id, // Text to encode
      scale: 5, // Scaling factor
      height: 50, // Bar height, in millimeters
      includetext: true, // Include human-readable text
      textxalign: "center", // Text alignment
      textfont: "Arial", // Font for human-readable text
      textsize: 10, // Font size for human-readable text
      rotate: "L",
    };

    // Generate the barcode image
    bwipjs
      .toBuffer(options)
      .then(async (png) => {
        const pngBase64String = png.toString("base64");

        await flightBookingDataModel.updateOne(
          { checkoutId: checkoutSession.id },
          {
            $set: {
              barcodeUrl: pngBase64String,
              seats: "1A",
              paymentStatus: "completed",
            },
          }
        );

        const formatDepartureDate = format(
          new Date(journeyDetails?.departureTime),
          "yyyy-MM-dd"
        );
        // const splitDepartureTime = journeyDetails?.departureTime.split(":");
        // const splitDuration = journeyDetails?.duration.split(" ");
        // const durationHours = () => {
        //   if (splitDuration[0]?.substring(splitDuration.length - 2) === "h") {
        //     return splitDuration[0]?.substring(0, splitDuration.length - 2);
        //   } else if (
        //     splitDuration[0]?.substring(splitDuration.length - 2) === "m"
        //   ) {
        //     return 0;
        //   }
        //   return 0;
        // };
        // const durationMin = () => {
        //   if (splitDuration[0]?.substring(splitDuration.length - 2) === "m") {
        //     return splitDuration[0]?.substring(0, splitDuration.length - 2);
        //   } else if (
        //     splitDuration[1]?.substring(splitDuration.length - 2) === "m"
        //   ) {
        //     return splitDuration[1]?.substring(0, splitDuration.length - 2);
        //   }
        //   return 0;
        // };
        // const arrivalDate = add(
        //   new Date(journeyDetails?.journeyDate).setHours(
        //     Number(splitDepartureTime[0]),
        //     Number(splitDepartureTime[1])
        //   ),
        //   {
        //     hours: Number(durationHours()),
        //     minutes: Number(durationMin()),
        //   }
        // );

        const formatArrivalDate = format(
          new Date(journeyDetails?.arrivalTime),
          "yyyy-MM-dd"
        );

        const formatDepartureTime = format(
          new Date(journeyDetails?.departureTime),
          "hh:mm a..aa"
        );

        const formatArrivalTime = format(
          new Date(journeyDetails?.arrivalTime),
          "hh:mm a..aa"
        );

        const durHours = Math.floor(journeyDetails?.duration / 3600);

        const durMinutes = Math.floor((journeyDetails?.duration % 3600) / 60);

        const formatDuration = `${durHours}h ${durMinutes}m`;

        const finalResult = {
          name: customerDetails.name,
          id: checkoutSession.id,
          seats: "1A",
          amount: checkoutSession.amount_total / 100,
          departureAirport: journeyDetails?.departureAirport.name,
          destinationAirport: journeyDetails?.arrivalAirport.name,
          providerLogo: journeyDetails?.carrierInfo.logo,
          flightProviderName: journeyDetails?.carrierInfo.name,
          departureTime: formatDepartureTime,
          arrivalTime: formatArrivalTime,
          barcode: pngBase64String,
          departureCity: journeyDetails?.departureAirport.cityName,
          arrivalCity: journeyDetails?.arrivalAirport.cityName,
          departureDate: formatDepartureDate,
          arrivalDate: formatArrivalDate,
          duration: formatDuration,
          seatClass: journeyDetails?.cabinClass[0].typeName,
        };

        ejs.renderFile(
          "./views/emailFlights.ejs",
          { ...finalResult },
          async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              // Render the EJS template
              const templatePath = path.resolve(
                __dirname,
                "../views/flight_ticket.ejs"
              );
              const htmlContent = await ejs.renderFile(templatePath, {
                ...finalResult,
              });

              // Launch Puppeteer and create PDF
              const browser = await puppeteer.launch({
                timeout: 60000,
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                userDataDir: "public/flightTickets",
              });
              const page = await browser.newPage();

              await page.setContent(htmlContent, { waitUntil: "networkidle0" });

              const pdfDoc = await page.pdf({
                path: `public/flightTickets/flight_ticket_${checkoutSession.id}.pdf`,
                format: "A4",
                printBackground: true,
              });

              const pdfUrl = await uploadPdfToS3(
                pdfDoc,
                `flighttickets/flight_ticket_${checkoutSession.id}.pdf`
              );

              await flightBookingDataModel.updateOne(
                { checkoutId: checkoutSession.id },
                { $set: { ticketPdfUrl: pdfUrl } }
              );

              await browser.close();

              console.log("Ticket PDF generated successfully.");

              const mailAttachments = {
                filename: "flight_ticket.pdf",
                content: pdfDoc,
                contentType: "application/pdf",
              };

              await mailDetails(
                customerDetails.email,
                checkoutSession.id,
                data,
                mailAttachments
              );
            }
          }
        );
        // console.log(pngBase64String);
        console.log("Barcode image generated successfully.");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
};

exports.hotelCheckoutSessionFunctions = async (checkoutSession) => {
  try {
    const customerId = checkoutSession.customer;
    const customerDetails = await stripe.customers.retrieve(customerId);
    // const successMsg = `<p>Hi, ${customerDetails.name}. Your Booking with id ${checkoutSession.id} is Confirmed.</p>`;
    const hotelDetails = await hotelsDataModel.findById({
      _id: checkoutSession.metadata.hotelId,
    });

    // let barCodeImageString = "";

    const options = {
      bcid: "code128",
      text: checkoutSession.metadata.bookingDetailsId,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    };

    // Generate the barcode image
    bwipjs
      .toBuffer(options)
      .then(async (png) => {
        const pngBase64String = png.toString("base64");

        await hotelBookingDataModel.updateOne(
          { _id: checkoutSession.metadata.bookingDetailsId },
          {
            $set: {
              barcodeUrl: pngBase64String,
              paymentStatus: "completed",
            },
          }
        );

        const hotelBookingDetails = await hotelBookingDataModel.findOne({
          _id: checkoutSession.metadata.bookingDetailsId,
        });
        const newCheckInDate = new Date(hotelBookingDetails?.checkIn);
        const newCheckOutDate = new Date(hotelBookingDetails?.checkOut);
        const checkInDateFormat = `${newCheckInDate.getFullYear()}-${newCheckInDate.getMonth()}-${newCheckInDate.getDate()}`;
        const checkOutDateFormat = `${newCheckOutDate.getFullYear()}-${newCheckOutDate.getMonth()}-${newCheckOutDate.getDate()}`;

        const finalResult = {
          name: customerDetails.name,
          id: checkoutSession.id,
          amount: checkoutSession.amount_total / 100,
          city: hotelDetails?.city,
          hotelLogo: hotelDetails?.hotelLogo,
          roomType: hotelBookingDetails?.roomType,
          hotelName: hotelDetails?.name,
          checkInTime: checkInDateFormat,
          checkOutTime: checkOutDateFormat,
          barcode: pngBase64String,
        };

        ejs.renderFile(
          "./views/hotelsEmail.ejs",
          { ...finalResult },
          async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              await mailDetails(
                customerDetails.email,
                checkoutSession.metadata.bookingDetailsId,
                data
              );
            }
          }
        );

        console.log("Barcode image generated successfully.");
      })
      .catch((error) => {
        console.log(error.message);
      });
  } catch (error) {
    console.log(error.message);
  }
};

exports.busCheckoutSessionFunctions = async (checkoutSession) => {
  try {
    const customerId = checkoutSession.customer;
    const customerDetails = await stripe.customers.retrieve(customerId);
    // const successMsg = `<p>Hi, ${customerDetails.name}. Your Booking with id ${checkoutSession.id} is Confirmed.</p>`;

    const busDetails = await busesSearchModel.findById({
      _id: checkoutSession.metadata.journeyId,
    });

    const options = {
      bcid: "code128",
      text: checkoutSession.metadata.bookingDetailsId,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    };

    // Generate the barcode image
    bwipjs
      .toBuffer(options)
      .then(async (png) => {
        const pngBase64String = png.toString("base64");

        await busesUserModel.updateOne(
          { _id: checkoutSession.metadata.bookingDetailsId },
          {
            $set: {
              barcodeUrl: pngBase64String,
              paymentStatus: "completed",
            },
          }
        );

        const busBookingDetails = await busesUserModel.findOne({
          _id: checkoutSession.metadata.bookingDetailsId,
        });

        const finalResult = {
          name: customerDetails.name,
          id: checkoutSession.metadata.bookingDetailsId,
          amount: `${
            checkoutSession.amount_total / 100
          } ${checkoutSession?.currency?.toUpperCase()}`,
          departure: busDetails?.fromDeparture,
          destination: busDetails?.toDestination,
          serviceNumber: busDetails?.serviceNumber,
          providerLogo: busDetails?.providerLogo,
          busProviderName: busDetails?.busName,
          departureTime: busDetails?.fromDepartureTime,
          arrivalTime: busDetails?.toArrivalTime,
          seats: busBookingDetails?.seatNumbers?.toString(),
          barcode: pngBase64String,
          ticketNumber: busBookingDetails?.ticketNumber,
          passengerDetails: busBookingDetails?.passengers,
        };

        ejs.renderFile(
          "./views/busesEmail.ejs",
          { ...finalResult },
          async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              await mailDetails(
                customerDetails.email,
                checkoutSession.id,
                data
              );
            }
          }
        );

        console.log("Barcode image generated successfully.");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
};

exports.trainCheckoutSessionFunctions = async (checkoutSession) => {
  try {
    const customerId = checkoutSession.customer;
    const customerDetails = await stripe.customers.retrieve(customerId);
    const successMsg = `<p>Hi, ${customerDetails.name}. Your Booking with id ${checkoutSession.id} is Confirmed.</p>`;
    const trainDetails = await trainsDataModel.findById({
      _id: checkoutSession.metadata.journeyId,
    });

    const options = {
      bcid: "code128",
      text: checkoutSession.id,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    };

    // Generate the barcode image
    bwipjs
      .toBuffer(options)
      .then(async (png) => {
        const pngBase64String = png.toString("base64");

        await trainBookingDataModel.updateOne(
          { checkoutId: checkoutSession.id },
          {
            $set: {
              barcodeUrl: pngBase64String,
              paymentStatus: "completed",
              seats: "A1 A2",
            },
          }
        );

        const trainBookingDetails = await trainBookingDataModel.findOne({
          checkoutId: checkoutSession.id,
        });

        const finalResult = {
          name: customerDetails.name,
          id: checkoutSession.id,
          amount: checkoutSession.amount_total / 100,
          departure: trainDetails?.departurePlace,
          destination: trainDetails?.destination,
          serviceNumber: trainDetails?.serviceNumber,
          providerLogo: trainDetails?.serviceLogo,
          trainProviderName: trainDetails?.trainName,
          departureTime: trainDetails?.departureTime,
          arrivalTime: trainDetails?.arrivalTime,
          seats: trainBookingDetails?.seats,
          barcode: pngBase64String,
        };

        ejs.renderFile(
          "./views/trainsEmail.ejs",
          { ...finalResult },
          async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              await mailDetails(
                customerDetails.email,
                checkoutSession.id,
                data
              );
            }
          }
        );

        console.log("Barcode image generated successfully.");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
};

exports.holidayPackagesCheckoutSessionFunctions = async (checkoutSession) => {
  try {
    const customerId = checkoutSession.customer;
    const customerDetails = await stripe.customers.retrieve(customerId);
    // const successMsg = `<p>Hi, ${customerDetails.name}. Your Booking with id ${checkoutSession.id} is Confirmed.</p>`;
    const packageDetails = await holidayPackagesDataModel.findById({
      _id: checkoutSession.metadata.packageId,
    });

    // let barCodeImageString = "";

    const options = {
      bcid: "code128",
      text: checkoutSession.id,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    };

    // Generate the barcode image
    bwipjs
      .toBuffer(options)
      .then(async (png) => {
        const pngBase64String = png.toString("base64");

        await holidayPackageBookingDataModel.updateOne(
          { checkoutId: checkoutSession.id },
          {
            $set: {
              barcodeUrl: pngBase64String,
              paymentStatus: "completed",
            },
          }
        );

        const holidayPackageBookingDetails =
          await holidayPackageBookingDataModel.findOne({
            checkoutId: checkoutSession.id,
          });

        const newCheckInDate = new Date(packageDetails?.journeyDate);
        const newCheckOutDate = new Date(packageDetails?.returnDate);
        const checkInDateFormat = `${newCheckInDate.getFullYear()}-${newCheckInDate.getMonth()}-${newCheckInDate.getDate()}`;
        const checkOutDateFormat = `${newCheckOutDate.getFullYear()}-${newCheckOutDate.getMonth()}-${newCheckOutDate.getDate()}`;

        const finalResult = {
          name: customerDetails.name,
          id: checkoutSession.id,
          amount: checkoutSession.amount_total / 100,
          city: packageDetails?.departureCity,
          providerLogo: packageDetails?.providerLogo,
          providerName: packageDetails?.providerName,
          departureDate: checkInDateFormat,
          returnDate: checkOutDateFormat,
          barcode: pngBase64String,
        };

        ejs.renderFile(
          "./views/packagesEmail.ejs",
          { ...finalResult },
          async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              await mailDetails(
                customerDetails.email,
                checkoutSession.id,
                data
              );
            }
          }
        );

        console.log("Barcode image generated successfully.");
      })
      .catch((error) => {
        console.log(error.message);
      });
  } catch (error) {
    console.log(error.message);
  }
};

exports.generateBookingNo = async () => {
  const maxTries = 7;
  const attempts = 0;
  let BookingNo;

  while (attempts < maxTries) {
    const dateNow = new Date(Date.now());

    BookingNo = `IDRIS-HOTEL-${dateNow.getFullYear()}${(
      dateNow.getMonth() + 1
    )

      .toString()
      .padStart(2, "0")}${dateNow
      .getDate()
      .toString()
      .padStart(2, "0")}${dateNow
      .getHours()
      .toString()
      .padStart(2, "0")}${dateNow
      .getMinutes()
      .toString()
      .padStart(2, "0")}${dateNow
      .getSeconds()
      .toString()
      .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isBookingNumberExists = await hotelBookingDataModel.findOne({
      BookingNo: BookingNo,
    });

    if (!isBookingNumberExists) {
      return BookingNo;
    }
    attempts++;
  }

  throw new Error("Failed to Generate a Ticket, Please Try Again");
};



exports.generateBusTicketNumber = async () => {


 
    const maxTries = 7;
    const attempts = 0;
    let ticketNumber;
    
  
    while (attempts < maxTries) {
      const dateNow = new Date(Date.now());
  
      ticketNumber = `IDRIS-BUS-${dateNow.getFullYear()}${(dateNow.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${dateNow
        .getDate()
        .toString()
        .padStart(2, "0")}${dateNow
        .getHours()
        .toString()
        .padStart(2, "0")}${dateNow
        .getMinutes()
        .toString()
        .padStart(2, "0")}${dateNow
        .getSeconds()
        .toString()
        .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
  
      const isTicketNumberExists = await busesUserModel.findOne({
        ticketNumber: ticketNumber,
  
      
      });
  
      if (!isTicketNumberExists) {
        return ticketNumber;
      
      }
      attempts++;
    }
  
    throw new Error("Failed to Generate a Ticket, Please Try Again");
  
  };
