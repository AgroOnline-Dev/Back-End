const mysql= require ("mysql");

//Connection avec la BD
 
   const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password:"",
        database:"actdb"
    });
    con.connect((error)=>{
        if (error) throw error;
        console.log("Connection a la base de donnees reussie !");
    })

 module.exports=con;