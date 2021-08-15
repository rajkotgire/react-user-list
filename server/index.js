const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./config.json')
const bodyParser = require('body-parser')
let app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res, next) => { res.send('Hello From Server !') })

let schema = mongoose.Schema;
let ObjectId = mongoose.Schema.ObjectId
let User = mongoose.model('User', new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "userAge": Number,
    "userEmail": String
}))
app.post('/data', (req, res) => {
    const user = new User(req.body)
    console.log("User Object: " + user)
    user.save().then((user) => {
        res.send(user)
    }).catch((error) => {
        res.send({ error: { message: "Failed to save User", exception: error } })
    })
    console.log(req.body)
})
app.get("/data", (req, res) => {
    User.find({}, (errors, users) => {
        res.send(users)
    })

})

app.delete('/data/:id', (req, res) => {
    User.findByIdAndDelete({ _id: req.params.id }).then((response) => {
        res.status(200).json(response)
    }).catch((error) => {
        res.send({ error: error })
    })
})

app.put('/data/:id', (req, res) => {
    console.log("In an updated")
    User.findOneAndUpdate({ _id: req.params.id },req.body).then((response) => {
        console.log("Found and updated")
        res.status(200).json(response)
    }).catch((error) => {
        console.log("In an error")
        res.send({ error: error })
    })
})

mongoose.connect('mongodb+srv://admin:admin@mylearningcluster.qq0bh.mongodb.net/tarining?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('DataBase connection is successful') }, (error) => { console.log('Db connection error' + error) })


app.listen(config.port, config.host, function (error) {
    error ? console.log('Error: ', error) :
        console.log(`Server is running on ${config.host}:${config.port}`)
})