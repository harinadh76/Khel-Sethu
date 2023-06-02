const express = require("express");
require('dotenv').config({ path: __dirname + '/.env' })
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const eventModule = require("./models/events");
const RegisterModule = require("./models/RegisterModel");
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')
const { json } = require('body-parser')
const eventRegistration = require('./models/Registration')
const cookieParser = require('cookie-parser')
MONGODB = "mongodb+srv://hari:stormshadow@cluster0.lipafez.mongodb.net/?retryWrites=true&w=majority";
ADMINUSER = "admin@gmail.com";
ADMINPASSWORD = "admin";


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://hari:stormshadow@cluster0.lipafez.mongodb.net/?retryWrites=true&w=majority");

app.use(express.json());



// 1. Rendering Files
app.get("/details", (req, res) => {
    var k = req.cookies.Userstatus;
    res.render('details', { main: k })
});





app.get("/", (req, res) => {
    var k = req.cookies.Userstatus;
    console.log(k);
    eventModule.find({}).then((data) => {
        res.render("index", { event: data, main: k });
    })
});
app.get("/loginUser", (req, res) => {
    var k = req.cookies.Userstatus;
    res.render('login', { main: k })
});
app.get("/registerUser", (req, res) => {
    var k = req.cookies.Userstatus;
    res.render('signup', { main: k })
});
app.get("/contactUs", (req, res) => {
    var k = req.cookies.Userstatus;
    res.render('contact', { main: k })
})
app.get("/about", (req, res) => {
    var k = req.cookies.Userstatus;
    res.render('about', { main: k })
})
app.get("/checkevents", (req, res) => {
    var k = req.cookies.Userstatus;
    eventModule.find({}).then((data) => {
        res.render("events", { event: data, main: k });
    })

})
app.get("/logout", (req, res) => {
    var k = req.cookies.Userstatus;
    localStorage.removeItem(k);
    res.clearCookie("User status");
    res.redirect('/')
})




//admindashboard
app.get("/admindashboard", (req, res) => {
        res.sendFile(__dirname + "/adminDashboard.html");
    })
    //admin module files
app.get("/addEvent", async(req, res) => {
        res.sendFile(__dirname + "/newevent.html");
    })
    // admin updating part
app.post("/updateEvent/:id", async(req, res) => {

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
    var k = req.cookies.Userstatus;
    eventModule.find({}).then((data) => {
        res.render("adminViewEvents", { event: data, main: k });
    })
})

//2. CRUD OPERATIONS

//create
app.post("/create", async(req, res) => {
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

app.get("/showAllEvents", async(req, res) => {
    var k = req.cookies.Userstatus;
    try {
        const events = await eventModule.find();
        // res.json({ events });


        eventModule.find({}).then((data) => {
            res.render("showevent", { event: data, main: k });
        })
    } catch (err) {
        res.json({ message: err });
    }
});


app.get("/fetchdetails/:id", function(req, res) {
    var k = req.cookies.Userstatus;
    try {
        eventModule.findById(req.params.id).then((data) => {
            res.render("details", { event: data, main: k })
        })
    } catch (err) {
        res.json({ message: err });
    }


});

//read
app.get("/events/:eventId", async(req, res) => {
    var k = req.cookies.Userstatus;
    try {
        const event = await eventModule.findById(req.params.eventId);
        // res.json({ event });
        res.render("details", { main: k })
    } catch (err) {
        res.json({ message: err });
    }
});

//update
app.post("/events/:eventId", async(req, res) => {
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
            req.params.eventId, {
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
app.post("/deleteEvents/:eventId", async(req, res) => {
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

app.post("/testing", async(req, res) => {
    const register = new eventRegistration({
        name: req.body.name,
        email: req.body.email,
        phnumber: req.body.mobile,
        year: req.body.yos,
        event: req.body.events,
        amount: req.body.amount,
        transactionid: req.body.transactionid
    })

    try {
        await register.save();


    } catch (err) {
        console.log(err);
    }
})

// admin view for viewing student Registrations...
app.get("/viewRegistrations", async(req, res) => {
    var k = req.cookies.Userstatus;
    try {
        eventRegistration.find({}).then((data) => {
            console.log(data);
            res.render("adminViewRegistrations", { event: data, main: k });
        })
    } catch (err) {
        console.log(err);
    }
})


// 3.Logins and Register

//Login route started

app.post("/login", function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (email == ADMINUSER && password == ADMINPASSWORD) {

        res.redirect("/admindashboard")
    } else {
        RegisterModule.findOne({ email: email })
            .then((data) => {
                if (data == null) {
                    res.redirect("/registerUser")
                } else if (data.password != password) {
                    res.write("<div style='margin:auto; align-items:center;margin-top:50px;width:24%;height:15%;padding:10px;'><h1 style='margin-top:4px'>Invalid credentials<br><a href='/loginUser'>Back to Login Page</a></h1></div>")
                } else {
                    var a = email;
                    a = a + " Logged in";
                    res.cookie("Userstatus", email);
                    localStorage.setItem(email, JSON.stringify(data));
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
app.post("/register", function(req, res) {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const user = new RegisterModule({
            username: username,
            email: email,
            password: password
        })
        RegisterModule.findOne({ email: email }, function(err, data) {
            if (err) {
                console.log(err)
            } else if (data) {
                res.redirect("/loginUser")
            } else {
                user.save()
                res.redirect("/loginUser")
            }
        })

    })
    //register route completed  











//server starting
app.listen(3000, () => {
    console.log("Server is running at 3000");
});