const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const req = require('express/lib/request');
const res = require('express/lib/response');
const objectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.aqab4.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const booksCollection = client.db(process.env.DB_Name).collection("books");
  const orderCollection = client.db(process.env.DB_Name).collection("orders");
  
  app.post('/addBooks', (req, res)=>{
      const book = req.body;
      booksCollection.insertOne(book)
      .then(result =>{
          res.send(result.acknowledged)
      })
  })

  app.get('/books', (req, res)=>{
    booksCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/books/:bookId', (req, res)=>{
    booksCollection.find({_id: objectId(req.params.bookId)})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    booksCollection.deleteOne({_id: objectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
  })

  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result =>{
      res.send(result.acknowledged)
    })
  })
  app.get('/orders/:email', (req, res)=>{
    orderCollection.find({email: req.params.email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
});


app.listen(port);