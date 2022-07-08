const mongoose = require("mongoose");

const jobModel = mongoose.Schema(
	{
		title: {
			type: String,
		},
		description: {
			type: String,
		},

		cost: {
			type: Number,
		},

		status: {
			type: String,
		},

		member: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "members",
		},

		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "clients",
		},

		like: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "likes",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("jobs", jobModel);
