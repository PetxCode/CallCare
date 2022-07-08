const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const clientModel = require("../models/clientModel");

const otpGenerator = require("otp-generator");
const cloudinary = require("../utils/cloudinary");
const {
	verifiedClient,
	verifiedSignClient,
	resetClientPassword,
} = require("../utils/email");

const getClients = async (req, res) => {
	try {
		const user = await clientModel.find().sort({ createdAt: -1 });

		res.status(200).json({ message: "Clients found", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getClient = async (req, res) => {
	try {
		const user = await clientModel.findById(req.params.id);
		res.status(200).json({ message: "clients found", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateClientinfo = async (req, res) => {
	try {
		const { name, address, displayName, phoneNumber, bio } = req.body;
		const user = await clientModel.findByIdAndUpdate(
			req.params.id,
			{
				address,
				displayName,
				phoneNumber,
				bio,
				name,
			},
			{ new: true }
		);
		res.status(200).json({ message: "client profile updated", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateClientImage = async (req, res) => {
	try {
		const image = await cloudinary.uploader.upload(req.file.path);

		const user = await clientModel.findByIdAndUpdate(
			req.params.id,
			{
				avatar: image.secure_url,
				avatarID: image.public_id,
			},
			{ new: true }
		);
		res.status(200).json({ message: "client profile updated", data: user });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const createClient = async (req, res) => {
	try {
		const { email, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const token = crypto.randomBytes(5).toString("hex");
		const accessToken = jwt.sign({ token }, "ThisisNannyProject");

		const user = await clientModel.create({
			email,
			password: hashed,
			organisationCode: token,
			verifiedToken: accessToken,
			status: "client",
			memberCode: otpGenerator.generate(6, {
				lowerCaseAlphabets: false,
				upperCaseAlphabets: false,
				specialChars: false,
				digits: true,
			}),
		});

		verifiedClient(email, user._id, accessToken)
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

const verifyClient = async (req, res) => {
	try {
		const user = await clientModel.findById(req.params.id);

		if (user) {
			if (user.verifiedToken !== "") {
				await clientModel.findByIdAndUpdate(
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

const signinClient = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await clientModel.findOne({ email });
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

					await clientModel.findByIdAndUpdate(
						user._id,
						{ verifiedToken: accessToken },
						{ new: true }
					);
					verifiedSignClient(email, user, accessToken)
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

		const user = await clientModel.findOne({ email });
		if (user) {
			if (user.isVerified && user.verifiedToken === "") {
				const token = crypto.randomBytes(5).toString("hex");
				const accessToken = jwt.sign({ token }, "ThisisNannyProject");

				await clientModel.findByIdAndUpdate(
					user._id,
					{ verifiedToken: accessToken },
					{ new: true }
				);
				resetClientPassword(email, user._id, accessToken)
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
		const user = await clientModel.findById(req.params.id);
		if (user) {
			if (user.isVerified && user.verifiedToken === req.params.token) {
				const salt = await bcrypt.genSalt(10);
				const hashed = await bcrypt.hash(password, salt);

				await clientModel.findByIdAndUpdate(
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
			message: "password has been changed",
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	verifyClient,
	createClient,
	updateClientImage,
	getClient,
	updateClientinfo,
	getClients,
	changePassword,
	signinClient,
	resetPassword,
};
