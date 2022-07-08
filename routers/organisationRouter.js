const {
	verifyOrganisation,
	createOrganisations,
	updateOrganisationImage,
	getOrganisation,
	updateOrganisationinfo,
	getOrganisations,
	changePassword,
	signinOrganisation,
	resetPassword,
	getOrganisationMember,
} = require("../controllers/organisationController");

const express = require("express");
const logo = require("../utils/logo");
const router = express.Router();

router.route("/").get(getOrganisations);
router.route("/:id/my-members").get(getOrganisationMember);
router.route("/register").post(createOrganisations);

router.route("/signin").post(signinOrganisation);

router.route("/:id/:token").get(verifyOrganisation);

router.route("/reset").post(resetPassword);
router.route("/change/:id/:token").post(changePassword);

router.route("/:id/logo").patch(logo, updateOrganisationImage);

router.route("/:id").get(getOrganisation).patch(updateOrganisationinfo);

module.exports = router;
