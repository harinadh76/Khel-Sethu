const express = require("express");
require('dotenv').config({path: __dirname + '/.env'})
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const eventModule = require("./models/events");
const RegisterModule = require("./models/RegisterModel");
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')
const { json } = require('body-parser')
const eventRegistration = require('./models/Registration')


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose
  .connect(
    process.env.MONGODB,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(express.json());



// 1. Rendering Files
app.get("/details", (req, res) => {
  res.render('details')
});





app.get("/", (req, res) => {
  eventModule.find({}).then((data) => {
    res.render("index", { event: data });
  })
});
app.get("/loginUser", (req, res) => {
  res.render('login')
});
app.get("/registerUser", (req, res) => {
  res.render('signup')
});
app.get("/contactUs", (req, res) => {
  res.render('contact')
})
app.get("/about", (req, res) => {
  res.render('about')
})
app.get("/checkevents", (req, res) => {
  eventModule.find({}).then((data) => {
    res.render("events", { event: data });
  })

})
app.get("/logout", (req, res) => {
  localStorage.clear()
  res.redirect('/')
})




//admindashboard
app.get("/admindashboard", (req, res) => {
  res.sendFile(__dirname + "/adminDashboard.html");
})
//admin module files
app.get("/addEvent", async (req, res) => {
  res.sendFile(__dirname + "/newevent.html");
})
// admin updating part
app.post("/updateEvent/:id", async (req, res) => {

  try {
    eventModule.findById(req.params.id).then((data) => {
      console.log(data);
      res.render('updateEvent', { data: data })
    })
  } catch (err) {
    res.json({ message: err });
  }
})
app.get("/viewevents", (req, res) => {
  eventModule.find({}).then((data) => {
    res.render("adminViewEvents", { event: data });
  })
})

//2. CRUD OPERATIONS

//create
app.post("/create", async (req, res) => {
  console.log(req.body);
  const event = new eventModule({
    name: req.body.name,
    description: req.body.description,
    photo: req.body.photo,
    time: req.body.time,
    mode: req.body.mode,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    venue: req.body.venue,
    category: req.body.category,
    registerationFee: req.body.registerationFee,
    cashPrice: req.body.cashPrice,
    contact: req.body.contact
  });

  try {
    await event.save();
    res.redirect("/viewevents");
  } catch (err) {
    res.json({ message: err });
  }
});

//show all events for clients

app.get("/showAllEvents", async (req, res) => {
  try {
    const events = await eventModule.find();
    // res.json({ events });


    eventModule.find({}).then((data) => {
      res.render("showevent", { event: data });
    })
  } catch (err) {
    res.json({ message: err });
  }
});


app.get("/fetchdetails/:id",function(req,res){
  try{
    eventModule.findById(req.params.id).then((data)=>{
      res.render("details",{event:data})
    })
  }
  catch(err){
    res.json({ message: err });
  }


});

//read
app.get("/events/:eventId", async (req, res) => {
  try {
    const event = await eventModule.findById(req.params.eventId);
    // res.json({ event });
    res.render("details")
  } catch (err) {
    res.json({ message: err });
  }
});

//update
app.post("/events/:eventId", async (req, res) => {
  const {
    name,
    description,
    photo,
    time,
    mode,
    dateStart,
    dateEnd,
    venue,
    category,
    registerationFee,
    cashPrice,
    contact
  } = req.body;
  try {
    const updatedEvent = await eventModule.findByIdAndUpdate(
      req.params.eventId,
      {
        name,
        description,
        photo,
        time,
        mode,
        dateStart,
        dateEnd,
        venue,
        category,
        registerationFee,
        cashPrice,
        contact
      }
    );

    if (!updatedEvent) {
      res.json({ message: "Event not found" });
    }

    updatedEvent = await updatedEvent.save();
    res.redirect("/viewevents");
  } catch (err) {
    res.redirect("/viewevents");
  }
});

//delete
app.post("/deleteEvents/:eventId", async (req, res) => {
  try {
    const removedEvent = await eventModule.findByIdAndRemove(
      req.params.eventId
    );
    res.redirect("/viewevents")
  } catch (err) {
    res.json({ message: err });
  }
});

// User Registering for an event + Payments

app.post("/testing", async(req,res)=>{
    const register = new eventRegistration({
      name:req.body.name,
      email:req.body.email,
      phnumber:req.body.mobile,
      year:req.body.yos,
      event:req.body.events,
      amount:req.body.amount,
      transactionid:req.body.transactionid
    })

    try{
      await register.save();
      res.redirect("/checkevents")

    }
    catch(err){
      console.log(err);
    }
})

// admin view for viewing student Registrations...
app.get("/viewRegistrations", async(req,res)=>{
  try{
    eventRegistration.find({}).then((data) =>{
      console.log(data);
      res.render("adminViewRegistrations", {event: data});
    })
  }catch(err){
    console.log(err);
  }
})


// 3.Logins and Register

//Login route started

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (email == process.env.ADMINUSER && password == process.env.ADMINPASSWORD) {

    res.redirect("/admindashboard")
  }
  else{
  RegisterModule.findOne({ email: email })
    .then((data) => {
      if (data == null) {
        res.redirect("/registerUser")
      }
      else if (data.password != password) {
        res.write("<div style='margin:auto; align-items:center;margin-top:50px;width:24%;height:15%;padding:10px;'><h1 style='margin-top:4px'>Invalid credentials<br><a href='/loginUser'>Back to Login Page</a></h1></div>")
      }
      else {
        localStorage.setItem("users", JSON.stringify(data))
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

});
//login route completed

//Register route 
app.post("/register", function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const user = new RegisterModule({
    username: username,
    email: email,
    password: password
  })
  RegisterModule.findOne({ email: email }, function (err, data) {
    if (err) {
      console.log(err)
    }
    else if (data) {
      res.redirect("/loginUser")
    }
    else {
      user.save()
      res.redirect("/loginUser")
    }
  })

})
//register route completed  











//server starting
app.listen(3000, () => {
  console.log("Server is running");
});
