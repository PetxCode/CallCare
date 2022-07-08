const {
	updateContentSeen,
	updateContentDeliver,
	deleteContent,
	viewContent,
	viewContents,
	createRequest,
	viewOneContent,
	viewJustContent7,
	requestJob,
} = require("../controllers/requestController");

const express = require("express");
const router = express.Router();

router.route("/:id/:job/create").post(createRequest);
router.route("/:id/:job/request").post(requestJob);

router.route("/:id/").get(viewContent);
router.route("/:id/five").get(viewJustContent7);

router.route("/").get(viewContents);

router.route("/:id/:content").get(viewOneContent).delete(deleteContent);

router.route("/:id/:content/seen").patch(updateContentSeen);

router.route("/:id/:content/deliver").patch(updateContentDeliver);

module.exports = router;
