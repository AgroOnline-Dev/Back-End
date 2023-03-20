// IMPORTATION DE MODULE
const db = require("../../model/db");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");

const registerAdmin = (req, res) => {

    //VERIFICATION DE L'ADMINISTRATEUR MERE
    // if (req.user.email == process.env.EMAIL_ADMINISTRATEUR_MERE) {

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
            db.query("SELECT email FROM agro.admin WHERE email = ?", [email], async (error, results) => {
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
                            db.query("INSERT INTO agro.admin (email, password, name, firstName) VALUES (?,?,?,?)", [email, hash, name, firstName], (err, results) => {
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
    // } else {
    //     res.json({ status: "erreur", erreur: "Vous n'avez pas acces à cette route"})
    // }
}

module.exports = registerAdmin;