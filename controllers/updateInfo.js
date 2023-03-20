// IMPORTATION DE MODULE
const db = require("../model/db");
const validator = require("email-validator");
const bcrypt = require("bcryptjs");

exports.infoNormal = (req, res) => {
    const id = req.user.id;
    const newName = req.body.newName;
    const newFirstName = req.body.newFirstName;
    const newEmail = req.body.newEmail;

    //VERIFICATION DE L'ORTHOGRAPHE DU EMAIL
    const orthographeEmail = validator.validate(newEmail);

    //VERIFICATION SI UN CHAMPS EST VIDE
    if (!newEmail && !newName && !newFirstName) {
        res.json({ status: "error", error: "Remplissez les champs"});
    } else {
        //VERIFICATION DE L'EXISTENCE DU MAIL DANS LA BASE DE DONNEE
        db.query("SELECT email FROM agro.admin WHERE email = ?", [newEmail], async (error, results) => {
            if (error) {
                throw error
            } else if (results[0]) {
                res.json ({ status: "erreur", erreur: "Email est déjà enregistré" })
            } else {
                if (!newEmail && newName && newFirstName) {
                    db.query("UPDATE agro.admin SET name = ?, firstName = ? WHERE id = ?", [newName, newFirstName, id], (err, results) => {
                        if (err) throw err;
                        console.log("d");
                    res.json({ status: "success", success: "nom et prenom modifié"});   
                    });
                } else if (!newEmail && !newName && newFirstName) {
                    db.query("UPDATE agro.admin SET firstName = ? WHERE id = ?", [newFirstName, id], (err, results) => {
                        if (err) throw err;
                        res.json({ status: "success", success: "prenom modifié"});
                    });
                } else if (newEmail && !newName && !newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE agro.admin SET email = ? WHERE id = ?", [newEmail, id], (err, results) => {
                            if (err) throw err;
                            console.log("e");
                            res.json({ status: "success", success: "email modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }  
                } else if (newEmail && newName && !newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE agro.admin SET email = ?, name = ? WHERE id = ?", [newEmail, newName, id], (err, results) => {
                            if (err) throw err;
                            res.json({ status: "success", success: "email et nom modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }    
                } else if (!newEmail && newName && !newFirstName) {
                    db.query("UPDATE agro.admin SET name = ? WHERE id = ?", [newName, id], (err, results) => {
                        if (err) throw err;
                        res.json({ status: "success", success: "name modifié"});   
                    });
                } else if (newEmail && !newName && newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE agro.admin SET email = ?, firstName = ? WHERE id = ?", [newEmail, newFirstName, id], (err, results) => {
                            if (err) throw err;
                            res.json({ status: "success", success: "email et prenom modifié"});   
                        });
                    } else {
                        res.json({ status: "erreur", erreur: "Orthographe email n'est pas conforme" });
                    }  
                } else if (newEmail && newName && newFirstName) {
                    if (orthographeEmail) {
                        db.query("UPDATE agro.admin SET email = ?, name = ?, firstName = ? WHERE id = ?", [newEmail, newName, newFirstName, id], (err, results) => {
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
}

exports.password = (req, res) => {
    const id = req.user.id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    //VERIFICATION SI UN CHAMPS EST VIDE
    if (!oldPassword || !newPassword) {
        res.json({ status: "error", error: "Remplissez les champs"}); 
    } else {
        db.query("SELECT * FROM agro.admin WHERE id = ?", [id], (err, results) => {
            if (err) throw err;
            if (results.length > 0){
                bcrypt.compare(oldPassword, results[0].password, (err, response) => {
                    if (response) {
                        bcrypt.hash(newPassword, 10, (err, hash) => {
                            if (err) {
                                throw err;
                            } else {
                                db.query("UPDATE agro.admin SET password = ? WHERE id = ?", [hash, id], (err, results) => {
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
}