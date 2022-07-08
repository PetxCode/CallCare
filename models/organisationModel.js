const mongoose = require("mongoose");

const organisationModel = mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
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
		organisationCode: {
			type: String,
		},
		phoneNumber: {
			type: String,
		},
		location: {
			type: String,
		},
		status: {
			type: String,
		},
		logo: {
			type: String,
		},
		logoID: {
			type: String,
		},
		verifiedToken: {
			type: String,
		},

		isVerified: {
			type: String,
		},

		member: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "members",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("organisations", organisationModel);
