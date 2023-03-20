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

// configuration de la clé secret
// app.use(session({
//   secret: 'secretKey',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false,
//     maxAge: 1000 * 60 * 60 * 24 //session expire après 24h
//   }
// }))

// app.use((req, res, next) => {
//   const sessionId = req.cookies.sessionId;

//   if (sessionId) {
//       // session exists, continue with the request
//       next();
//   } else {
//       // session does not exist, redirect to login page
//       res.redirect('/login');
//   }
// });


//BODY

// INSCRIPTION DES UTILISATEURS
// app.post('/registerAsk', async (req, res) => {

//   const { nom,prenom,email,sexe,tel,region,besoin,password : password1 } = req.body //Recuperation des valeurs de axios
//   // console.log(req)
//   // const existingUser = await User.findOne({ email });
//   //   if (existingUser) {
//   //     return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
//   //   }
//   //Hacher le mot de passe
//   await bcrypt.hash(password1, 10, (err, hashed) => {
//     if (err){
//       console.log("impossible");
//     }
//     else{
//       const requet = "INSERT INTO demandeurs (nom,prenom,mail,sexe,tel,region,besoin,password) values (?,?,?,?,?,?,?,?)";
//       connexion.query(requet, [nom,prenom,email,sexe,tel,region,besoin,hashed],(err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.status(200).json({message : 'Welcome '+ results.nom});
//       })
//       // connexion.end();
//     }
//   })
// });



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
    connexion.query('SELECT * FROM investisseurs WHERE mail = ?', [email], (error, results) => {
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
        const newUser = [ nom,prenom,email,sexe,tel,region,besoin,hashedPassword ];
        const requet = "INSERT INTO agro.investisseurs (nom,prenom,mail,sexe,tel,region,besoin,password) values (?,?,?,?,?,?,?,?)";
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
    //   bcrypt.hash(password, 10, (error, hash) => {
    //     if (error) {
    //       console.log(error);
    //       res.status(500).json({ message: 'Erreur lors du hashage du mot de passe' });
    //     } else {
    //       const passwordEncoded = Buffer.from(password, 'utf-8').toLocaleString('hex');
    //       // Enregistrement de l'utilisateur dans la base de données
    //       const requet = "INSERT INTO demandeurs (nom,prenom,mail,sexe,tel,region,besoin,password) values (?,?,?,?,?,?,?,?)";
    //       connexion.query(requet, [nom,prenom,email,sexe,tel,region,besoin, passwordEncoded], (error, results) => {
    //         if (error) {
    //           console.log('c\'est ici :'+ error);
    //           res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    //         } else {
    //           // res.status(200).json({message : 'Welcome '+ results});
    //           res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    //         }
    //       });
    //     }
    //   });
    // }
//   });
// });

// Authentification d'un utilisateur
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Recherche de l'utilisateur dans la base de données
//   connexion.query('SELECT * FROM demandeurs WHERE mail = ?', [email], (error, results) => {
//     if (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Erreur lors de la recherche de l\'utilisateur' });
//     } else if (results.length === 0) {
//       res.status(402).json({ message: 'Adresse email ou mot de passe incorrect' });
//     } else {
//       const user = results[0];
//       // console.log(user);

//       // Comparaison du mot de passe saisi avec le mot de passe haché stocké dans la base de données
//       bcrypt.compare(password, user.password, (error, result) => {
//         if (error) {
//           console.log(error);
//           res.status(500).json({ message: 'Erreur lors de la comparaison des mots de passe' });
//         } else {
//           console.log(result);
//         }if (result) {
//           // Génération du token d'authentification
//           const token = req.headers.authorization.split(' ')[1];
//           jwt.verify(token, 'secret', (err, decodedToken) => {
//         if (err) {
//           res.status(401).json({ message: 'Token invalide' });
//         } else {
//           // Le token est valide, vous pouvez continuer l'exécution de votre code
//           // decodedToken contient les données que vous avez encodées dans le token
//           res.status(401).json({ message: 'Adresse email ou mot de passe incorrect' });
//         }
//       });
//       }
//     })
        

//   }
//   });
// });



app.post('/login', (req, res) => {
  const { email, password } = req.body;
  //Vérification si les champs sont remplis
  if (!email || !password){
    console.log('Veillez remplire tout les champs');
  }
  connexion.query('SELECT * FROM agro.demandeurs WHERE mail = ?', email, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error finding user' });
    } else if (results.length === 0) {

      // INVESTISSEMENT
  connexion.query('SELECT * FROM agro.investisseurs WHERE mail = ?', email, (error, results) => {
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

    }    else {
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

  let requet1 = 'SELECT *FROM demandeurs WHERE mail=?';
  let requet2 = 'SELECT *FROM investisseurs WHERE mail=?';

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
          console.log(results)
          let [resu]=results
          res.status(200).json(resu)
        }
      })
    }else {
      console.log(results)
      let [resu]=results
      res.status(200).json(resu)
    }
  })
})

app.get ('/users', async (req, res) => {
  let {refUsers} = req.params;

  let requet1 = 'SELECT *FROM demandeurs';
  let requet2 = 'SELECT *FROM investisseurs';

  // Récupération des données de la base de données
  connexion.query(requet1, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({message : 'erreur de récuperation des données'})
    } else {
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


// INVESTISSEURS

// Route connexion
// app.post('/login', (req, res) => {
//   // Récupération des données de la requête
//   const email = req.body.email;
//   const passwordLogin = req.body.passwordIn;
//   console.log('Your password typing is : ' + passwordLogin);

//   if (!email || !passwordLogin) {
//     console.log('Veillez entrer votre mail et mdp');
//   }else{
//     connexion.query('SELECT * FROM demandeurs', [email], (error, results, fields) => {
//       if (error) {
//         console.log('Erreur de récupération des données des utilisateurs :', error);
//         res.status(500).json({ message: 'Erreur de récupération des données des utilisateurs' });
//       } else {
//         console.log('Liste des utilisateurs :', results);
//         res.status(200).json({ users: results });
//       }
//     });
//   }
// })
    // Recherche de l'utilisateur dans la base de données
//     connexion.query('SELECT * FROM demandeurs WHERE mail = ?', [email], (error, results, fields) => {
//       if (error) {
//         console.log('Erreur de récupération des données de l\'utilisateur :', error);
//         res.status(500).json({ message: 'Erreur de récupération des données de l\'utilisateur' });
//       } else if (results.length === 0) {
//         // Utilisateur non trouvé, envoi d'une erreur
//         console.log("L'utilisateur n'existe pas");
//         res.status(404).json({ message: "L'utilisateur n'existe pas" });
//       } else {
//         const user = results[0];
//         // Vérification du mot de passe
//         console.log(passwordLogin + ' type : ' + typeof(passwordLogin));
//         console.log(user.nom + ' hash : ' + user.password);
  
//         new Promise((resolve, reject) => {
//           bcrypt.compare(passwordLogin, user.password, (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           });
//         })
//         .then((result) => {
//           if (result) {
//             // Connexion réussie, génération du token d'authentification
//             const token = jwt.sign({ email: user.mail }, secret, { expiresIn: '1h' });
  
//             // Envoi de la réponse avec le token d'authentification
//             console.log('Connexion réussie');
//             res.status(200).json({
//               message: 'Connexion réussie',
//               token: token,
//               username: user.username,
//             });
//           } else {
//             // Mot de passe incorrect, envoi d'une erreur
//             console.log('Mot de passe incorrect');
//             res.status(401).json({ message: 'Mot de passe incorrect' });
//           }
//         })
//         .catch((error) => {
//           console.log('Erreur de comparaison de mots de passe :', error);
//           res.status(500).json({ message: 'Erreur de comparaison de mots de passe' });
//         });
//       }
//     });
//   }

// });


  // app.post('/login', async (req, res) => {
  //   const email = req.body.email;
  //   const password = req.body.password;
  
  //   if (!email || !password) {
  //     return res.status(400).json({ message: 'Email et mot de passe requis' });
  //   }
  
  //   try {
  //     connexion.query('SELECT * FROM demandeurs WHERE mail = ?', [email], async (error, results, fields) => {
  //       if (error) {
  //         console.log('Erreur de récupération des données de l\'utilisateur :', error);
  //         res.status(500).json({ message: 'Erreur de récupération des données de l\'utilisateur' });
  //       } else if (results.length === 0) {
  //         // Utilisateur non trouvé, envoi d'une erreur
  //         console.log("L'utilisateur n'existe pas");
  //         res.status(404).json({ message: "L'utilisateur n'existe pas" });
  //       } else {
  //         const user = results[0];
  //         // ...
  //         const passwordMatch = await bcrypt.compare(password, user.password);
      
  //         if (!passwordMatch) {
  //           return res.status(401).json({ message: 'Mot de passe incorrect' });
  //         }
      
  //         const token = jwt.sign({ email: user.mail }, secret, { expiresIn: '1h' });
      
  //         return res.status(200).json({
  //           message: 'Connexion réussie',
  //           token: token,
  //           username: user.username,
  //         });
  //       }
  //     })
      
  
  //   } catch (error) {
  //     console.log('Erreur de récupération des données de l\'utilisateur :', error);
  //     return res.status(500).json({ message: 'Erreur de récupération des données de l\'utilisateur' });
  //   }
  // });




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
