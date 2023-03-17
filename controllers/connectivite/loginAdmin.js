// // IMPORTATION DE MODULE
const db = require("../../model/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const dotenv = require("dotenv").config();

const loginAdmin = (req, res) => {

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
        db.query("SELECT * FROM agro.admin WHERE email = ?", [email], (err, results) => {
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
}

module.exports = loginAdmin;