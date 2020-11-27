const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = 8080;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clbh1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

    
client.connect(err => {
    const appointmentsCollection = client.db(`${process.env.DB_NAME}`).collection("category");
    const patientsCollection = client.db(`${process.env.DB_NAME}`).collection("patients");

    // ADD ALL APPOINTMENTS AT THE DATABASE
    app.post('/addAppointments', (req, res) => {
        appointmentsCollection.insertMany(req.body)
        .then(result => {
            res.send(result);
        })
    })

    // READ ALL APPOINTMENTS
    app.get('/loadAppointments', (req, res) => {
        appointmentsCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    //LOAD All PATIENTS
    app.get('/allPatients', (req, res) => {
        patientsCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    //INSERT PATIENT INFORMAITON AT THE DATABASE
    app.post('/patient', (req, res) => {
        patientsCollection.insertOne(req.body)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    //READ PATIENT INFORMAITON FROM THE DATABASE
    app.post('/appointmentByDate', (req, res) => {
        const date = req.body;
        patientsCollection.find({date: date.date})
        .toArray((error, documents) => {
            res.send(documents)
        })
    })

});

app.get('/', (req, res) => {
  res.send('Hello Doctor Chamber!');
})

app.listen(process.env.PORT || port);