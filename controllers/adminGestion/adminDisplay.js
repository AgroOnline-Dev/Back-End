// IMPORTATION DE MODULE
const db = require("../../model/db");

const adminDisplay = (req, res) => {
    const id = req.user.id;

    // SELECTIONNER TOUS LES ADMINISTRATEURS
    db.query("SELECT * FROM agro.admin", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results })
        }
    });
}

module.exports = adminDisplay