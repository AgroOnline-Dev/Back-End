// IMPORTATION DE MODULE
const db = require("../model/db");

const profile = (req, res) => {
    const id = req.user.id;
    db.query("SELECT * FROM agro.admin WHERE id = ?", [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({nom: results[0].name, prenom: results[0].firstName, email :results[0].email });
        }
    })
    // res.send("Yo, vous êtes authentifié Félicitations !");
}

module.exports = profile;