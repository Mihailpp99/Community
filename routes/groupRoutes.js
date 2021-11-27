const express = require("express");

const groupController = require("../controllers/groupController")
const authController = require("../controllers/authController")
const router = express.Router();

////////////////////////////  if the param "id" is there this middleware gets activated
router.param("id", groupController.checkId)

//////////////////////////////////////////////////

router.route("/").get(authController.protect, groupController.getAllGroups).post(authController.protect, groupController.createGroup);
router.route("/:id").get(authController.protect, groupController.getGroup).delete(authController.protect, authController.restrictTo("user"),  groupController.deleteGroup).patch(groupController.updateGroup);

router.route("/:id/user").patch(authController.protect, groupController.addUser)

module.exports = router;
