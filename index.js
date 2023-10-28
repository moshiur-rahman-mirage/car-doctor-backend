const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hhabjy4.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const serviceCollection = client.db('CarDoctor').collection('Services');
    const bookingCollection = client.db('CarDoctor').collection('Bookings')

    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: {
          _id: 1,
          title: 1,
          price: 1,
          img: 1
        }
      }
      const result = await serviceCollection.findOne(query, options)
      res.send(result);
    })



    app.post('/bookings',async(req,res)=>{
      const booking=req.body;
      console.log(booking);
      const result=await bookingCollection.insertOne(booking);
      res.send(result)
    })


    app.delete('/bookings/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
      res.send(result)

    })


    app.get('/bookings', async (req, res) => {
      let query={}
      if (req.query?.email){
        query={email:req.query.email}
      }
      const cursor = await bookingCollection.find(query).toArray();
      res.send(cursor)
    })


    app.patch('/bookings/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const updateBooking=req.body;
      console.log(updateBooking)
      const updateDoc={
        $set:{
          status:updateBooking.status
        },
      };
      const result = await bookingCollection.updateOne(filter,updateDoc);
      res.send(result);
      console.log(result)
    })





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('doctor is running')
})
app.listen(port, () => {
  console.log(`car doctor server is running on port ${port}`)
})