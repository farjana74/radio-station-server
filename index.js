const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2z78o.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db("station");
        const servicesCollection = database.collection("services");


        // post api----------------

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })

        // get api---------
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services)

        })


        // delete api---------------
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })

        // update api-----
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('updating user', req);
            // res.send('update not user')
            const updateService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateService.name,
                    rj_name: updateService.rj_name,
                    img: updateService.img,
                    time: updateService.time,
                    duration: updateService.duration,
                    views: updateService.views
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            // console.log()
            res.json(result)
        })



        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.send(services);
        })





    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hello world')
})
app.get('/users', (req, res) => {
    res.send('here is my users')
})

app.listen(port, () => {
    console.log('listening to port', port)
});