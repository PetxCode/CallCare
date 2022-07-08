const mongoose = require("mongoose");
const url = "mongodb://localhost/nannyProject";
const url2 =
	"mongodb+srv://leke:callcare@cluster0.e6idm.mongodb.net/callcare?retryWrites=true&w=majority";

mongoose.connect(url2).then(() => {
	console.log("database is now connected...!");
});

module.exports = mongoose;
