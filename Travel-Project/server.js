const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const dbConfig = require("./utils/dbConfig");

const dotenv = require("dotenv");

const bodyParser = require("body-parser");
const busesSearchModel = require("./models/busesSchema");
const { kMaxLength } = require("buffer");

require("dotenv").config();
const { json } = require("body-parser");
const app = express();
const port = 4444 || process.env.PORT;

// const corsOptions = {
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   credentials: true, // Allow cookies to be sent with the request
// };
// app.use(cors(corsOptions));

// app.use(express.json());

const cookieParser = require("cookie-parser");
const flightsDataModel = require("./models/flightsDataSchema");
const flightsData = require("./flightsData");
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with the request
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use((req, res, next) => {
  if (req.originalUrl.includes("/webhook")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

mongoose
  .connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

app.use("/", require("./routes/googleAuth"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/flights", require("./routes/flightsRoutes"));
app.use("/hotels", require("./routes/hotelsRoutes"));
app.use("/buses", require("./routes/busesRoutes"));
app.use("/trains", require("./routes/trainsRoutes"));
app.use("/holiday-packages", require("./routes/holidayPackagesRoutes"));
app.use(require("./routes/paymentWebhook"));

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

// const busesData = [
//   {
//     busName: "Dubai Express",
//     fromDeparture: "Dubai",
//     toDestination: "Abu Dhabi",
//     fromDepartureTime: "08:00",
//     toArrivalTime: "10:30",
//     fare: "100",
//     timeDuration: "2h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "140kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["Mussafah", "Corniche", "Al Wahda Mall"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Emirates Travels",
//     fromDeparture: "Abu Dhabi",
//     toDestination: "Dubai",
//     fromDepartureTime: "11:00",
//     toArrivalTime: "13:30",
//     fare: "95",
//     timeDuration: "2h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "140kms",
//     boardingPoints: ["Mussafah", "Corniche", "Al Wahda Mall"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Gulf Transport",
//     fromDeparture: "Dubai",
//     toDestination: "Sharjah",
//     fromDepartureTime: "09:00",
//     toArrivalTime: "09:45",
//     fare: "30",
//     timeDuration: "45m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "30kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["Al Majaz", "Sharjah Mega Mall", "Al Rolla"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Rapid Buses",
//     fromDeparture: "Sharjah",
//     toDestination: "Dubai",
//     fromDepartureTime: "10:00",
//     toArrivalTime: "10:45",
//     fare: "30",
//     timeDuration: "45m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "30kms",
//     boardingPoints: ["Al Majaz", "Sharjah Mega Mall", "Al Rolla"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Luxury Coaches",
//     fromDeparture: "Sharjah",
//     toDestination: "Al Ain",
//     fromDepartureTime: "07:30",
//     toArrivalTime: "10:00",
//     fare: "120",
//     timeDuration: "2h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "150kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["Al Ain Mall", "Jebel Hafeet", "Al Ain Zoo"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Desert Tours",
//     fromDeparture: "Al Ain",
//     toDestination: "Dubai",
//     fromDepartureTime: "15:00",
//     toArrivalTime: "17:30",
//     fare: "120",
//     timeDuration: "2h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "150kms",
//     boardingPoints: ["Al Ain Mall", "Jebel Hafeet", "Al Ain Zoo"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Metro Travels",
//     fromDeparture: "Dubai",
//     toDestination: "Fujairah",
//     fromDepartureTime: "06:00",
//     toArrivalTime: "09:00",
//     fare: "150",
//     timeDuration: "3h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "200kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["Fujairah City Center", "Fujairah Fort", "Al Aqah"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Oceanic Buses",
//     fromDeparture: "Fujairah",
//     toDestination: "Dubai",
//     fromDepartureTime: "10:00",
//     toArrivalTime: "13:00",
//     fare: "150",
//     timeDuration: "3h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "200kms",
//     boardingPoints: ["Fujairah City Center", "Fujairah Fort", "Al Aqah"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Sunshine Travels",
//     fromDeparture: "Dubai",
//     toDestination: "Ras Al Khaimah",
//     fromDepartureTime: "14:00",
//     toArrivalTime: "16:00",
//     fare: "90 ",
//     timeDuration: "2h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "115kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["RAK Mall", "Al Hamra Village", "RAK City Center"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "City Connect",
//     fromDeparture: "Ras Al Khaimah",
//     toDestination: "Dubai",
//     fromDepartureTime: "17:00",
//     toArrivalTime: "19:00",
//     fare: "90",
//     timeDuration: "2h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "115kms",
//     boardingPoints: ["RAK Mall", "Al Hamra Village", "RAK City Center"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Desert Sands",
//     fromDeparture: "Abu Dhabi",
//     toDestination: "Al Ain",
//     fromDepartureTime: "08:30",
//     toArrivalTime: "10:00",
//     fare: "70",
//     timeDuration: "1h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "130kms",
//     boardingPoints: ["Mussafah", "Corniche", "Al Wahda Mall"],
//     droppingPoints: ["Al Ain Mall", "Jebel Hafeet", "Al Ain Zoo"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Coastal Travels",
//     fromDeparture: "Fujairah",
//     toDestination: "Sharjah",
//     fromDepartureTime: "11:00",
//     toArrivalTime: "13:00",
//     fare: "80",
//     timeDuration: "2h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "105kms",
//     boardingPoints: ["Fujairah City Center", "Fujairah Fort", "Al Aqah"],
//     droppingPoints: ["Al Majaz", "Sharjah Mega Mall", "Al Rolla"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Mountain Transport",
//     fromDeparture: "Ras Al Khaimah",
//     toDestination: "Sharjah",
//     fromDepartureTime: "13:00",
//     toArrivalTime: "15:00",
//     fare: "85",
//     timeDuration: "2h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "120kms",
//     boardingPoints: ["RAK Mall", "Al Hamra Village", "RAK City Center"],
//     droppingPoints: ["Al Majaz", "Sharjah Mega Mall", "Al Rolla"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Eastern Star",
//     fromDeparture: "Sharjah",
//     toDestination: "Abu Dhabi",
//     fromDepartureTime: "07:00",
//     toArrivalTime: "10:00",
//     fare: "110",
//     timeDuration: "3h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "150kms",
//     boardingPoints: ["Al Majaz", "Sharjah Mega Mall", "Al Rolla"],
//     droppingPoints: ["Mussafah", "Corniche", "Al Wahda Mall"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Palm Travels",
//     fromDeparture: "Dubai",
//     toDestination: "Ajman",
//     fromDepartureTime: "16:00",
//     toArrivalTime: "17:00",
//     fare: "40",
//     timeDuration: "1h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "50kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["Ajman Beach", "Ajman City Center", "Ajman Corniche"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Royal Bus",
//     fromDeparture: "Ajman",
//     toDestination: "Dubai",
//     fromDepartureTime: "18:00",
//     toArrivalTime: "19:00",
//     fare: "40",
//     timeDuration: "1h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "50kms",
//     boardingPoints: ["Ajman Beach", "Ajman City Center", "Ajman Corniche"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Oasis Travels",
//     fromDeparture: "Dubai",
//     toDestination: "Umm Al Quwain",
//     fromDepartureTime: "12:00",
//     toArrivalTime: "13:30",
//     fare: "60",
//     timeDuration: "1h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "70kms",
//     boardingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     droppingPoints: ["UAQ Beach", "UAQ Fort", "UAQ Aquarium"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Desert Rose",
//     fromDeparture: "Umm Al Quwain",
//     toDestination: "Dubai",
//     fromDepartureTime: "14:00",
//     toArrivalTime: "15:30",
//     fare: "60",
//     timeDuration: "1h 30m",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "70kms",
//     boardingPoints: ["UAQ Beach", "UAQ Fort", "UAQ Aquarium"],
//     droppingPoints: ["Deira", "Al Barsha", "Dubai Marina"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Skyline Buses",
//     fromDeparture: "Sharjah",
//     toDestination: "Fujairah",
//     fromDepartureTime: "09:00",
//     toArrivalTime: "11:00",
//     fare: "75",
//     timeDuration: "2h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "100kms",
//     boardingPoints: ["Al Majaz", "Sharjah Mega Mall", "Al Rolla"],
//     droppingPoints: ["Fujairah City Center", "Fujairah Fort", "Al Aqah"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "City Liner",
//     fromDeparture: "Ajman",
//     toDestination: "Al Ain",
//     fromDepartureTime: "13:00",
//     toArrivalTime: "16:00",
//     fare: "100",
//     timeDuration: "3h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "140kms",
//     boardingPoints: ["Ajman Beach", "Ajman City Center", "Ajman Corniche"],
//     droppingPoints: ["Al Ain Mall", "Jebel Hafeet", "Al Ain Zoo"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
//   {
//     busName: "Capital Connect",
//     fromDeparture: "Abu Dhabi",
//     toDestination: "Ajman",
//     fromDepartureTime: "07:00",
//     toArrivalTime: "10:00",
//     fare: "110",
//     timeDuration: "3h",
//     noOfSeats: "40",
//     classAC: "A-C Sleeper(2+1)",
//     distance: "170kms",
//     boardingPoints: ["Mussafah", "Corniche", "Al Wahda Mall"],
//     droppingPoints: ["Ajman Beach", "Ajman City Center", "Ajman Corniche"],
//     journeyDateRange: {
//       startDate: new Date("2024-06-01"),
//       endDate: new Date("2024-12-31"),
//     },
//   },
// ];

// async function insertBusesData() {
//   try {
//     // Delete existing data before inserting new data
//     await busesSearchModel.deleteMany();
//     // Insert the array of bus data into the database
//     const insertedData = await busesSearchModel.insertMany(busesData);
//   } catch (error) {
//     console.error("Error inserting buses data:", error);
//   }
// }
