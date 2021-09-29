const { ObjectId } = require('bson');
const express = require('express')
const hbs = require('hbs');
const wax = require('wax-on')
const MongoUtil = require('./MongoUtil')
const session = require("express-session")
const cookieParser = require('cookie-parser');
const flash = require("connect-flash")
const MONGO_URL = "mongodb+srv://root:valter123@cluster0.zihtc.mongodb.net/?retryWrites=true&w=majority"

require('dotenv').config();
let app = express();
// use handlebars for the view engines
app.set('view engine', 'hbs');
// set the public folder to store all the static files
app.use(express.static('public'));

// enable template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// enable forms
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());


// setup global middleware
app.use(function (req, res, next) {
    res.locals.success_message = req.flash("success_message")
    res.locals.error_message = req.flash("error_message")
    next()
})

// ROUTES
async function main() {
    await MongoUtil.connect(MONGO_URL, "hospital");


    app.get('/', async function (req, res) {
        let db = MongoUtil.getDB()
        let listing = await db
            .collection('appointments')
            .find()
            .sort({ 'appointment_datetime': 1 })
            .toArray();

        res.render('listing', {
            'listing': listing
        })
    })

    // DOCTORS CRUD

    app.get('/doctors', async function (req, res) {
        let db = MongoUtil.getDB();
        let doctors = await db
            .collection('appointments')
            .find()
            .sort({ 'appointment_datetime': 1 })
            .toArray();

        res.render('doctors', {
            'doctors': doctors
        })
    })

    // APPTS CRUD

    // // READ ONE
    app.get('/appointment/:id', async function (req, res) {
        let db = MongoUtil.getDB();
        let appointment = await db
            .collection("appointments")
            .findOne({
                '_id': ObjectId(req.params.id)
            })
        res.render('appointment', {
            'appointment': appointment
        })
    })

    // DELETE 
    app.get('/appointment/delete/:id', async function (req, res) {
        let db = MongoUtil.getDB();
        let appointment = await db
            .collection("appointments")
            .findOne({
                '_id': ObjectId(req.params.id)
            })
        res.render('cancel', {
            appointment
        });
    })

    app.post('/appointment/delete/:id', async function (req, res) {
        let db = MongoUtil.getDB();
        await db.collection("appointments")
            .deleteOne({
                '_id': ObjectId(req.params.id)
            })
        req.flash("success_message", "Appointment has been cancelled.")
        res.redirect('/');
    })

    // APP Create
    app.get('/appointments/add_appointment', function (req, res) {
        res.render('add_appointment')
    })

    app.post('/appointments/add', async function (req, res) {
        let { doctor_id, doctor_name, patient_id, patient_name, patient_age, patient_gender, appointment_id, appointment_datetime } = req.body;
        let db = MongoUtil.getDB();
        await db.collection("appointments").insertOne({
            doctor_id, doctor_name, patient_id, patient_name, patient_age, patient_gender, appointment_id, appointment_datetime
        })
        res.redirect('/')

    })


}

main();

app.listen(3000, function () {
    console.log("Server has started")
});
