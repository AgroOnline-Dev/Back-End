const db = require("../models/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const getUsers = (req, res) => {
  let sql = "select * from users";
  db.query(sql, (err, resuts) => {
    if (err) throw err;
    res.status(200).send(resuts[0].password);
  });
};

const register = (req, res) => {
  const {
    name,
    email,

    password,
    passwordConfirm,
  } = req.body;
  const profil = `http://lochost:5000/sing-up/${req.file.filename}`;
  if (!email) {
    return res
      .status(400)
      .send({ status: 0, message: "Please Provide an email " });
  }

  if (!name) {
    return res
      .status(400)
      .send({ status: 0, message: "Please Provide a name " });
  }

  if (!password) {
    return res
      .status(400)
      .send({ status: 0, message: "Please Provide a password " });
  }

  if (!passwordConfirm) {
    return res
      .status(400)
      .send({ status: 0, message: "Please enter yor password again " });
  }

  db.query(
    "SELECT email from users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length > 0) {
          return res.send({
            status: 0,
            message: "The email is already in use",
          });
        } else if (password != passwordConfirm) {
          return res.send({ status: 0, message: "Password dont match" });
        }
      }

      let hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users SET ?",
        {
          name: name,
          email: email,
          password: hashedPassword,
          profil: profil,
        },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            return res.send({ status: 1, message: "User registered" });
          }
        }
      );
    }
  );
};

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.send({
        status: 0,
        message: "Please Provide an email",
      });
    }

    if (!password) {
      return res.send({
        status: 0,
        message: "Please Provide a password",
      });
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) throw err;
      if (!results || !bcrypt.compare(password, results[0].password)) {
        res.send({ status: 0, message: "Email or Password is incorrect" });
      } else {
        const id = results[0].id_users;
        const email = results[0].email;
        token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES * 60,
        });
        res.cookie("user-token", token, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });
        res.json({
          status: 1,
          message: `${results[0].name} est connecté`,
        });
        // req.session.user = results[0];
        // console.log(req.session.user);
        // const cookieOptions = { expiresIn: new Date("01 12 2024") };
        // res.cookie("user_cookie", results[0], cookieOptions);
        // res.status(201).send({
        //   status: 1,
        //   message: "welcome mr" + req.session.user.name,
        //   user: req.session.user.name,
        // });

        /* const cookieOptions = {
                    maxAge: 5000,
                    // expires works the same as the maxAge
                    expires: new Date('01 12 2025'),
                    
                    httpOnly: true,
                    sameSite: 'lax'
                };*/
        //res.cookie('userSave', token, cookieOptions);
        // res.status(200).send({ message: 'User saved'});
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const isLoggedIn = async (req, res) => {
  if (req.cookies.UseLog) {
    console.log("le cookie existe");
    try {
      // 1. Verify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.UseLog,
        process.env.JWT_SECRET
      );
      console.log(decoded);

      // 2. Check if the user still exist
      db.query(
        "SELECT * FROM users WHERE id_users = ?",
        [decoded.id_users],
        (err, results) => {
          console.log(results);
          if (!results) {
            console.log("non conncté");
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (err) {
      console.log(err);
    }
  } else {
  }
};

const logOut = (req, res) => {
  req.session.destroy("sessionId");
  console.log("ession destryed");
  res.status(200).send({ message: "User logged out" }).redirect("/");
};
const testToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid Token" });
  }
};

const isAuthenticated = (req, res) => {
  console.log(req.session.user);
  if (!req.session.user) {
    console.log(" le cookie est vide ");
    return res.status(200).send({ status: 0, message: "User not connect" });
  }
  /* const user = jwt.verify(
    req.cookies.nameCookie,
    process.env.JWT_SECRET,
    (err, id) => {
      if (err) throw err;
      return id;
    }
  );*/
  if (req.session.user == null) {
    console.log(" l'utilisateur est vide ");
    return res.status(200).send({ status: 0, message: "User not connect" });
  }

  console.log("le cookie marche");
  return res.status(200).send({
    status: 1,
    message: "User connected",
    user: req.session.user.name,
    userP: req.session.user.profil,
  });
};
const verificationToken = (req, res, next) => {
  const token = req.cookies["user-token"];

  if (!token) {
    console.log("il n y'a pas le cookie");
    res.json({ status: 0, erreur: `Vous n'êtes pas connectés` });
    // res.redirect("/")
  } else {
    console.log("il y'a le cookie");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.clearCookie("user-token");
        // res.json({ status: "erreur", erreur: `n'a pas réussi à s'authentifier` });
      } else {
        req.user = decoded;
        console.log(req.user);
        next();
      }
    });
  }
};

const getUserById = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ status: 0, message: "User not connect" });
  }
  const id = req.session.user.id_users;
  let sql = "select * from users  WHERE id_users=?;";
  db.query(sql, [id], (err, resuts) => {
    if (err) throw err;

    res.send({ status: 1, message: resuts[0] });
  });
};

const updateUser = (req, res) => {
  const id = req.session.user.id_users;
  const { name, email, password, profil } = req.body;

  // Vérifier que l'utilisateur existe
  db.query("SELECT * FROM users WHERE id_users = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ status: 0, message: "User not connect" });
    } else if (results.length === 0) {
      res.send({ status: 0, message: "User doesn't exist" });
    } else {
      const user = results[0];
      let hash = user.password; // récupérer le hash du mot de passe existant
      let newPassword = false;

      // Si le mot de passe est modifié, le hacher
      if (password) {
        hash = bcrypt.hashSync(password, 10);
        newPassword = true;
      }

      // Si l'adresse email est modifiée, vérifier qu'elle est unique
      if (email && email !== user.email) {
        db.query(
          "SELECT * FROM users WHERE email = ? AND id_users <> ?",
          [email, id],
          (err, results) => {
            if (err) {
              console.error(err);
              res.status(500).send("Erreur serveur");
            } else if (results.length > 0) {
              res.send({
                status: 0,
                message: `L'adresse email ${email} est déjà utilisée`,
              });
            } else {
              updateUser();
            }
          }
        );
      } else {
        updateUser();
      }

      function updateUser() {
        // Construire la requête SQL en fonction des champs modifiés
        let query = "UPDATE users SET";
        const values = [];

        if (name) {
          query += " name = ?,";
          values.push(name);
        }
        if (email) {
          query += " email = ?,";
          values.push(email);
        }
        if (newPassword) {
          query += " password = ?,";
          values.push(hash);
        }
        if (profil) {
          query += " profil = ?,";
          values.push(profil);
        }

        if (name && email && password && profil) {
          query += " name = ?,email = ?,password = ?,profil = ?";
          values.push(name, email, password, prof);
        }

        // Supprimer la dernière virgule de la requête SQL
        query = query.slice(0, -1);

        // Ajouter la clause WHERE pour l'identifiant utilisateur
        query += " WHERE id_users = ?";
        values.push(id);

        // Mettre à jour l'utilisateur
        db.query(query, values, (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).send("Erreur serveur");
          } else {
            res.send({
              status: 0,
              message: `L'utilisateur avec l'identifiant ${id} a été modifié avec succès`,
            });
          }
        });
      }
    }
  });
};
// Démarrer le serveur

module.exports = {
  getUsers,
  register,
  loginUser,
  isLoggedIn,
  logOut,
  isAuthenticated,
  getUserById,
  updateUser,
  verificationToken,
};
