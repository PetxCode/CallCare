const {
	verifyClient,
	createClient,
	updateClientImage,
	getClient,
	updateClientinfo,
	getClients,
	changePassword,
	signinClient,
	resetPassword,
} = require("../controllers/clientController");

const express = require("express");
const upload = require("../utils/multer");
const router = express.Router();

router.route("/").get(getClients);
router.route("/register").post(createClient);

router.route("/signin").post(signinClient);

router.route("/:id/:token").get(verifyClient);

router.route("/reset").post(resetPassword);
router.route("/change/:id/:token").post(changePassword);

router.route("/:id/image").patch(upload, updateClientImage);

router.route("/:id").get(getClient).patch(updateClientinfo);

module.exports = router;
