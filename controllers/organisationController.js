const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const organisationModel = require("../models/organisationModel");

const cloudinary = require("../utils/cloudinary");
const {
	verifiedUser,
	verifiedSignUser,
	resetUserPassword,
} = require("../utils/email");

const getOrganisations = async (req, res) => {
	try {
		const user = await organisationModel.find().sort({ createdAt: -1 });

		res.status(200).json({ message: "Organisations found", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getOrganisationMember = async (req, res) => {
	try {
		const user = await organisationModel
			.findById(req.params.id)
			.populate({ path: "member", options: { sort: { createdAt: -1 } } });
		res.status(200).json({ message: "Organisations found", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getOrganisation = async (req, res) => {
	try {
		const user = await organisationModel.findById(req.params.id);
		res.status(200).json({ message: "Organisations found", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateOrganisationinfo = async (req, res) => {
	try {
		const { location, phoneNumber } = req.body;
		const user = await organisationModel.findByIdAndUpdate(
			req.params.id,
			{
				location,
				phoneNumber,
			},
			{ new: true }
		);
		res
			.status(200)
			.json({ message: "Organisations profile updated", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateOrganisationImage = async (req, res) => {
	try {
		const image = await cloudinary.uploader.upload(req.file.path);

		const user = await organisationModel.findByIdAndUpdate(
			req.params.id,
			{
				logo: image.secure_url,
				logoID: image.public_id,
			},
			{ new: true }
		);
		res
			.status(200)
			.json({ message: "Organisations profile updated", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const createOrganisations = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const token = crypto.randomBytes(5).toString("hex");
		const accessToken = jwt.sign({ token }, "ThisisNannyProject");

		const user = await organisationModel.create({
			email,
			password: hashed,
			name,
			organisationCode: token,
			verifiedToken: accessToken,
			status: "organisation",
		});

		verifiedUser(email, user._id, accessToken)
			.then((result) => {
				console.log("sent: ", result);
			})
			.catch((error) => {
				console.log(error);
			});

		res.status(200).json({
			message: "please Check your email",
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const verifyOrganisation = async (req, res) => {
	try {
		const user = await organisationModel.findById(req.params.id);

		if (user) {
			if (user.verifiedToken !== "") {
				await organisationModel.findByIdAndUpdate(
					user._id,
					{
						verifiedToken: "",
						isVerified: true,
					},
					{ new: true }
				);

				res.status(200).json({
					message: "You can now sign in",
				});
			} else {
				res.status(404).json({ message: "sorry you can't do this" });
			}
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const signinOrganisation = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await organisationModel.findOne({ email });
		if (user) {
			const check = await bcrypt.compare(password, user.password);
			if (check) {
				if (user.isVerified && user.verifiedToken === "") {
					const { password, ...info } = user._doc;
					const myToken = jwt.sign(
						{
							_id: user._id,
							status: user.status,
						},
						"Let'sGetinNOW...",
						{ expiresIn: "2d" }
					);

					res
						.status(201)
						.json({ message: "welcome back", data: { myToken, ...info } });
				} else {
					const token = crypto.randomBytes(5).toString("hex");
					const accessToken = jwt.sign({ token }, "ThisisNannyProject");

					await organisationModel.findByIdAndUpdate(
						user._id,
						{ verifiedToken: accessToken },
						{ new: true }
					);
					verifiedSignUser(email, user, accessToken)
						.then((result) => {
							console.log("message sent again: ", result);
						})
						.catch((error) => console.log(error));
				}
			} else {
				res.status(404).json({ message: "Password isn't correct" });
			}
		} else {
			res.status(404).json({ message: "no user found" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await organisationModel.findOne({ email });
		if (user) {
			if (user.isVerified && user.verifiedToken === "") {
				const token = crypto.randomBytes(5).toString("hex");
				const accessToken = jwt.sign({ token }, "ThisisNannyProject");

				await organisationModel.findByIdAndUpdate(
					user._id,
					{ verifiedToken: accessToken },
					{ new: true }
				);
				resetUserPassword(email, user._id, accessToken)
					.then((result) => {
						console.log("message sent again: ", result);
					})
					.catch((error) => console.log(error));

				res.status(200).json({
					message: "Check your email to continue",
				});
			} else {
				res
					.status(404)
					.json({ message: "You do not have enough right to do this!" });
			}
		} else {
			res.status(404).json({ message: "user can't be found" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const changePassword = async (req, res) => {
	try {
		const { password } = req.body;
		const user = await organisationModel.findById(req.params.id);
		if (user) {
			if (user.isVerified && user.verifiedToken === req.params.token) {
				const salt = await bcrypt.genSalt(10);
				const hashed = await bcrypt.hash(password, salt);

				await organisationModel.findByIdAndUpdate(
					user._id,
					{
						verifiedToken: "",
						password: hashed,
					},
					{ new: true }
				);
			}
		} else {
			res.status(404).json({ message: "operation can't be done" });
		}

		res.status(200).json({
			message: "password changed",
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	verifyOrganisation,
	createOrganisations,
	updateOrganisationImage,
	getOrganisation,
	updateOrganisationinfo,
	getOrganisations,
	changePassword,
	signinOrganisation,
	resetPassword,
	getOrganisationMember,
};
