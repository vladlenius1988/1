const express = require("express");
const recordRoutes = express.Router(); 
const dbo = require("../db/conn");
 

const ObjectId = require("mongodb").ObjectId;
 
 

recordRoutes.route("/record").get(async function (req, response) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("geekshop")
    .find({})
    .toArray()
    .then((data) => {
    
      response.json(data);
    });

});
 

recordRoutes.route("/record/:id").get(async (req, res) => {
  console.log('GET request for ID:', req.params.id);
  const db_connect = dbo.getDb();
  const myquery = { _id: new ObjectId(req.params.id) };

  try {
    const result = await db_connect.collection("geekshop").findOne(myquery);
    
    if (!result) {
      return res.status(404).send('Record not found');
    }
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

 

recordRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   name: req.body.name,
   description: req.body.description,
   universe: req.body.universe,
   group: req.body.group,
   price: req.body.price,
   photo: req.body.photo,
   tag: req.body.tag,
 };
 db_connect.collection("geekshop").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 

recordRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    name: req.body.name,
    description: req.body.description,
    universe: req.body.universe,
    group: req.body.group,
    price: req.body.price,
    photo: req.body.photo,
    tag: req.body.tag,
   },
 };

 try {
  const result = db_connect.collection("geekshop").updateOne(myquery, newvalues);
  console.log("1 product updated");
  response.json(result);
} catch (err) {
  console.error(err);
  response.status(500).send("Error updating record");
}
});
 


recordRoutes.route("/:id").delete(async (req, response) => {
  let db_connect = dbo.getDb();
  if (!db_connect) {
    console.log("Database connection failed");
    return response.status(500).json({ error: "Database connection failed" });
  }


  let myquery;
  try {
    myquery = { _id: new ObjectId(req.params.id) };

  } catch (err) {
    console.log("Error creating ObjectId", err);
    return response.status(400).json({ error: "Invalid ObjectId" });
  }

  try {
    const result = db_connect.collection("geekshop").deleteOne(myquery);
    console.log("1 document deleted");
    response.json(result);
  } catch (err) {
    console.log("Error during deletion", err);
    response.status(500).json({ error: err.message });
  }
});
 
module.exports = recordRoutes;