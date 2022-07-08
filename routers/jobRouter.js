const {
	createJob,
	viewJobs,
	viewJob,
	viewOneJob,
	deleteJob,
	updateJob,
	likeJob,
	disLikeJob,
	viewJobDetail,
} = require("../controllers/jobController");

const express = require("express");
const router = express.Router();

router.route("/:id/create").post(createJob);
router.route("/:id/").get(viewJob);
router.route("/:id/:job/detail").get(viewOneJob);

router.route("/").get(viewJobs);
router.route("/:id/:job").get(viewJobDetail).patch(updateJob).delete(deleteJob);

router.route("/:id/:job/like").post(likeJob);

router.route("/:id/:job/dislike").post(disLikeJob);

module.exports = router;
