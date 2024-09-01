const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json())



// Mongodb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sozmemk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();


        const menuCollection = client.db("BistroBossDB").collection("menu")
        const reviewsCollection = client.db("BistroBossDB").collection("reviews")
        const cartsCollection = client.db("BistroBossDB").collection("carts")
        const userCollection = client.db("BistroBossDB").collection("users")

        // User Collection
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });


        // Menu Collection
        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        });
        // Reviews Collection
        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        });

        //  Carts Collection
        app.post("/carts", async (req, res) => {
            const user = req.body;
            const result = await cartsCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });

        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await cartsCollection.find(query).toArray();
            res.send(result);
        });

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        });
        //  Caets Cpllection End


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);
// Mongodb Connection End




app.get('/', (req, res) => {
    res.send('Boss is Sitting')
})

app.listen(port, () => {
    console.log(`Bistro Boss is Sitting On Port, ${port}`)
})

