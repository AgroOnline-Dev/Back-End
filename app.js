// importing modules
const express = require("express");
const dotenv = require("dotenv");
const db = require("./connectdb");
const mainRouter = require("./routes/agronome");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// intialising the environment
const app = express();
dotenv.config();
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});
// logic

app.use("/Ing-Agronome/v1", mainRouter);

//
//
//
//
//
//
//
//
//
//
//
//
//

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    console.log("connection succefull");
  }
});

// starting and configuring server port

const port = process.env.PORT || 3000;
