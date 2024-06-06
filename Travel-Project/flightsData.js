const flightsData = [
  {
    departureTime: "2024-05-26T04:00:00",
    arrivalTime: "2024-05-26T07:30:00",
    departureDay: "Sunday",
    categoryId: "FLIGHT",
    currencyCode: "AED",
    departureAirport: {
      type: "AIRPORT",
      code: "HYD",
      city: "HYD",
      cityName: "Hyderabad",
      country: "IN",
      countryName: "India",
      name: "Rajiv Gandhi International Airport",
    },
    arrivalAirport: {
      type: "AIRPORT",
      code: "DXB",
      city: "DXB",
      cityName: "Dubai",
      country: "AE",
      countryName: "United Arab Emirates",
      name: "Dubai International Airport",
    },
    cabinClass: [
      {
        typeId: "ECONOMY",
        typeName: "Economy",
      },
      {
        typeId: "FIRST_CLASS",
        typeName: "First Class",
      },
      {
        typeId: "BUSINESS_CLASS",
        typeName: "Business Class",
      },
    ],
    facilities: [
      {
        facilityId: "FOOD_INCLUDED",
        name: "Food Included",
      },
      {
        facilityId: "DRINKS_INCLUDED",
        name: "Drinks Included",
      },
    ],
    flightNumber: 38264,
    carrierInfo: {
      name: "Air India",
      code: "AI",
      logo: "https://r-xx.bstatic.com/data/airlines_logo/AI.png",
    },
    duration: 12600,
    prices: [
      {
        cabinClassId: "ECONOMY",
        forAdult: 1909,
        forChildren: 1023,
        forInfant: 823,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        forAdult: 1600,
        forChildren: 1306,
        forInfant: 909,
      },
      {
        cabinClassId: "FIRST_CLASS",
        forAdult: 1790,
        forChildren: 1499,
        forInfant: 1145,
      },
    ],
    totalNumberOfSeats: [
      {
        cabinClassId: "ECONOMY",
        numberOfSeats: 120,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        numberOfSeats: 80,
      },
      {
        cabinClassId: "FIRST_CLASS",
        numberOfSeats: 50,
      },
    ],
    numberOfAvailableSeats: [
      {
        cabinClassId: "ECONOMY",
        availableSeats: 110,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        availableSeats: 78,
      },
      {
        cabinClassId: "FIRST_CLASS",
        availableSeats: 47,
      },
    ],
    baggage: [
      {
        type: "CABIN",
        luggageType: "Cabin Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 11,
        massUnit: "LB",
      },
      {
        type: "CHECK_IN",
        luggageType: "Check in Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 30.5,
        massUnit: "LB",
      },
    ],
    ratings: [
      {
        rating: 9.3,
        description: "Good",
        userId: "12634",
      },
    ],
  },
  {
    departureTime: "2024-05-28T12:00:00",
    arrivalTime: "2024-05-28T16:20:00",
    departureDay: "Tuesday",
    categoryId: "FLIGHT",
    currencyCode: "AED",
    departureAirport: {
      type: "AIRPORT",
      code: "DXB",
      city: "DXB",
      cityName: "Dubai",
      country: "AE",
      countryName: "United Arab Emirates",
      name: "Dubai International Airport",
    },
    arrivalAirport: {
      type: "AIRPORT",
      code: "HYD",
      city: "HYD",
      cityName: "Hyderabad",
      country: "IN",
      countryName: "India",
      name: "Rajiv Gandhi International Airport",
    },
    cabinClass: [
      {
        typeId: "ECONOMY",
        typeName: "Economy",
      },
      {
        typeId: "FIRST_CLASS",
        typeName: "First Class",
      },
      {
        typeId: "BUSINESS_CLASS",
        typeName: "Business Class",
      },
    ],
    facilities: [
      {
        facilityId: "FOOD_INCLUDED",
        name: "Food Included",
      },
      {
        facilityId: "DRINKS_INCLUDED",
        name: "Drinks Included",
      },
    ],
    flightNumber: 37643,
    carrierInfo: {
      name: "Air India",
      code: "AI",
      logo: "https://r-xx.bstatic.com/data/airlines_logo/AI.png",
    },
    duration: 15600,
    prices: [
      {
        cabinClassId: "ECONOMY",
        forAdult: 1299,
        forChildren: 1089,
        forInfant: 899,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        forAdult: 1369,
        forChildren: 1290,
        forInfant: 1075,
      },
      {
        cabinClassId: "FIRST_CLASS",
        forAdult: 1598,
        forChildren: 1370,
        forInfant: 1180,
      },
    ],
    totalNumberOfSeats: [
      {
        cabinClassId: "ECONOMY",
        numberOfSeats: 120,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        numberOfSeats: 80,
      },
      {
        cabinClassId: "FIRST_CLASS",
        numberOfSeats: 50,
      },
    ],
    numberOfAvailableSeats: [
      {
        cabinClassId: "ECONOMY",
        availableSeats: 115,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        availableSeats: 73,
      },
      {
        cabinClassId: "FIRST_CLASS",
        availableSeats: 42,
      },
    ],
    baggage: [
      {
        type: "CABIN",
        luggageType: "Cabin Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 11,
        massUnit: "LB",
      },
      {
        type: "CHECK_IN",
        luggageType: "Check in Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 30.5,
        massUnit: "LB",
      },
    ],
    ratings: [
      {
        rating: 8.2,
        description: "Good",
        userId: "12783",
      },
    ],
  },
  {
    departureTime: "2024-05-27T07:00:00",
    arrivalTime: "2024-05-27T22:15:00",
    categoryId: "FLIGHT",
    currencyCode: "AED",
    departureDay: "Monday",
    departureAirport: {
      type: "AIRPORT",
      code: "DXB",
      city: "DXB",
      cityName: "Dubai",
      country: "AE",
      countryName: "United Arab Emirates",
      name: "Dubai International Airport",
    },
    arrivalAirport: {
      type: "AIRPORT",
      code: "JFK",
      city: "NYC",
      cityName: "New York",
      country: "US",
      countryName: "United States",
      name: "John F. Kennedy International Airport",
    },
    cabinClass: [
      {
        typeId: "ECONOMY",
        typeName: "Economy",
      },
      {
        typeId: "FIRST_CLASS",
        typeName: "First Class",
      },
      {
        typeId: "BUSINESS_CLASS",
        typeName: "Business Class",
      },
    ],
    facilities: [
      {
        facilityId: "FOOD_INCLUDED",
        name: "Food Included",
      },
      {
        facilityId: "DRINKS_INCLUDED",
        name: "Drinks Included",
      },
      {
        facilityId: "WIFI",
        name: "Wi-fi",
      },
      {
        facilityId: "SCREEN_PER_SEAT",
        name: "Screen Per Seat",
      },
    ],
    flightNumber: 658234,
    carrierInfo: {
      name: "Emirates Airlines",
      code: "EK",
      logo: "https://r-xx.bstatic.com/data/airlines_logo/EK.png",
    },
    duration: 54900,
    prices: [
      {
        cabinClassId: "ECONOMY",
        forAdult: 4499,
        forChildren: 3589,
        forInfant: 3089,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        forAdult: 5180,
        forChildren: 4782,
        forInfant: 3990,
      },
      {
        cabinClassId: "FIRST_CLASS",
        forAdult: 6290,
        forChildren: 5190,
        forInfant: 4389,
      },
    ],
    totalNumberOfSeats: [
      {
        cabinClassId: "ECONOMY",
        numberOfSeats: 110,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        numberOfSeats: 70,
      },
      {
        cabinClassId: "FIRST_CLASS",
        numberOfSeats: 40,
      },
    ],
    numberOfAvailableSeats: [
      {
        cabinClassId: "ECONOMY",
        availableSeats: 101,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        availableSeats: 60,
      },
      {
        cabinClassId: "FIRST_CLASS",
        availableSeats: 33,
      },
    ],
    baggage: [
      {
        type: "CABIN",
        luggageType: "Cabin Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 11,
        massUnit: "LB",
      },
      {
        type: "CHECK_IN",
        luggageType: "Check in Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 30.5,
        massUnit: "LB",
      },
    ],
    ratings: [
      {
        rating: 9.2,
        description: "Good",
        userId: "34523",
      },
      {
        rating: 8.8,
        description: "Fine",
        userId: "6726",
      },
    ],
  },
  {
    departureTime: "2024-05-28T12:00:00",
    arrivalTime: "2024-05-29T03:15:00",
    categoryId: "FLIGHT",
    currencyCode: "AED",
    departureDay: "Tuesday",
    departureAirport: {
      type: "AIRPORT",
      code: "JFK",
      city: "NYC",
      cityName: "New York",
      country: "US",
      countryName: "United States",
      name: "John F. Kennedy International Airport",
    },
    arrivalAirport: {
      type: "AIRPORT",
      code: "DXB",
      city: "DXB",
      cityName: "Dubai",
      country: "AE",
      countryName: "United Arab Emirates",
      name: "Dubai International Airport",
    },
    cabinClass: [
      {
        typeId: "ECONOMY",
        typeName: "Economy",
      },
      {
        typeId: "FIRST_CLASS",
        typeName: "First Class",
      },
      {
        typeId: "BUSINESS_CLASS",
        typeName: "Business Class",
      },
    ],
    facilities: [
      {
        facilityId: "FOOD_INCLUDED",
        name: "Food Included",
      },
      {
        facilityId: "DRINKS_INCLUDED",
        name: "Drinks Included",
      },
      {
        facilityId: "WIFI",
        name: "Wi-fi",
      },
      {
        facilityId: "SCREEN_PER_SEAT",
        name: "Screen Per Seat",
      },
    ],
    flightNumber: 658234,
    carrierInfo: {
      name: "Emirates Airlines",
      code: "EK",
      logo: "https://r-xx.bstatic.com/data/airlines_logo/EK.png",
    },
    duration: 54900,
    prices: [
      {
        cabinClassId: "ECONOMY",
        forAdult: 4280,
        forChildren: 3900,
        forInfant: 2899,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        forAdult: 5210,
        forChildren: 4598,
        forInfant: 3499,
      },
      {
        cabinClassId: "FIRST_CLASS",
        forAdult: 6129,
        forChildren: 5489,
        forInfant: 4899,
      },
    ],
    totalNumberOfSeats: [
      {
        cabinClassId: "ECONOMY",
        numberOfSeats: 110,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        numberOfSeats: 70,
      },
      {
        cabinClassId: "FIRST_CLASS",
        numberOfSeats: 40,
      },
    ],
    numberOfAvailableSeats: [
      {
        cabinClassId: "ECONOMY",
        availableSeats: 103,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        availableSeats: 63,
      },
      {
        cabinClassId: "FIRST_CLASS",
        availableSeats: 31,
      },
    ],
    baggage: [
      {
        type: "CABIN",
        luggageType: "Cabin Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 11,
        massUnit: "LB",
      },
      {
        type: "CHECK_IN",
        luggageType: "Check in Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 30.5,
        massUnit: "LB",
      },
    ],
    ratings: [
      {
        rating: 9.6,
        description: "Good",
        userId: "3763",
      },
      {
        rating: 9.2,
        description: "Fine",
        userId: "38273",
      },
    ],
  },
  {
    departureTime: "2024-05-29T10:00:00",
    arrivalTime: "2024-05-29T19:30:00",
    categoryId: "FLIGHT",
    currencyCode: "AED",
    departureDay: "Wednesday",
    departureAirport: {
      type: "AIRPORT",
      code: "DXB",
      city: "DXB",
      cityName: "Dubai",
      country: "AE",
      countryName: "United Arab Emirates",
      name: "Dubai International Airport",
    },
    arrivalAirport: {
      type: "AIRPORT",
      code: "LHR",
      city: "LON",
      cityName: "London",
      country: "GB",
      countryName: "United Kingdom",
      name: "London Heathrow Airport",
    },
    cabinClass: [
      {
        typeId: "ECONOMY",
        typeName: "Economy",
      },
      {
        typeId: "FIRST_CLASS",
        typeName: "First Class",
      },
      {
        typeId: "BUSINESS_CLASS",
        typeName: "Business Class",
      },
    ],
    facilities: [
      {
        facilityId: "FOOD_INCLUDED",
        name: "Food Included",
      },
      {
        facilityId: "DRINKS_INCLUDED",
        name: "Drinks Included",
      },
      {
        facilityId: "WIFI",
        name: "Wi-fi",
      },
      {
        facilityId: "SCREEN_PER_SEAT",
        name: "Screen Per Seat",
      },
    ],
    flightNumber: 87678,
    carrierInfo: {
      name: "Qatar Airways",
      code: "QR",
      logo: "https://r-xx.bstatic.com/data/airlines_logo/QR.png",
    },
    duration: 34200,
    prices: [
      {
        cabinClassId: "ECONOMY",
        forAdult: 3150,
        forChildren: 2892,
        forInfant: 2379,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        forAdult: 4399,
        forChildren: 3480,
        forInfant: 2919,
      },
      {
        cabinClassId: "FIRST_CLASS",
        forAdult: 5159,
        forChildren: 4580,
        forInfant: 3290,
      },
    ],
    totalNumberOfSeats: [
      {
        cabinClassId: "ECONOMY",
        numberOfSeats: 140,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        numberOfSeats: 90,
      },
      {
        cabinClassId: "FIRST_CLASS",
        numberOfSeats: 60,
      },
    ],
    numberOfAvailableSeats: [
      {
        cabinClassId: "ECONOMY",
        availableSeats: 123,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        availableSeats: 79,
      },
      {
        cabinClassId: "FIRST_CLASS",
        availableSeats: 55,
      },
    ],
    baggage: [
      {
        type: "CABIN",
        luggageType: "Cabin Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 16,
        massUnit: "LB",
      },
      {
        type: "CHECK_IN",
        luggageType: "Check in Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 37.0,
        massUnit: "LB",
      },
    ],
    ratings: [
      {
        rating: 9.4,
        description: "Good",
        userId: "7873",
      },
      {
        rating: 9.0,
        description: "Fine",
        userId: "7843",
      },
    ],
  },
  {
    departureTime: "2024-05-30T04:00:00",
    arrivalTime: "2024-05-30T14:00:00",
    categoryId: "FLIGHT",
    currencyCode: "AED",
    departureDay: "Thursday",
    departureAirport: {
      type: "AIRPORT",
      code: "LHR",
      city: "LON",
      cityName: "London",
      country: "GB",
      countryName: "United Kingdom",
      name: "London Heathrow Airport",
    },
    arrivalAirport: {
      type: "AIRPORT",
      code: "DXB",
      city: "DXB",
      cityName: "Dubai",
      country: "AE",
      countryName: "United Arab Emirates",
      name: "Dubai International Airport",
    },
    cabinClass: [
      {
        typeId: "ECONOMY",
        typeName: "Economy",
      },
      {
        typeId: "FIRST_CLASS",
        typeName: "First Class",
      },
      {
        typeId: "BUSINESS_CLASS",
        typeName: "Business Class",
      },
    ],
    facilities: [
      {
        facilityId: "FOOD_INCLUDED",
        name: "Food Included",
      },
      {
        facilityId: "DRINKS_INCLUDED",
        name: "Drinks Included",
      },
      {
        facilityId: "WIFI",
        name: "Wi-fi",
      },
      {
        facilityId: "SCREEN_PER_SEAT",
        name: "Screen Per Seat",
      },
    ],
    flightNumber: 98898,
    carrierInfo: {
      name: "Qatar Airways",
      code: "QR",
      logo: "https://r-xx.bstatic.com/data/airlines_logo/QR.png",
    },
    duration: 32400,
    prices: [
      {
        cabinClassId: "ECONOMY",
        forAdult: 3255,
        forChildren: 2994,
        forInfant: 2470,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        forAdult: 4599,
        forChildren: 3583,
        forInfant: 3029,
      },
      {
        cabinClassId: "FIRST_CLASS",
        forAdult: 5265,
        forChildren: 4689,
        forInfant: 3495,
      },
    ],
    totalNumberOfSeats: [
      {
        cabinClassId: "ECONOMY",
        numberOfSeats: 140,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        numberOfSeats: 90,
      },
      {
        cabinClassId: "FIRST_CLASS",
        numberOfSeats: 60,
      },
    ],
    numberOfAvailableSeats: [
      {
        cabinClassId: "ECONOMY",
        availableSeats: 133,
      },
      {
        cabinClassId: "BUSINESS_CLASS",
        availableSeats: 82,
      },
      {
        cabinClassId: "FIRST_CLASS",
        availableSeats: 56,
      },
    ],
    baggage: [
      {
        type: "CABIN",
        luggageType: "Cabin Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 16,
        massUnit: "LB",
      },
      {
        type: "CHECK_IN",
        luggageType: "Check in Baggage",
        maxPiece: 1,
        maxWeightPerPiece: 37.0,
        massUnit: "LB",
      },
    ],
    ratings: [
      {
        rating: 9.5,
        description: "Good",
        userId: "6545",
      },
      {
        rating: 8.7,
        description: "Fine",
        userId: "4566",
      },
    ],
  },
];

module.exports = flightsData;
