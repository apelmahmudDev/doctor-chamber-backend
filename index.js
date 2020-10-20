const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = process.env.DB_PORT;
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

    // READ APPOINTMENT BY DAYNAMIC KEY
    app.get('/appointment/:patinetkey', (req, res) => {
        appointmentsCollection.find({key: req.params.patinetkey})
        .toArray((error, documents) => {
            res.send(documents[0]);
        })
    })

    //INSERT PATIENT INFORMAITON AT THE DATABASE
    app.post('/patient', (req, res) => {
        patientsCollection.insertOne(req.body)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })
});


app.get('/', (req, res) => {
  res.send('Hello Doctor Chamber!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})