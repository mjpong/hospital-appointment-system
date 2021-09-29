# Hospital Appointment Tracker
Basic CRD for an appointment tracker based on a dummy csv file
```
Patient will have attributes such as name, age, etc.
A patient can consult multiple doctors and vice-versa.
A patient can have multiple appointments with doctors.
Doctors also will have access to their appointments with patients.
An appointment will have the details such as date & time, consulting doctor, patient, etc.
While fixing the appointment
Doctor's consultation duration is 1hr
Doctor's consultation time will be between 8am - 4pm
```
![ERD](public/erd.png)
# Steps to do to replicate
* yarn or npm install all dependencies
* node index.js to run
* to add csv file to mongodb and delete code after

## To add csv file to json to mongodb
```
const mongodb = require('mongodb').MongoClient;
const csvtojson = require("csvtojson")

csvtojson()
    .fromFile("appt.csv")
    .then(csvData => {
        console.log(csvData);

        mongodb.connect(
            process.env.MONGO_URL,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) throw err;

                client
                    .db("hospital")
                    .collection("appointments")
                    .insertMany(csvData, (err, res) => {
                        if (err) throw err;

                        console.log(`Inserted: ${res.insertedCount} rows`);
                        client.close();
                    });
            }
        );
    });
```
