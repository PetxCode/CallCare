const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
	{
		who: {
			type: String,
		},
		what: {
			type: String,
		},

		createdBy: {
			type: String,
		},

		organisationName: {
			type: String,
		},

		displayName: {
			type: String,
		},

		organisationCode: {
			type: String,
		},

		description: {
			type: String,
		},

		cost: {
			type: Number,
		},

		seen: {
			type: Boolean,
		},

		accept: {
			type: Boolean,
		},

		member: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "members",
		},

		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "clients",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
