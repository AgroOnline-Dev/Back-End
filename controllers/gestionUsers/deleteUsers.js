// IMPORTATION DE MODULE
const db = require("../../model/db");

exports.users = (req, res) => {
    const id = req.params.id;

    // REQUETE SUPPRIMER UNE COLONNE
    db.query("DELETE FROM agro.users WHERE id_users = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ status: "success", success: `utilisateur à été supprimé`});
        }
    });
}

exports.investisseur = (req, res) => {
    const id = req.params.id;

    // REQUETE SUPPRIMER UNE COLONNE
    db.query("DELETE FROM agro.investisseur WHERE IdInvestisseur = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ status: "success", success: `investisseur à été supprimé`});
        }
    });    
}

exports.demandeur = (req, res) => {
    const id = req.params.id;

    // REQUETE SUPPRIMER UNE COLONNE
    db.query("DELETE FROM agro.demandeur WHERE IdDemandeur = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ status: "success", success: `Demandeur à été supprimé`});
        }
    });    
}

exports.agronome = (req, res) => {
    const id = req.params.id;

    // REQUETE SUPPRIMER UNE COLONNE
    db.query("DELETE FROM agro.agronome WHERE IdAgronome = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ status: "success", success: `agronome à été supprimé`});
        }
    });
}

exports.agriculteur = (req, res) => {
    const id = req.params.id;

    // REQUETE SUPPRIMER UNE COLONNE
    db.query("DELETE FROM agro.agriculteur WHERE IdAgriculteur = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ status: "success", success: `agriculteur à été supprimé`});
        }
    });   
}