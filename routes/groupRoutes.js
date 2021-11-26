const express = require("express");

const groupController = require("../controllers/groupController")
const authController = require("../controllers/authController")
const router = express.Router();

////////////////////////////  if the param "id" is there this middleware gets activated
router.param("id", groupController.checkId)

//////////////////////////////////////////////////

router.route("/").get(authController.protect, groupController.getAllGroups).post(groupController.createGroup);
router.route("/:id").get(groupController.getGroup).delete(authController.protect,authController.restrictTo("admin"),  groupController.deleteGroup).patch(groupController.updateGroup);


module.exports = router;
