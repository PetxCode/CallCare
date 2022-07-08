const mongoose = require("mongoose");

const memberModel = mongoose.Schema(
	{
		name: {
			type: String,
		},
		oragnisationName: {
			type: String,
			lowercase: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
		},
		oragnisationCode: {
			type: String,
		},
		phoneNumber: {
			type: String,
		},
		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},
		organisationCode: {
			type: String,
		},
		dislayName: {
			type: String,
		},
		memberCode: {
			type: String,
		},
		address: {
			type: String,
		},
		bio: {
			type: String,
		},

		verifiedToken: {
			type: String,
		},

		isVerified: {
			type: String,
		},
		organisation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "organisations",
		},

		job: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "jobs",
			},
		],

		client: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "clients",
			},
		],
	},
	
	{ timestamps: true }
);

module.exports = mongoose.model("members", memberModel);
