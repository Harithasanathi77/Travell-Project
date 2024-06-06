const express = require("express");
const trainsDataModel = require("../models/trainsDataSchema");
const trainBookingDataModel = require("../models/trainsBookingDataSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const trainUserdtls=require("../models/trainsUsersSchema")

const router = express.Router();

 let trainDetails=[
  {
    // trainName:'Etihad Rail',serviceLogo:'D3457U',serviceNumber:'D3458U',departurePlace:'Al Sila',destination:'Fujairah',departureTime:'8:00 PM',arrivalTime:'7:50 PM',journeyDate:'2024-05-22',price:'600',duration:'3hr-10min',coachId:'genaral',avilable:'yes',categoryId:'S960C'
    
              
              trainnumber: '125679',
              trainName: 'Sunset Route',
              departureTime: '6:40 AM',
              journeyDate:'2024-05-24',
              arrivalTime: '11:30 AM',
              source: 'Los Angeles',
              destination: 'San Francisco',
              arrivalStationCode:'LA',
              departureStationCode:'SFRNS',
              price1: '550',
              class1: 'General',
              price2: '1500',
              class2: '2S',
              price3: '2500',
              class3: 'Sleeper',
              price4: '550',
              class4: '3A',
              price5: '1500',
              class5: '2A',
              price6: '2500',
              class6: '1A',
              available: 'Not Available',
              quota1: 'General',
              quota2: 'Tatkal',
              quota3: 'Ladies'
              
  
              // classes: [
              //     { classType: 'Economy', price: '550', availability: 'Available' },
              //     { classType: 'Business', price: '800', availability: 'Waitlist' },
              //     { classType: 'First', price: '1200', availability: 'Available' }
              // ]
          }
  // {"S960D"
  //   trainName:'Etihad Rail',serviceLogo:'D3457U',serviceNumber:'D3458P',departurePlace:'Al Sila',destination:'Fujairah',departureTime:'12:00 PM',arrivalTime:'4:50 PM',journeyDate:'2024-05-20',price:'600',duration:'2hr-10min',coachId:'D3457U-D',categoryId:'S960P'
  // }
 ]

 console.log("hi--1")
router.post("/savetrain",async(req,res)=>
{

  console.log("data -------")
  trainsDataModel
  .insertMany(trainDetails)
  .then((res)=>console.log(res))
  .then((err)=>{console.log("err")})
})
// function updateNestedArray()
// {
//   const filter = {journeyDate: '2024-05-24' };
//   const update = {
//     $set: { journeyDate: '2024-05-25' }
//   };
//   trainsDataModel.updateMany(filter, update)
//   .then((res)=>console.log('YES'))
//   .catch((err)=>console.log('err'))
// }

// updateNestedArray();

//get to ladies coach

// router.get("/get-all-trains/avilable", async (request, response) => { try {
  
//   let tavilable=request.query.avilable;

//   console.log(tavilable)


//   trainsDataModel
//     .find({avilable:tavilable})
//     .then((dataObject) => {
//       return response.status(200).json({ trains: dataObject });
//     })
//     .catch((error) => {
//       return response.status(400).json({ message: error.message });
//     });
// } catch (error) {
//   console.log(error.message);
//   return response.status(500).json({ message: "Internal Server Error" });
// }})

router.get("/get-all-trains/ladies", async (request, response) => { try {
  
  let ladies=request.query.ladies;

  console.log(ladies)
  // {departurePlace:starting,destination:ending}

  trainsDataModel
    .find({quota3:ladies})
    .then((dataObject) => {
      return response.status(200).json({ trains: dataObject });
    })
    .catch((error) => {
      return response.status(400).json({ message: error.message });
    });
} catch (error) {
  console.log(error.message);
  return response.status(500).json({ message: "Internal Server Error" });
}})

//find by pnr

router.get("/get-all-trains/trinenumber", async (request, response) => { try {
  
  let trinumber=request.query.tnumber;

  console.log(request.query.tnumber)
  // {departurePlace:starting,destination:ending}

  trainsDataModel
    .find({trainnumber:trinumber})
    .then((dataObject) => {
      return response.status(200).json({ trains: dataObject });
    })
    .catch((error) => {
      return response.status(400).json({ message: error.message });
    });
} catch (error) {
  console.log(error.message);
  return response.status(500).json({ message: "Internal Server Error" });
}})


           //to get genaral coach trains
router.get("/get-all-trains/genaral", async (request, response) => { try {
  
  let genaral=request.query.genral;

  console.log(genaral)
  // {departurePlace:starting,destination:ending}

  trainsDataModel
    .find({quota1:genaral})
    .then((dataObject) => {
      return response.status(200).json({ trains: dataObject });
    })
    .catch((error) => {
      return response.status(400).json({ message: error.message });
    });
} catch (error) {
  console.log(error.message);
  return response.status(500).json({ message: "Internal Server Error" });
}})

router.get("/get-all-trains/date", async (request, response) => {
  try {
 
    // let date=request.query.journydate;
    let starting=request.query.from;
    let ending=request.query.to;
    let date=request.query.journydate;
    console.log(starting);
    console.log(ending);
    console.log(date)
 
    
   

    trainsDataModel
      .find({source:starting,destination:ending,journeyDate:date})
      .then((dataObject) => {
        return response.status(200).json({ trains: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-all-trains/tnametrack", async (request, response) => {
  try {
  
    // let date=request.query.journydate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startingp=request.query.searchtrainname;
    let endingp=request.query.searchtrainplace;
    
    console.log(startingp);
    console.log(endingp);

  
  
   

    trainsDataModel
      .find({source:startingp,destination:endingp,journeyDate:{ $gte: today }})
      .then((dataObject) => {
        return response.status(200).json({ trains: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-all-trains", async (request, response) => {
  try {
    let starting=request.query.from;
    let ending=request.query.to;
    let date=request.query.journydate;
    console.log(starting);
    console.log(ending);
    console.log(date)
    // departurePlace:starting,destination:ending,journeyDate:date

    trainsDataModel
      .find({source:starting,destination:ending,journeyDate:date})
  
      .then((dataObject) => {
        console.log(trains)
        return response.status(200).json({ trains: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

//tatcal trains

router.get("/get-all-trains/tatkal", async (request, response) => {
  try {
  let traindate ='18-05-2024'
    
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    trainsDataModel
      .find({  journeyDate: {
        $gte: startOfDay,
        $lte: endOfDay
    }})
      .then((dataObject) => {
        return response.status(200).json({ trains: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

//get all train booking 
router.get("/get-all-bookings", async (request, response) => {
  try {
  
    // departurePlace:starting,destination:ending,journeyDate:date

    trainBookingDataModel
      .find()
      .then((dataObject) => {
        return response.status(200).json({ trains: dataObject });
      })
      .catch((error) => {
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

//save the the booking details of passanger

router.post("/trainsbooking", async (request, response) => {
  try {

   let  {Pname,pgender,page,berthPreference,selectedStation,pemail,phonenum}=request.body;
    // let {journeyId,userId,categoryId,seats,totalPassengers,price,checkoutId,paymentStatus}=request.body;
  // let {selectedClass,selectedQuota,psgcount,selectedAmount}=request.body;
    // let ticketclass=request.body.ticketclass;
    // let berthPreference=request.body.berthPreference;
    // let psgcount=request.body.psgcount;
    //  let ticketclass=request.query.ticketclass;
    //  let berthPreference=request.query.berthPreference;
    //  let count=request.query.psgcount;

    // let paymente=amount*
    let array=[
      {
        UserName:Pname,
        Gender:pgender,
        Age:page,
        contactNo:phonenum,
        contactEmail:pemail, 
        journeyId:null,
        userId:null,
        BordingPoint:selectedStation,
        categoryId:null,
        seats:berthPreference,
        totalPassengers:null,
        price:null,
        checkoutId:null,
        paymentStatus:null,
        barcodeUrl:null
      }
    ]
    

    console.log(Pname);
    console.log(pgender);
  
  
    console.log(page);
    console.log(berthPreference);
    console.log(selectedStation);
    console.log(phonenum);
    console.log(pemail)
   

    trainBookingDataModel
          .create(array)
  
      .then((dataObject) => {
        return response.status(200).json({ trains: dataObject });
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
                journeyId: bookingData.journeyId,
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
        journeyId: bookingData.journeyId,
        userId: userId,
        categoryId: bookingData.categoryId,
      },
      customer: customer.id,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failure",
    });

    const trainBooking = new trainBookingDataModel({
      journeyId: bookingData.journeyId,
      userId: userId,
      categoryId: bookingData.categoryId,
      totalPassengers: bookingData.quantity,
      price: bookingData.price * bookingData.quantity,
      checkoutId: session.id,
      paymentStatus: "pending",
    });

    await trainBooking
      .save()
      .then((data) => {
        return response.status(200).json({ session: session });
      })
      .catch(async (error) => {
        await trainBooking.deleteOne;
        console.log(error.message);
        return response.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
