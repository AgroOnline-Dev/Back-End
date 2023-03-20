// const express = require('express')
// const connexion = require('../config/connexionBD')
// const crypto = require('crypto')
// const jwt = require ('jsonwebtoken')
// const bodyParser = require ('body-parser')


// app.use(cookies());
// app.use(express.json());
// // Configuration de bodyParser pour parser les requêtes JSON
// app.use(express.urlencoded({ extended : true}));
// app.use(bodyParser.json());

// const userLogin = (req, res) => {
//     const { email, password } = req.body;
  
//     connexion.query('SELECT * FROM demandeurs WHERE mail = ?', email, (error, results) => {
//       if (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Error finding user' });
//       } else if (results.length === 0) {
//         res.status(401).json({ message: 'Incorrect email or password' });
//       } else {
//         const user = results[0];
  
//         // Hash the password with crypto and compare
//         const hash = crypto.createHash('sha256');
//         hash.update(password);
//         const hashedPassword = hash.digest('hex');
  
//         if (user.password === hashedPassword) {
//           const token = jwt.sign({ userId: user.id }, 'RANDOM_SECRET_TOKEN_in', { expiresIn: '1h' });
//           res.status(200).json({
//             message: 'Authentication successful',
//             token: token,
//           });
//         } else {
//           res.status(401).json({ message: 'Incorrect email or password' });
//         }
//       }
//     });
//   }
  

// module.exports = {userLogin}