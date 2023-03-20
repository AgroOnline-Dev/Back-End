// IMPORTATION DE MODULE
const db = require("../../model/db");

exports.users = (req, res) => {
    const id = req.user.id;

    // SELECTIONNER TOUS LES ADMINISTRATEURS
    db.query("SELECT * FROM agro.users", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}

exports.investisseur = (req, res) => {
    const id = req.user.id;

    // SELECTIONNER TOUS LES INSVESTISSEURS
    db.query("SELECT * FROM agro.investisseur", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}

exports.demandeur = (req, res) => {
    const id = req.user.id;

    // SELECTIONNER TOUS LES DEMANDEURS
    db.query("SELECT * FROM agro.demandeur", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results })
        }
    });
}

exports.agronome = (req, res) => {
    const id = req.user.id;

    // SELECTIONNER TOUS LES AGRONOMES
    db.query("SELECT * FROM agro.agronome", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}

exports.agriculteur = (req, res) => {
    const id = req.user.id;

    // SELECTIONNER TOUS LES AGRICULTEURS
    db.query("SELECT * FROM agro.agriculteur", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}