// IMPORTATION DE MODULE
const express = require("express");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const nodemailer = require('nodemailer');
const app = express();
const db = require("./model/db");

//PORT UTILISE
const PORT = 5000 || process.env.PORT;

app.use(express.json());
app.use(cookieParser());

//VERIFICATION CONNEXION A LA BASE DE DONNEE
db.connect((error) => {
    if (error) throw error;
});

//VERIFICATION DU TOKEN
const verificationToken = (req, res, next) => {
    const token = req.cookies["acces-token"];

    if (!token) {
        res.json({ status: "erreur", erreur: `Vous n'êtes pas connectés` });
        // res.redirect("/")
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
                res.clearCookie('acces-token', { path: '/' });
                res.redirect("/");
                // res.json({ status: "erreur", erreur: `n'a pas réussi à s'authentifier` });
            } else {
                req.user = decoded;
                next();
            }
        })
    }
}

//PAGE D'ACCEUIL
app.get("/", (req, res) => {
    res.send('BIENVENU A LA PARTIE ADMINISTRATEUR DU PROJET AGRO On-Line. VEUILLEZ VOUS CONNECTEZ !!!');
});

//INSCRIPTION
app.post("/inscription", verificationToken, (req, res) => {

    //VERIFICATION DE L'ADMINISTRATEUR MERE
    if (req.user.email == process.env.EMAIL_ADMINISTRATEUR_MERE) {

        //RECUPERATION DES INFORMATION DEPUIS LE BODY
        const { email, password, passwordVerify, name, firstName } = req.body;

        //COMPARAISON DES MOT DE PASSE 
        const passwordCompare = password.localeCompare(passwordVerify);

        //VERIFICATION DE L'ORTHOGRAPHE DU EMAIL
        const orthographeEmail = validator.validate(email);

        //VERIFICATION SI UN CHAMPS EST VIDE
        if (!email || !password || !passwordVerify || !name || !firstName) {
            res.json({ status: "erreur", erreur: "entrer toutes les informations" });
        } else if (passwordCompare == 1 || passwordCompare == -1) {
            res.json({ status: "erreur", erreur: "Mot de passe non identique" });
        } else if (!orthographeEmail) {
            res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
        } else {

            //VERIFICATION DE L'EXISTENCE DU MAIL DANS LA BASE DE DONNEE
            db.query("SELECT email FROM admin WHERE email = ?", [email], async (error, results) => {
                if (error)  throw error;
                if (results[0]) {
                    res.json ({ status: "erreur", erreur: "Email est déjà enregistré" })
                } else {

                    //HACHER LE MOT DE PASSE
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            res.json({ error: err});
                        } else {

                            // INSCRIRE ADMINISTRATEUR
                            db.query("INSERT INTO admin (email, password, name, firstName) VALUES (?,?,?,?)", [email, hash, name, firstName], (err, results) => {
                                if (err) throw err;
                                return res.json({ status: "success", success: `${name} a été enregistrer` });
                            });

                            // ENVOIE DES INFORMATIONS POUR LA CONNEXION A L'ADMINISTRATEUR AJOUTER
                            // const transporter = nodemailer.createTransport({
                            //     host: 'smtp.gmail.com',
                            //     port: 587,
                            //     secureOptions: {
                            //         minVersion: 'TLSv1.2',
                            //         maxVersion: 'TLSv1.2',
                            //     },
                            //     secure : true,
                            //     auth: {
                            //         user: process.env.EMAIL_NOM_UTILISATEUR,
                            //         pass: process.env.EMAIL_PASSWORD_ADMINISTRATEUR_MERE
                            //     }
                            // });

                            // const mailOptions = {
                            //     from: req.user.email,
                            //     to: email,
                            //     subject: `Informations du compte administrateur de Mr/Mme ${name}`,
                            //     text : `Voici les informations necessaires pour vous connecter à votre compte. <br/>Votre email: ${email}<br/>Votre mot de passe: ${password}<br/>Pour plus de sécuriter modifier votre mot de passe après votre connexion`
                            // };
                            // console.log(email);
                            // console.log(req.user.email);
                            // console.log(password);
                            // transporter.sendMail(mailOptions, (error, info) => {
                            //     if (error) {
                            //         console.log(error);
                            //     } else {
                            //         console.log(`Email envoyé ${info.messageId}`);
                            //     }
                            // });
                        }
                    });
                }
            });
        } 
    } else {
        res.json({ status: "erreur", erreur: "Vous n'avez pas acces à cette route"})
    }

       
});

//CONNEXION
app.post("/seConnecter", (req, res) => {

    //RECUPERATION DES INFORMATION DEPUIS LE BODY
    const { email, password } = req.body;

    //VERIFICATION DE L'ORTHOGRAPHE DU EMAIL
    const orthographeEmail = validator.validate(email);

    //VERIFICATION SI UN CHAMPS EST VIDE
    if (!email || !password) {
        res.json({ status: "erreur", erreur: "entrer toutes les informations" })
    } else if (!orthographeEmail) {
        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
    } else {
        db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (error, response) => {
                    if (response) {
                        const id = results[0].id;
                        const email = results[0].email
                        token = jwt.sign({id, email}, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES * 60,
                        });
                        res.cookie("acces-token", token, {
                            maxAge: 60 * 60 * 24 * 30 * 1000,
                            httpOnly: true,
                        });
                        res.json({ status: "success", success: `${results[0].name} est connecté` });
                    } else {
                        res.json({ status: "erreur", erreur: `Mauvaise combinaison de email/mot de passe` });
                    }
                });
            } else {
                res.json({ status: "erreur", erreur: `Aucun administrateur existe` });
            }
        });
    }    
});

//PROFIL
app.get("/profil", verificationToken, (req, res) => {
    const id = req.user.id;
    db.query("SELECT * FROM admin WHERE id = ?", [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const admin = results;
            res.json({nom: admin[0].name, prenom: admin[0].firstName, email :admin[0].email });
        }
    })
    // res.send("Yo, vous êtes authentifié Félicitations !");
});

// MODIFICATION DES INFORMATIONS (NOM, PRENOM, MOT DE PASSE)
app.post('/infoUpdate', verificationToken, (req, res) => {
    const id = req.user.id;
    const { newEmail, newName, newFirstName } = req.body;

    //VERIFICATION DE L'ORTHOGRAPHE DU EMAIL
    const orthographeEmail = validator.validate(newEmail);

    //VERIFICATION SI UN CHAMPS EST VIDE
    if (!newEmail && !newName && !newFirstName) {
        res.json({ status: "error", error: "Remplissez les champs"});
        
        //VERIFICATION DE L'EXISTENCE DU MAIL DANS LA BASE DE DONNEE
        db.query("SELECT email FROM admin WHERE email = ?", [email], async (error, results) => {
            if (error)  throw error;
            if (results[0]) {
                res.json ({ status: "erreur", erreur: "Email est déjà enregistré" })
            } else { 
                if (!newEmail && newName && newFirstName) {
                    db.query("UPDATE admin SET name = ?, firstName = ? WHERE id = ?", [newName, newFirstName, id], (err, results) => {
                        if (err) throw err;
                        res.json({ status: "success", success: "nom et prenom modifié"});   
                    });
                } else if (!newEmail && !newName && newFirstName) {
                    db.query("UPDATE admin SET firstName = ? WHERE id = ?", [newFirstName, id], (err, results) => {
                        if (err) throw err;
                        res.json({ status: "success", success: "prenom modifié"});
                    });
                } else if (newEmail && !newName && !newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE admin SET email = ? WHERE id = ?", [newEmail, id], (err, results) => {
                            if (err) throw err;
                            res.json({ status: "success", success: "email modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }  
                } else if (newEmail && newName && !newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE admin SET email = ?, name = ? WHERE id = ?", [newEmail, newName, id], (err, results) => {
                            if (err) throw err;
                            res.json({ status: "success", success: "email et nom modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }    
                } else if (!newEmail && newName && !newFirstName) {
                    db.query("UPDATE admin SET name = ? WHERE id = ?", [newName, id], (err, results) => {
                        if (err) throw err;
                        res.json({ status: "success", success: "name modifié"});   
                    });
                } else if (newEmail && !newName && newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE admin SET email = ?, firstName = ? WHERE id = ?", [newEmail, newFirstName, id], (err, results) => {
                            if (err) throw err;
                            res.json({ status: "success", success: "email et prenom modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }  
                } else if (newEmail && newName && newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE admin SET email = ?, name = ?, firstName = ? WHERE id = ?", [newEmail, newName, newFirstName, id], (err, results) => {
                            if (err) throw err;
                            res.json({ status: "success", success: "email, nom et prenom modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }  
                }
            } 
        }); 
    }          
});

// MODIFICATION DU MOT DE PASSE
app.post("/passwordUpdate", verificationToken, (req, res) => {
    const id = req.user.id;
    const { oldPassword, newPassword } = req.body;

    //VERIFICATION SI UN CHAMPS EST VIDE
    if (!oldPassword || !newPassword) {
        res.json({ status: "error", error: "Remplissez les champs"}); 
    } else {
        db.query("SELECT * FROM admin WHERE id = ?", [id], (err, results) => {
            if (err) throw err;
            if (results.length > 0){
                bcrypt.compare(oldPassword, results[0].password, (err, response) => {
                    if (response) {
                        bcrypt.hash(newPassword, 10, (err, hash) => {
                            if (err) {
                                throw err;
                            } else {
                                db.query("UPDATE admin SET password = ? WHERE id = ?", [hash, id], (err, results) => {
                                    if (err) throw err;
                                    res.json({ status: "success", success: "mot de passe modifié"}); 
                                })
                            }
                        })
                    } else {
                        res.json({ status: "error", error: "entrez votre ancien mot de passe"})
                    }
                })
            }
        });
    }
});

//DECONNEXION
app.get("/seDeconnecter", verificationToken, (req, res) => {
    res.clearCookie('acces-token', { path: '/' });
    res.json({ status: "success", success: "Vous vous êtes deconnecté" });
});

app.listen(PORT, (req, res) => {
    console.log(`On écoute sur le port ${PORT}`);
});