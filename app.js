require("dotenv").config();
require("express-async-errors");
const connectdb = require("./db/connectdb");
const express = require("express");
const app = express();
const mainRouter = require("./routes/agronome");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware
app.use(express.static("./public"));
app.use(express.json());
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
    console.log("connection successfull");
  }
});

// connectdb.query("SELECT * FROM agronome", (error, results, fields) => {
//   if (error) {
//     throw error;
//   } else {
//     // console.log("This solution is:", results[1]);
//     const info = results[1];
//     console.log(info);
//   }
// });
