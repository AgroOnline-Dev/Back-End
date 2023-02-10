require("dotenv").config();
<<<<<<< HEAD
const cors = require("cors");
require("express-async-errors");
const connectdb = require("./Model/connectdb");
const express = require("express");
const app = express();
const mainRouter = require("./routes/agronomeRouteSigninSignup");
app.use(cors());
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { getAllAgronome } = require("./Model/agronome");

app.use(express.json());

// routes
=======
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
>>>>>>> working on signIn
app.use("/agronome", mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

<<<<<<< HEAD
const port = process.env.PORT || 3001;
=======
const port = process.env.PORT || 3000;
>>>>>>> working on signIn

connectdb.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
<<<<<<< HEAD
  }
});
=======
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
>>>>>>> working on signIn
