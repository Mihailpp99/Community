const express = require("express");

const groupController = require("../controllers/groupController")
const authController = require("../controllers/authController")
const router = express.Router();

router.route("/").get((req,res,err)=>{
    
})