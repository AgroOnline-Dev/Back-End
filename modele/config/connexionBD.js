const mysql = require('mysql');
const dotenv = require("dotenv").config();

// CONNEXION A LA BASE DE DONNEES
const connexion = mysql.createConnection({
    host: 'agroserveur.mysql.database.azure.com',
    user : 'Bdagro',
    password : 'Agro2023',
    database : 'agro',
    port : 3306,
});

module.exports = connexion;