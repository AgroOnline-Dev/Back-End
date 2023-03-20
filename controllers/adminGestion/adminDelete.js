// IMPORTATION DE MODULE
const db = require("../../model/db");

const adminDelete = (req, res) => {
    const id = req.params.id;

    // REQUETE SUPPRIMER UNE COLONNE
    db.query("DELETE FROM agro.admin WHERE id = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ status: "success", success: `administrateur à été supprimé`});
        }
    });
}

module.exports = adminDelete;