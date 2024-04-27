const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.omgilvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    // Created database connection
    const artsCollection = client.db("eleganceArtistary").collection("arts");
    // find all data from database
    app.get("/arts", async (req, res) => {
      const cursor = artsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find single data from on database
    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await artsCollection.findOne(qurey);
      res.send(result);
    });
    // post single iteam on database
    app.post("/art", async (req, res) => {
      const data = req.body;
      const result = await artsCollection.insertOne(data);
      res.send(result);
    });
    // update a single iteam on database
    app.patch("/art/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          plot: `A harvest of random numbers, such as: ${Math.random()}`,
        },
      };
      const result = await artsCollection.updateOne(filter, updateDoc, options);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log("server running"));
