const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server running");
});
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
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
    // Created database connection
    const artsCollection = client.db("eleganceArtistary").collection("arts");
    const reviewCollection = client
      .db("eleganceArtistary")
      .collection("review");
    const artsCatagory = client
      .db("eleganceArtistary")
      .collection("artsCatagory");
    // find all data from from artCollection
    app.get("/arts", async (req, res) => {
      const cursor = artsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find specific users data from artCollection
    app.get("/myart/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cursor = artsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // find specific catagory data from artCollection
    app.get("/catagory/:sub", async (req, res) => {
      const query = { subcategory_Name: req.params.sub };
      const cursor = artsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // find all data and send first six data for homepage from artCollection
    app.get("/arts/six", async (req, res) => {
      const cursor = artsCollection.find();
      const result = await cursor.toArray();
      res.send(result.slice(0, 6));
    });

    // find all review
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find subcatagory data from artSubcatagory
    app.get("/subcategory", async (req, res) => {
      const cursor = artsCatagory.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find single data from artCollection
    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await artsCollection.findOne(qurey);
      res.send(result);
    });
    // insert single review on review collection
    app.post("/review", async (req, res) => {
      const data = req.body;
      const result = await reviewCollection.insertOne(data);
      res.send(result);
    });

    //insert single iteam on database
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
          art_name: data.art_name,
          description: data.description,
          photo: data.photo,
          email: data.email,
          username: data.username,
          subcategory_Name: data.subcategory_Name,
          price: data.price,
          process_time: data.process_time,
          customization: data.customization,
          rating: data.rating,
          stock: data.stock,
        },
      };
      const result = await artsCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // delete a single data from database
    app.delete("/art/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await artsCollection.deleteOne(qurey);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log("server running"));
