const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDb = require("./dbconfig/dbcon");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", require("./routes/user-routes"));
app.use("/api/links", require("./routes/link-routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
