const express = require ('express');
const bodyParser = require('body-parser');
const exphbs = require ('express-handlebars');
const Handlebars = require('handlebars')
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport')

const { connect } = require ('mongoose');
const { PORT,MONGODB_URL} = require('./config');

const app = express();
//import passport local-passport
require('./config/passport')(passport)



/*=============================connect momgodb data =========================== */
connect(
    MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
      if (err) throw err;
      console.log("Myntra database connection successfully connected");
    }
  );

/*===================Template engine middileware starts here==============================*/
app.engine("handlebars",exphbs());
app.set("view engine","handlebars")

/*===================Template engine middileware ends here==============================*/

//handlebar HelperClasses
Handlebars.registerHelper("removeFirst6Char", (str) => {
  let TrimValue = [...str].splice(6).join("");
  return new Handlebars.SafeString(TrimValue);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* =====================METHOD OVERRIDE MIDDLEWARE======================*/

/*============================Method overirde middleWare===============*/
app.use(methodOverride("_method")) ;


/*=============================session and connect flash middelewares are started here==================================*/
app.use(
  session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  })
)

app.use(flash());

/*==========================passport midillewere=================*/
app.use(passport.initialize());
app.use(passport.session());

/*=============================session and connect flash middelewares are ends here==================================*/

/*===============================Set GLOBAL VARIABLE,THIS VARIABLE CAN ACCESS ENTIRE APPLICATION============================ */
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.errors_msg = req.flash("errors_msg");
  res.locals.warnings_msg = req.flash("warnings_msg ");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});



/*==============================serve static assets==================================== */
app.use(express.static(__dirname +"/public"));
app.use(express.static(__dirname + "/node_modules"));

app.get('/',(req,res)=>{
  res.render('./home')
})


/*================================load Routes module ========================== */
app.use('/profile/', require('./Routes/profiles/profile'));
app.use("/auth/", require("./Routes/auth/auth"));
app.use("/sports", require("./Routes//products/sports"));

app.listen(PORT,(err)=>{
    if (err) throw err;
    console.log("Myntra server is running on port number" + PORT)
});

