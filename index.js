const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const app = express()
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config()
const port= 5000

app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI;

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

    const db = client.db("studyNook");
    const roomCollection = db.collection("rooms");
    
    app.post('/studyrooms',async (req,res)=>{
        const cursor=req.body
        const result= await roomCollection.insertOne(cursor)
        res.send(result)
    })
//     app.get('/studyrooms',async(req,res)=>{
//  const result=await roomCollection.find().toArray()
//         res.send(result)
//     })
app.get('/studyrooms', async (req, res) => {

    const result = await roomCollection
        .find()
        .limit(+req.query.limit || 0)
        .toArray();

    res.send(result);
});

    app.get('/studyrooms/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await roomCollection.findOne(query)
        res.send(result)
    })
    app.delete('/studyrooms/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await roomCollection.deleteOne(query)
        res.send(result)
    })
  app.patch('/studyrooms/:id',async(req,res)=>{
    const {id}=req.params
    console.log(id,'id');
    const updateData=req.body;
    
  const result=await roomCollection.updateOne(
    {_id:new ObjectId(id)},
  {$set:updateData}
)
res.send(result)
  })
    
  
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


