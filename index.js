const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 2111;
require("./utils/db");
const app = express();

app.use(cors());
app.use(express.json());

app.get((req, res) => {
	res.status(200).json({
		message: "Everything is all set and working fine!",
	});
});

app.get("/", (req, res) => {
	res.status(200).json({ message: "You are welcome to One Church Network" });
});

app.use("/api/organisation", require("./routers/organisationRouter"));
app.use("/api/member", require("./routers/memberRouter"));
app.use("/api/job", require("./routers/jobRouter"));
app.use("/api/client", require("./routers/clientRouter"));
app.use("/api/request", require("./routers/requestRouter"));

app.listen(port, () => {
	console.log("serveris now live");
});
