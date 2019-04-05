const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const path = require('path')

app.use(express.static(path.join(__dirname, 'React/src')))

app.use(bodyParser.urlencoded({extended: true}))

var db

MongoClient.connect('mongodb://localhost:27017/sampleDB', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db('sampleDB') // whatever your database name is
  app.listen(4000, () => {
    console.log('listening on 4000')
  })
})

app.get('/express_backend', (req, res) => {
  db.collection('hello').find().toArray(function(err, results) {
    res.send(results[0])
  })
})
