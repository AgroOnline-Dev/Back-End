// IMPORTATION DE MODULE
const db = require("../../model/db");

const adminSearch = (req, res) => {
    const searchTerm = req.body.adminSearch;

    db.query("SELECT id, name, firstName, email FROM agro.admin WHERE name LIKE ? OR firstName LIKE ?", [`%${searchTerm}%`, `%${searchTerm}%`], (error, results) => {
        if (error) {
            throw error;
        } else {
            if (results.length <= 0) {
                res.json({ status: "error", error: "aucun administrateur a ce nom ou prenom" });
            } else {
                res.json({ results: results });
            }
        }
    });
}

module.exports = adminSearch;