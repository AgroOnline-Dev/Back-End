// IMPORTATION DE MODULE
const db = require("../../model/db");

exports.users = (req, res) => {
    const searchTerm = req.body.userSearch;

    db.query("SELECT id_users, name, email FROM agro.users WHERE name LIKE ?", [`%${searchTerm}%`], (error, results) => {
        if (error) {
            throw error;
        } else {
            if (results.length <= 0) {
                res.json({ status: "error", error: "aucun utilisateur a ce nom" });
            } else {
                res.json({ results: results });
            }
        }
    });
}

exports.investisseur = (req, res) => {
    const searchTerm = req.body.investisseurSearch;

    db.query("SELECT IdInvestisseur, Nom, Prenom, Mail FROM agro.investisseur WHERE Nom LIKE ? OR Prenom LIKE ?", [`%${searchTerm}%`, `%${searchTerm}%`], (error, results) => {
        if (error) {
            throw error;
        } else {
            if (results.length <= 0) {
                res.json({ status: "error", error: "aucun investisseur a ce nom ou prenom" });
            } else {
                res.json({ results: results });
            }
        }
    });
}

exports.demandeur = (req, res) => {
    const searchTerm = req.body.demandeurSearch;

    db.query("SELECT IdDemandeur, Nom, Prenom, Mail FROM agro.demandeur WHERE Nom LIKE ? OR Prenom LIKE ?", [`%${searchTerm}%`, `%${searchTerm}%`], (error, results) => {
        if (error) {
            throw error;
        } else {
            if (results.length <= 0) {
                res.json({ status: "error", error: "aucun demandeur a ce nom" });
            } else {
                res.json({ results: results });
            }
        }
    });
}