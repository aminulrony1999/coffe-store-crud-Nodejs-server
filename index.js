const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json()); //this middleware is required to access req.body


//user name and password is hidded 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erlhtjw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    const coffeCollection = client.db("coffeDB").collection("coffe");
    const userCollection = client.db("userDB").collection("user");
    app.get('/coffe', async(req, res) =>{
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/coffe/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await coffeCollection.findOne(query);
      res.send(result);
    })
    app.post('/coffe', async(req, res)=>{
      const newCoffe = req.body;
      const result = await coffeCollection.insertOne(newCoffe);
      res.send(result);
    })
    app.put('/coffe/:id', async (req,res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true};
      const updatedCoffe = req.body;
      const Coffe = {
        $set : {
          name : updatedCoffe.name,
          quantity : updatedCoffe.quantity,
          supplier : updatedCoffe.supplier,
          taste : updatedCoffe.taste,
          category : updatedCoffe.category,
          details : updatedCoffe.details,
          photo : updatedCoffe.photo
        }
      }
      const result = await coffeCollection.updateOne(filter, Coffe, options);
      res.send(result);
    })
    app.delete('/coffe/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    })
    app.post('/user', async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Coffer Store server is running');
})

app.listen(port, ()=>{
    console.log(`Coffe Store Server is running on port : ${port}`)
})