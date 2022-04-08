//requires
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

//app setup
const app = express();
const port = 5000;

//view engine setup
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//Setup DB Connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/skyhighstore", {
  UseNewUrlParser: true,
  UseUnifiedTopology: true,
});

//Setup DB Model
const Order = mongoose.model("order", {
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  province: String,
  postCode: String,
  provinceTax: Number,
  photoshopQuantity: Number,
  lightroomQuantity: Number,
  wallpapersQuantity: Number,
  photoshopRate: Number,
  lightroomRate: Number,
  wallpapersRate: Number,
  deliveryTime: Number,
  subTotal: Number,
  tax: Number,
  total: Number,
});

//----------------------- Validations -----------------------

//Regex constants

//phone number - 1231231234 or 123-123-1234
let phoneRegex = /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$/;

const checkRegex = (input, regex) => {
  if (regex.test(input)) {
    return true;
  } else {
    return false;
  }
};

const regexPhoneValidation = (value) => {
  if (!checkRegex(value, phoneRegex)) {
    throw new Error(
      "Please enter the phone number in valid format! e.g 1231231234"
    );
  }
  return true;
};

//----------------------- Routing -----------------------

//constants
const photoshopRate = 50;
const lightroomRate = 30;
const wallpapersRate = 5;

const provinceTaxes = new Map();
provinceTaxes.set("AB", 0.1);
provinceTaxes.set("BC", 0.11);
provinceTaxes.set("MB", 0.12);
provinceTaxes.set("NB", 0.13);
provinceTaxes.set("NL", 0.14);
provinceTaxes.set("NT", 0.15);
provinceTaxes.set("NS", 0.16);
provinceTaxes.set("NU", 0.17);
provinceTaxes.set("ON", 0.18);
provinceTaxes.set("PE", 0.19);
provinceTaxes.set("QC", 0.2);
provinceTaxes.set("SK", 0.21);
provinceTaxes.set("YT", 0.22);

app.get("/", (req, res) => {
  res.render("home");
});

app.post(
  "/",
  [
    check("name", "Name is Mandatory!").notEmpty(),
    check("address", "Address is Mandatory!").notEmpty(),
    check("city", "City is Mandatory!").notEmpty(),
    check("province", "Province is Mandatory!").notEmpty(),
    check("postCode","Postal Code is Mandatory!").notEmpty(), 
    check("email", "Please enter a valid email address!").isEmail(),
    check("phone", "Please enter phone number in valid format!").custom(
      regexPhoneValidation
    ),
  ],
  (req, res) => {
    var errors = validationResult(req);
    uiErrors = errors.array();
    if (!errors.isEmpty()) {
      res.render("home", uiErrors);
    } else {
      let name = req.body.name;
      let email = req.body.email;
      let phone = req.body.phone;
      let address = req.body.address;
      let city = req.body.city;
      let postCode = req.body.postCode;
      let province = req.body.province;
      let photoshopQuantity = req.body.photoshop;
      let lightroomQuantity = req.body.lightroom;
      let wallpapersQuantity = req.body.wallpapers;
      let deliveryTime = req.body.deliveryTime;
      let subTotal =
        photoshopQuantity * photoshopRate +
        lightroomQuantity * lightroomRate +
        wallpapersQuantity * wallpapersRate;
      let provinceTax = provinceTaxes.get(province);
      let tax = subTotal * provinceTax;
      let total = subTotal + tax;

      let pageData;

      if (total <= 10) {
        pageData = {
          error: "Minimum purchase should be more than 10$",
        };
        res.render("home", pageData);
      } else {
        pageData = {
          name: name,
          email: email,
          phone: phone,
          address: address,
          city: city,
          province: province,
          postCode: postCode,
          provinceTax: provinceTax * 100,
          photoshopQuantity: photoshopQuantity,
          lightroomQuantity: lightroomQuantity,
          wallpapersQuantity: wallpapersQuantity,
          photoshopRate: photoshopRate,
          lightroomRate: lightroomRate,
          wallpapersRate: wallpapersRate,
          deliveryTime: deliveryTime,
          subTotal: subTotal,
          tax: tax,
          total: total,
        };
      }

      //Create object for model-order
      var myOrder = new Order(pageData);

      //Save new order in DB
      myOrder.save().then(function () {
        console.log("New Order Created");
      });

      res.render("home", pageData);
    }
  }
);

//to get all orders from MongoDB
app.get("/allorders", (req, res) => {
  //Read document from MongoDB
  Order.find({}).exec(function (err, orders) {
    console.log(err);
    res.render("allorders", { orders: orders });
  });
});

//display the port on which app is running in terminal
app.listen(port, () => console.info(`App listening on port ${port}`));
