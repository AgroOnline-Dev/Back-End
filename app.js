const express = require('express');
const cors = require ('cors');
const connexion = require('./modele/config/connexionBD')
const cookies = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require ('jsonwebtoken')
const bodyParser = require ('body-parser')
const auth = require ('./middleware/auth')
const router = express.Router();


const port = 3000;
const app = express(); //intancier l'objet express

app.use(cookies());
app.use(cors());
app.use(express.json());
// Configuration de bodyParser pour parser les requêtes JSON
app.use(express.urlencoded({ extended : true}));
app.use(bodyParser.json());



//BODY


// Inscription des utilisateurs
app.post('/registerAsk', (req, res) => {
  const { nom,prenom,email,sexe,tel,region,besoin,status,password } = req.body //Recuperation des valeurs de axios

  //Vérification si les champs sont remplis
  if (!nom || !prenom || !email || !sexe || !tel || !region || !besoin || !status || !password){
    console.log('Veillez remplire tout les champs');
  }
  // Vérification si l'utilisateur existe déjà dans la base de données
  if (status == 'Demandeur') {
    connexion.query('SELECT * FROM agro.demandeurs WHERE mail = ?', [email], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur lors de la vérification de l\'utilisateur' });
      } else if (results.length > 0) {
        return res.status(409).json({ message: 'Cet utilisateur existe déjà' });
      } else {
        // Hashage du mot de passe avant de l'enregistrer dans la base de données
        // Hash the password with crypto
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        const refUsers = 'Demandeur'
        const newUser = [ nom,prenom,email,sexe,tel,region,besoin,hashedPassword ];
        const requet = "INSERT INTO agro.demandeurs (nom,prenom,mail,sexe,tel,region,besoin,password) values (?,?,?,?,?,?,?,?)";
        //connexion.query(requet, [nom,prenom,email,sexe,tel,region,besoin,hashed],(err, results) => {
  
        connexion.query(requet, newUser, (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error creating user' });
          } else {
            console.log(results);
            return res.status(200).json({ message: 'User created successfully' });
          }
        });
      }
    });
  }else if (status == 'Investisseur') 
  {// Inscription d'un utilisateur (demandeurs)
    connexion.query('SELECT * FROM agro.investisseurs WHERE mail = ?', [email], (error, results) => {
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
        const refUsers = 'Investisseur'
        const newUser = [ nom,prenom,email,sexe,tel,region,hashedPassword ];
        const requet = "INSERT INTO agro.investisseurs (nom,prenom,mail,sexe,tel,region,password) values (?,?,?,?,?,?,?)";
        //connexion.query(requet, [nom,prenom,email,sexe,tel,region,besoin,hashed],(err, results) => {
        connexion.query(requet, newUser, (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ message: 'Error creating user' });
          } else {
            console.log(results);
            res.status(200).json({ message: 'User created successfully' });
          }
        });
      }
    });
  }else{
    console.log('investisseur ou demandeur');
    console.log(status)
  }
});

   

// Login login login login login login login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  //Vérification si les champs sont remplis
  if (!email || !password){
    console.log('Veillez remplire tout les champs');
  }
  connexion.query('SELECT * FROM agro.demandeurs WHERE mail = ?', email, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({message: 'Erreur lors de la recherche de l\'utilisateur' });
    } else if (results.length === 0) {

      // INVESTISSEMENT
  connexion.query('SELECT * FROM agro.investisseurs WHERE mail = ?', email, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Erreur lors de la recherche de l\'utilisateur'  });
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

    }else {
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

  
});


// RECUPERER LES INFORMATIONS DE L'UTILISATEURS ET LES AFFICHES DANS DRAWER
app.get('/demandeurs/:email', (req, res) => {
  let {email} = req.params;
  console.log({email})

  let requet1 = 'SELECT *FROM agro.demandeurs WHERE mail=?';
  let requet2 = 'SELECT *FROM agro.investisseurs WHERE mail=?';

  connexion.query(requet1, [email], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({message : 'erreur de récuperation des données'})
    } else if (results.length === 0) {
      connexion.query(requet2, [email], (error, results) => {
        if (error) {
          console.log(error)
          res.status(500).json({message : 'erreur de récuperation des données'})
        } else {
          console.log("user debut")
          console.log(results)
          let [resu]=results
          res.status(200).json(resu)
          console.log("user debut fin")
        }
      })
    }else {
      console.log(results)
      let [resu]=results
      res.status(200).json(resu)
    }
  })
})



//AFFICHER LES UTILISATEURS
app.get ('/users', async (req, res) => {
  let {refUsers} = req.params;

  let requet1 = 'SELECT *FROM agro.demandeurs';
  let requet2 = 'SELECT *FROM agro.investisseurs';

  // Récupération des données de la base de données
  connexion.query(requet2, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({message : 'erreur de récuperation des données'})
    }else {
      console.log(results)
      let [resu]=results
      res.status(200).json(results)
    }

  });
})




// MISE A JOURS DES UTILISATEURS
app.put('/update', async (req, res) => {
  const { id, nom, prenom, email, tel, region, besoin, password } = req.body; // Récupération des valeurs de axios

  if (!nom || !prenom || !email || !tel || !region || !besoin || !password){
    console.log('Veuillez remplir tous les champs');
    return res.status(400).send('Tous les champs doivent être remplis');
  }

  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedPassword = hash.digest('hex');
  const data = [nom, prenom, email, tel, region, besoin, hashedPassword, email];
  connexion.query(
    'UPDATE agro.demandeurs SET nom = ?, prenom = ?, mail = ?, tel = ?, region = ?, besoin = ?, password = ? WHERE mail = ?',
    data,
    (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Une erreur est survenue lors de la mise à jour du demandeur');
      } else {
        console.log(results);
        return res.status(200).send('Le demandeur a été mis à jour avec succès');
      }
    });
});



  app.get('/profile', auth, (req, res) => {
    const userId = req.user.id; // Extraire l'identifiant de l'utilisateur de la charge utile
    // Récupérer les informations de l'utilisateur à partir de la base de données
    // et renvoyer les informations sous forme de réponse JSON
    console.log(req.user.nom);
    res.json({
      id: userId,
      username: req.user.username,
      role: req.user.role
    });
  });



//VERIFICATION
connexion.connect((erreur)=>{
  if(erreur) {
      console.log(erreur);
  }else console.log('BD connected')
    app.listen(port, () => {
    console.log(`Backend démarré sur http://localhost:${port}`);
  });
});
