const express = require("express");
const upload = require("../utils/multer");
const {
	createMember,
	viewMembers,
	signinMember,
	resetPassword,
	changePassword,
	verifyOrganisationMemebr,
	MemberJobsCreate,
	viewMember,
	updateMemberImage,
	updateMemberInfo,
} = require("../controllers/memberController");
const router = express.Router();

router.route("/").get(viewMembers);
// check
router.route("/:id/jobs").get(MemberJobsCreate);

router.route("/register").post(createMember);

router.route("/signin").post(signinMember);

router.route("/:id/:token").get(verifyOrganisationMemebr);

router.route("/reset").post(resetPassword);
router.route("/change/:id/:token").post(changePassword);

router.route("/:id/image").patch(upload, updateMemberImage);

router.route("/:id").get(viewMember).patch(updateMemberInfo);
// .delete(deleteAdmin);

module.exports = router;
