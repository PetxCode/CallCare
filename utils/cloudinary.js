const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "dkpqkzozm",
	api_key: "319124354143983",
	api_secret: "UkD0kFxS4XolhMdTztkoZsZfRrU",
	secure: true,
});

module.exports = cloudinary;
