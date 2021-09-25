const express = require('express')
const hbs = require('hbs');
const wax = require('wax-on')
const MongoUtil = require('./MongoUtil')

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


// ROUTES
async function main() {
    console.log(process.env.MONGO_URL)
    await MongoUtil.connect(process.env.MONGO_URL, "hospital");


    app.get('/', async function (req, res) {
        let records = await MongoUtil.getDB()
            .collection('appointments')
            .find()
            .limit(10)
            .toArray();

        res.render('listing', {
            'records': records
        })
    })

}

main();

app.listen(3000, function () {
    console.log("Server has started")
});
