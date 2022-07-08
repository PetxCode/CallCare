const adminModel = require("../models/membersModel");
const memberModel = require("../models/membersModel");
const jobModel = require("../models/jobModel");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");

const createJob = async (req, res) => {
	try {
		const { status, cost, title, description } = req.body;

		const createUser = await memberModel.findById(req.params.id);
		const job = await new jobModel({
			cost,
			title,
			description,
			status,
		});

		job.member = createUser;
		job.save();

		createUser.job.push(mongoose.Types.ObjectId(job._id));
		createUser.save();

		res.status(201).json({ message: "Job created", data: job });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewJobs = async (req, res) => {
	try {
		const job = await jobModel.find();
		res.status(201).json({ message: "All Jobs", data: job });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewJob = async (req, res) => {
	try {
		const jobs = await memberModel
			.findById(req.params.id)
			.populate({ path: "job", options: { createdAt: -1 } });

		res.status(201).json({ message: "View Your jobs", data: jobs });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewOneJob = async (req, res) => {
	try {
		const jobs = await memberModel
			.findById(req.params.id)
			.populate({ path: "job", options: { createdAt: -1 }, limit: 1 });

		res.status(201).json({ message: "View one Job", data: jobs });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewJobDetail = async (req, res) => {
	try {
		const jobs = await jobModel.findById(req.params.job);

		res.status(201).json({ message: "View job details", data: jobs });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteJob = async (req, res) => {
	try {
		const createUser = await memberModel.findById(req.params.id);
		const job = await jobModel.findByIdAndRemove(req.params.job);

		createUser.job.pull(job);
		createUser.save();

		res.status(201).json({ message: "job deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateJob = async (req, res) => {
	try {
		const { cost, title, description } = req.body;

		const job = await jobModel.findByIdAndUpdate(
			req.params.job,
			{ title, description, cost },
			{ new: true }
		);
		res.status(201).json({ message: "job updated", data: job });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const likeJob = async (req, res) => {
	try {
		const createUser = await jobModel.findByIdAndUpdate(
			req.params.job,
			{
				$push: { like: req.params.id },
			},
			{ new: true }
		);

		res.status(201).json({ message: "like ", data: createUser });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const disLikeJob = async (req, res) => {
	try {
		const createUser = await jobModel.findByIdAndUpdate(
			req.params.job,
			{
				$pull: { like: req.params.id },
			},
			{ new: true }
		);

		res.status(201).json({ message: "unlike", data: createUser });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	createJob,
	viewJobs,
	viewJob,
	viewOneJob,
	deleteJob,
	updateJob,
	likeJob,
	disLikeJob,
	viewJobDetail,
};
