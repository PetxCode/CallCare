const clientModel = require("../models/clientModel");

const memberModel = require("../models/membersModel");

const requestModel = require("../models/requestModel");
const jobModel = require("../models/jobModel");

const mongoose = require("mongoose");

const createRequest = async (req, res) => {
	try {
		const job = await jobModel.findById(req.params.job);

		const client = await clientModel.findById(req.params.id);

		const memberJob = await memberModel.findOne({
			member: req.params.job,
		});

		console.log("This is client: ", client);
		console.log("This is member: ", memberJob);

		const request = await new requestModel({
			who: client.name,
			clientName: client.name,

			displayName: client.displayName,

			what: job.title,
			description: job.description,
			cost: job.cost,

			seen: false,
			accept: false,
		});

		memberJob.job = memberJob;
		request.save();

		memberJob.client.push(mongoose.Types.ObjectId(request._id));
		memberJob.save();

		res.status(201).json({ message: "order created", data: request });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const requestJob = async (req, res) => {
	const getUser = await clientModel.findById(req.params.id);

	const getJob = await jobModel.findById(req.params.job);

	const createJob = await new requestModel({
		who: getUser.name,
		what: getJob.title,
		createdBy: getJob.member,
		displayName: getJob.displayName,
		description: getJob.description,
		cost: getJob.cost,
		seen: getJob.seen,
		accept: getJob.accept,
	});

	createJob.client = getUser;
	createJob.save();

	getUser.request.push(mongoose.Types.ObjectId(createJob._id));
	getUser.save();

	res.status(201).json({ message: "order created", data: createJob });
};

const viewContents = async (req, res) => {
	try {
		const content = await contentModel.find();
		res.status(201).json({ message: "All contents", data: content });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewContent = async (req, res) => {
	try {
		const content = await adminModel
			.findById(req.params.id)
			.populate({ path: "order", options: { sort: { createdAt: -1 } } });

		res.status(201).json({ message: "View content", data: content });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewJustContent7 = async (req, res) => {
	try {
		const content = await adminModel.findById(req.params.id).populate({
			path: "order",
			options: { sort: { createdAt: -1 }, limit: 5 },
		});

		res.status(201).json({ message: "View content", data: content });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewOneContent = async (req, res) => {
	try {
		const content = await contentModel.findById(req.params.content);

		res.status(201).json({ message: "View content", data: content });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteContent = async (req, res) => {
	try {
		const getUser = await adminModel.findById(req.params.id);
		const content = await contentModel.findByIdAndRemove(req.params.content);

		getUser.order.pull(content);
		getUser.save();

		res.status(201).json({ message: "content deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateContentSeen = async (req, res) => {
	try {
		const content = await contentModel.findByIdAndUpdate(
			req.params.content,
			{ seen: true },
			{ new: true }
		);
		res.status(201).json({ message: "content updated", data: content });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateContentDeliver = async (req, res) => {
	try {
		const content = await contentModel.findByIdAndUpdate(
			req.params.content,
			{ delivered: true },
			{ new: true }
		);
		res.status(201).json({ message: "content updated", data: content });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	updateContentSeen,
	updateContentDeliver,
	deleteContent,
	viewContent,
	viewContents,
	createRequest,
	viewOneContent,
	viewJustContent7,
	requestJob,
};
