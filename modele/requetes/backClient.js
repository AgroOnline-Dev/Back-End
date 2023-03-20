const express = require('express')
const cors = require('cors');
const connexion = require('../config/connexionBD')
const crypto = require('crypto')
const jwt = require ('jsonwebtoken')
const bodyParser = require ('body-parser')

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());


// Inscription d'un utilisateur
const userRegisterAsk = (req, res) => {
    const { nom,prenom,email,sexe,tel,region,besoin,password } = req.body //Recuperation des valeurs de axios
    console.log(nom);
  
    //Vérification si les champs sont remplis
    if (!nom || !prenom || !email || !sexe || !tel || !region || !besoin || !password){
      console.log('Veillez remplire tous les champs');
    }
    // Vérification si l'utilisateur existe déjà dans la base de données
    connexion.query('SELECT * FROM demandeurs WHERE mail = ?', [email], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la vérification de l\'utilisateur' });
      } else if (results.length > 0) {
        res.status(409).json({ message: 'Cet utilisateur existe déjà' });
      } else {
        // Hashage du mot de passe avant de l'enregistrer dans la base de données
        // Hash the password with crypto
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
  
        const newUser = [ nom,prenom,email,sexe,tel,region,besoin,hashedPassword ];
        const requet = "INSERT INTO demandeurs (nom,prenom,mail,sexe,tel,region,besoin,password) values (?,?,?,?,?,?,?,?)";
  //       connexion.query(requet, [nom,prenom,email,sexe,tel,region,besoin,hashed],(err, results) => {
  
        connexion.query(requet, newUser, (error, results) => {
          if (error) {
            console.log(error);
    console.log(nom);
            res.status(500).json({ message: 'Error creating user' });
          } else {
            console.log(results);
            res.status(200).json({ message: 'User created successfully' });
          }
        });
      }
  });
  }
  
  


  const userLogin = (req, res) => {
    const { email, password } = req.body;
  
    connexion.query('SELECT * FROM demandeurs WHERE mail = ?', email, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Error finding user' });
      } else if (results.length === 0) {
        res.status(401).json({ message: 'Incorrect email or password' });
      } else {
        const user = results[0];
  
        // Hash the password with crypto and compare
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
  
        if (user.password === hashedPassword) {
          const token = jwt.sign({ userId: user.id }, 'RANDOM_SECRET_TOKEN_in', { expiresIn: '1h' });
          res.status(200).json({
            message: 'Authentication successful',
            token: token,
          });
        } else {
          res.status(401).json({ message: 'Incorrect email or password' });
        }
      }
    });
  }
  



module.exports = {
    userLogin,
    userRegisterAsk
}