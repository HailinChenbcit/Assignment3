const express = require("express");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");

var session = require("express-session");
const UserModel = require("./models/User");
const eventModel = require("./models/TimeEvent");
const cartModel = require("./models/Cart");

app.use(
  bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware
function isAuth(req, res, next) {
  if (req.sessionID && req.session.authenticated) {
    // console.log(req.sessionID);
    next();
  } else {
    res.redirect("/login");
  }
}

mongoose
  .connect("mongodb://localhost:27017/timelineDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("MongoDB connected");
  });

// // print out user information in session
// app.use((req, res, next) => {
//   console.log(`User details are: `);
//   console.log(req.session.user);
//   console.log("Entire session object:");
//   console.log(req.session);
//   next();
// });

/*
 User Login Logout
*/
app.get("/", function (req, res) {
  res.redirect("login");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);

  if (!user || !isMatch) {
    return res.redirect("/login");
  }
  req.session.authenticated = true;
  req.session.user = user;
  res.redirect("/home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  const { firstname, lastname, email, password } = req.body;
  let user = await UserModel.findOne({ email });

  if (user) {
    return res.redirect("/register");
  }

  const hashedPsw = await bcrypt.hash(password, 12);
  user = new UserModel({
    firstname,
    lastname,
    email,
    password: hashedPsw,
  });
  await user.save();

  res.redirect("/login");
});

app.get("/logout", isAuth, function (req, res) {
  res.render("logout");
});

app.post("/logout", isAuth, function (req, res) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/home", isAuth, function (req, res) {
  res.render("home");
});

app.get("/search", isAuth, function (req, res) {
  res.render("search");
});

// Display all items in cart
app.get("/shoppingcart", isAuth, async function (req, res) {
  const allCarts = await cartModel
    .find({
      owner: req.session.user._id,
    })
    .exec();
  const cartItems = allCarts.map((item) => {
    const carItem = {
      _id: item._id,
      id: item.pokeID,
      price: item.price,
      quantity: item.quantity,
    };
    return carItem;
  });
  res.render("shoppingcart", { cartItems });
});

// Delete cart item
app.delete("/shoppingcart/remove/:id", isAuth, (req, res) => {
  cartModel.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Deleted Data " + data);
      }
    }
  );
});

/* 
Timeline Event
*/
// Display all event cards from one user
app.get("/timeline", isAuth, async function (req, res) {
  const allActs = await eventModel
    .find({
      owner: req.session.user._id,
    })
    .exec();
  const allEvents = allActs.map((event) => {
    const userEvent = {
      _id: event._id,
      text: event.text,
      time: event.time,
    };
    return userEvent;
  });

  const userInfo = await UserModel.find({
    _id: req.session.user._id,
  }).exec();
  const details = {
    firstname: userInfo[0].firstname,
    email: userInfo[0].email,
  };

  res.render("timeline", { allEvents, details });
});

//Create
app.put("/timeline/insert", isAuth, function (req, res) {
  eventModel.create(
    {
      text: req.body.text,
      time: req.body.time,
      owner: req.session.user._id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send(data);
    }
  );
});

//Delete
app.get("/timeline/remove/:id", isAuth, function (req, res) {
  eventModel.deleteOne({_id: req.params.id,
  },
    function(err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
    },
  );
});

const https = require("https");

app.get("/profile/:id", isAuth, async function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  data = "";
  await https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });
    https_res.on("end", function () {
      data = JSON.parse(data);
      obj_hp = data.stats
        .filter((obj) => {
          return obj.stat.name == "hp";
        })
        .map((obj) => {
          return obj.base_stat;
        });

      obj_atk = data.stats
        .filter((obj) => {
          return obj.stat.name == "attack";
        })
        .map((obj) => {
          return obj.base_stat;
        });

      obj_defense = data.stats
        .filter((obj) => {
          return obj.stat.name == "defense";
        })
        .map((obj) => {
          return obj.base_stat;
        });

      obj_abilities = [];
      for (i = 0; i < data.abilities.length; i++) {
        obj_abilities.push(data.abilities[i].ability.name);
      }

      obj_types = [];
      for (i = 0; i < data.types.length; i++) {
        obj_types.push(data.types[i].type.name);
      }

      res.render("profile.ejs", {
        id: req.params.id,
        name: data.name,
        hp: obj_hp[0],
        weight: data.weight,
        height: data.height,
        attack: obj_atk[0],
        defense: obj_defense[0],
        abilities: obj_abilities,
        types: obj_types,
      });
    });
  });
});

/*
shopping cart
*/
app.post("/profile/:id", isAuth, function (req, res) {
  // price and pokeID retrieve
  var { quantity, price, pokeID } = req.body;
  quantity = Number(quantity);
  const newCart = cartModel({
    owner: req.session.user._id,
    pokeID: pokeID,
    price: price,
    quantity: quantity,
  });

  newCart.save();
  res.redirect("/success");
});

// success page
app.get("/success", isAuth, function (req, res) {
  res.render("success");
});

app.use(express.static("./public"));

app.listen(process.env.PORT || 8000, function (err) {
  if (err) console.log(err);
});
