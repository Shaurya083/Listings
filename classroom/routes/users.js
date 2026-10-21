const express = require("express");
const router = express.Router();


//av app ko routre se replace kar denge
//Index route
router.get("/",(req,res)=>{
  res.send("GET for users");
})
//Show route
router.get("/:id",(req,res)=>{
  res.send("GET for show users");
})
//Post request
router.post("",(req,res)=>{
  res.send("Post for users");
})
//Delete route
router.delete("/:id",(req,res)=>{
  res.send("Delete for users");
})
module.exports = router;