// Importation des modules
const express = require("express"); // Importation du module Express
const con =require("./dbConnect")
const cors= require("cors");
const routesAgricult=require("./routes/agriculteursRoutes");
const fs = require('fs');
const http=require('http');
const {Server}=require('socket.io')
const path=require('path');
const fileUpload = require("express-fileupload");


// Instanciation du serveur express app
const app = express();

//Definition du port serveur d'écoute
const port=3001;

/* DEBUT PARTIE CHAT */
//Creation serveur pour les messages
const serveur=http.createServer(app);
const io = new Server(serveur)

io.on("connection",(socket)=>{
  
  console.log("Utilisateur connecté : "+socket.id)

  //REACTION A L'EVENT REJOINDRE ROOM
  socket.on("join-room", (room)=>{
    socket.join(room);
    console.log("Vous avez rejoint la room "+room)
  })
  

  //REACTION A L'EVENT ENVOIE DE MESSAGES
  socket.on("send-message", (message)=>{
    const room=message.room;
    const user=message.userName;
    const contenu=message.content;
    const temps=message.time;
    const heure=message.hour;
    console.log("Send Message "+message.room)
    const reqSql=" INSERT INTO messages (temps,room,user,contenu,heure) VALUES (?,?,?,?,?)";
    con.query(reqSql,[temps,room,user,contenu,heure],(err,result)=>{
      if (err){
          console.log(err);      
      }else{
          if(result){
               console.log("Msg saved")
               io.to(message.room).emit("newMsgReceived", {id: new Date().getTime(), ...message})
          }else{
              console.log("Pas d'ingenieurs");
          }
      }
   })
  })

  socket.on("disconnect",()=>{
    console.log("Utilisateur déconnecté : "+socket.id)
  })
})
/* FIN PARTIE CHAT */

//Utilisation de cors pour faire le pont entre le domaine front et backend
app.use(express.json());
app.use(cors());
app.use(fileUpload())
 
//Definition des routes des agriculteurs
app.use(routesAgricult);

//Recuperation des Ingenieurs Agronomes deja enregistres dans la BD pour les afficher sur l'appli
app.get("/Ingenieurs",(req,res)=>{
    const printIng="select * from agronome"
    con.query(printIng,(err,result)=>{
        if (err){
            console.log(err);      
        }else{
            if(result){
                 res.status(201).json(result)
            }else{
                console.log("Pas d'ingenieurs");
            }
        }
    })
})
 
/*
//INSERTION DES FICHES TECHNIQUES DANS LA BD SOUS FORMAT BLOB
 
    const nom='Citronier'
    const description="Ce fichier pdf est une fiche technique sur la culture du citronier. Elle montre comment"
    const filePath="C:/Users/HOUADINA TSONI/Desktop/FichesTech/Citronier.pdf"
    const pdfFile = fs.readFileSync(filePath);
    const query = 'INSERT INTO fichestechniques (nom,description,path) VALUES (?,?,?)';
    con.query(query, [nom,description,pdfFile], (err, results, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log('reussi');
      }
    });
  //};
 */

//RECUPERATION DES FICHES SE TROUVANT DANS LA BD POUR LES AFFICHER AU NIVEAU DE L'APP
app.get("/FichesTechniques",(req,res)=>{
  const printFichesTech="SELECT id,nom,description FROM fichestechniques"
  con.query(printFichesTech,(err,result)=>{
      if (err){
          console.log(err);      
      }else{
          if(result){
            console.log(result)
               res.status(201).json(result)
          }else{
              console.log("Pas de fiches techniques dans la BD");
          }
      }
  })
})
// RENVOIT LES IMAGES DU DOSSIERS RESSOURCES EN FONCTIONS DE LEURS NOMS
app.use(express.static(path.join(__dirname, 'Ressources')));
   
//Ecoute des requettes coté client sur le port 3001
serveur.listen(port,()=>{
    console.log("Server en ecoute au port :"+port);
})