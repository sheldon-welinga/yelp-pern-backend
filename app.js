const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//routes
app.use("/api/v1/restaurants", require("./routes/restaurants"));
app.use("/api/v1/reviews", require("./routes/reviews"));

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
