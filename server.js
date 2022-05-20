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
  if (req.session.isAuth) {
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
  req.session.isAuth = true;
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

app.post("/logout", function (req, res) {
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

app.get("/timeline", isAuth, function (req, res) {
  res.render("timeline");
});

app.get("/shoppingcart", isAuth, function (req, res) {
  res.render("shoppingcart");
});

/* 
Timeline Event
*/
// Read
app.get("/timeline/getAllEvents", function (req, res) {
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
});

//Create
app.put("/timeline/insert", function (req, res) {
  console.log(req.body);
  eventModel.create(
    {
      text: req.body.text,
      time: req.body.time,
      hits: req.body.hits,
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

//Upadte
app.get("/timeline/inreaseHits/:id", function (req, res) {
  console.log(req.params);
  eventModel.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { hits: 1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Update is good!");
    }
  );
});

//Delete
app.get("/timeline/remove/:id", function (req, res) {
  // console.log(req.params)
  eventModel.remove(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Delete is good!");
    }
  );
});

const https = require("https");
const User = require("./models/User");

app.get("/profile/:id", async function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  data = "";
  await https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });
    https_res.on("end", function () {
      // console.log(JSON.parse(data))
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

      console.log(obj_types);

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
app.post("/profile/:id", isAuth, async function (req, res) {
  const { quantity } = req.body;
  const { price } = req.body;
  // UserModel.findByIdAndUpdate(id, {}, { new: true });
  const userCart = await cartModel.find({
    _id: req.user._id,
  }).exec();

  userCart.push({
    pokeID: id,
    price: price,
    quantity: quantity,
  });

  userCart.save();
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
