const mongoose = require("mongoose");

const clientModel = mongoose.Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
		},

		phoneNumber: {
			type: String,
		},

		verifiedToken: {
			type: String,
		},

		isVerified: {
			type: String,
		},

		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},

		displayName: {
			type: String,
		},

		address: {
			type: String,
		},

		bio: {
			type: String,
		},

		status: {
			type: String,
		},

		request: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "jobs",
			},
		],

		job: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "jobs",
			},
		],

		member: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "members",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("clients", clientModel);
