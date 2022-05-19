const express = require('express')
const app = express()
app.set('view engine', 'ejs')
const bodyparser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://hchen256:comp1537@cluster0.74n5t.mongodb.net/timelineDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect("mongodb://localhost:27017/timelineDB",
//     { useNewUrlParser: true, useUnifiedTopology: true });

const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const eventModel = mongoose.model("timelineevents", eventSchema);


app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


// Read
app.get('/timeline/getAllEvents', function (req, res) {
    eventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

//Create
app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    eventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

//Upadte
app.get('/timeline/inreaseHits/:id', function (req, res) {
    console.log(req.params)
    eventModel.updateOne({
        _id: req.params.id
    }, {
        $inc: { hits: 1 }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Update is good!");
    });
})

//Delete
app.get('/timeline/remove/:id', function (req, res) {
    // console.log(req.params)
    eventModel.remove({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Delete is good!");
    });
})


app.listen(process.env.PORT || 8000, function (err) {
    if (err) console.log(err);
})

const https = require('https')


app.get('/profile/:id', function (req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = ''
    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })
        https_res.on("end", function () {
            // console.log(JSON.parse(data))
            data = JSON.parse(data)
            obj_hp = data.stats.filter((obj)=>{
                return obj.stat.name == 'hp'
            }).map((obj)=>{
                return obj.base_stat
            })
            
            obj_atk = data.stats.filter((obj)=>{
                return obj.stat.name == 'attack'
            }).map((obj)=>{
                return obj.base_stat
            })

            obj_defense = data.stats.filter((obj)=>{
                return obj.stat.name == 'defense'
            }).map((obj)=>{
                return obj.base_stat
            })

            obj_abilities = []
            for (i =0; i<data.abilities.length;i++) {
                obj_abilities.push(data.abilities[i].ability.name)
            }

            obj_types = []
            for (i =0; i<data.types.length;i++) {
                obj_types.push(data.types[i].type.name)
            }

            console.log(obj_types)

            res.render('profile.ejs', {
                "id": req.params.id,
                'name': data.name,
                "hp": obj_hp[0],
                "weight": data.weight,
                "height": data.height,
                "attack": obj_atk[0],
                "defense": obj_defense[0],
                "abilities": obj_abilities,
                "types": obj_types,
            })
        })
    })
})


app.use(express.static('./public'));
