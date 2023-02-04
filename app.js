require("dotenv").config();
require("express-async-errors");
const connectdb = require("./Model/connectdb");
const express = require("express");
const app = express();
const mainRouter = require("./routes/agronomeRouteSigninSignup");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// routes
app.use("/agronome", mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

connectdb.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
});
