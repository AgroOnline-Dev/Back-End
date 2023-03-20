const con =require("./dbConnect")
const bcrypt=require("bcrypt");
const fileUpload = require("express-fileupload");

const agriculteur={
    register: (req,res)=>{
        //Recuperation des informations au niveau du corps de la requete du client
        const pseudos=req.body.pseudos;
        const email=req.body.email;
        const region=req.body.region;
        const motsDePasse=req.body.motsDePasse;
    
        //Verification des informations entrees par le client
        if (pseudos==="" ||  motsDePasse==="" || email===""|| region===""){
            res.status(201).json({message:"Veuillez remplir tous les champs"})
        }else{
            if (motsDePasse.length<5){
                res.status(202).json({message:"Le mot de passe doit avoir aumoins 5 caractères"})
            }else{
                const print ="SELECT * FROM agriculteurs WHERE emails=?";
    
                //Verification de l"existence de l'adresse dans la BD
                con.query(print,[email],
                    (err,result)=>{
                    if (err) {
                        console.log(err.sqlMessage);
                    }else{
                        if (result.length>0){
                            res.status(203).json({message:"Cette addresse mail est déjà utilisée"})
                        }else{
                            //Requete insertion
                            const insert="INSERT INTO agriculteurs (pseudos,emails,region,motsDePasse,photo) VALUES (?,?,?,?,?)";
                            
                            //Hashage du mot de passe
                            bcrypt.hash(motsDePasse,4,(err,mdpHache)=>{
                                if (err){
                                    res.status(500).json({message:"Erreur au moment du hachage"})
                                }else if(mdpHache){
                                    console.log("Mot de passe hashed "+mdpHache);
                                    //Photo de profil par defaut
                                    const image="DefaultProfil.jpg"
                            
                                    //Insertion des donnees des utilisateurs dans la BD
                                    con.query(insert,[pseudos,email,region,mdpHache,image],(err,result)=>{
                                        if (result) {
                                            console.log("Compte crée avec succès !");  
                                            res.status(200).json({message:"Compte crée avec succès !"})   
                                        }else if(err){
                                            console.log(err)
                                        }    
                                    });   
                                }
                            })
                        }
                    }
                }); 
            }
        }
    },

    login: (req,res)=>{
        //Recuperation des informations au niveau du corps de la requete
        const email=req.body.email;
        const motsDePasse=req.body.motsDePasse;
    
        //Verification des informations entrees du client
        if (motsDePasse==="" || email===""){
            console.log("Veuillez remplir tous les champs")
            res.status(201).json({message:"Veuillez remplir tous les champs"})
        }else{ 
            //Recuperation du mot de passe dans la BD
            const print1 ="SELECT motsDePasse FROM agriculteurs WHERE emails=?";
            
            con.query(print1,[email],
                (err,result)=>{
                if (err) {
                    console.log(err.sqlMessage);
                }else{                                               
                    if (result.length>0){
                        [mdp]=result;
                        bcrypt.compare(motsDePasse,mdp.motsDePasse,(err,compareRes)=>{
                            if(err){
                                res.status(502).json({message: "Erreur pendant la comparaison"});
                            }else if(compareRes){
                                res.status(200).json({message:"Connexion réussie" })
                            }else{
                                res.status(207).json({message:"Mot de passe incorrect" })
                            }
                        })      
                    }else{  
                        res.status(202).json({message:"Adresse mail incorrecte" })
                    }
                }
            });
        }
    },
    getAgronomes: (req,res)=>{
        const idIng=req.body.id
        const email=req.body.email
        console.log(email)
        console.log(idIng)
    
        const addIng="UPDATE agriculteurs SET idIng=? WHERE emails=?"
        con.query(addIng,[idIng,email],(err,result)=>{
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
    },
    getUserInfoDrawer: (req,res)=>{
        const {Email}=req.params
        console.log('Son email '+Email)
        const printAgri="SELECT pseudos,region,photo,idIng FROM agriculteurs WHERE emails=?"
        con.query(printAgri,[Email],(err,result)=>{
            if (err){
                console.log(err);      
            }else{
                if(result){
                     console.log(result);
                     const [resu]=result
                     res.status(200).send(resu)
                     console.log(resu)
                }else{
                    console.log("Pas d'ingenieurs");
                }
            }
        })
    },
    doSuggestions: (req,res)=>{
        const {objet,emailUser,description}=req.body
        const role="Agriculteur"
        console.log(objet)
        const AddSugg="INSERT INTO suggestions (objet,description,emailUser,role) VALUES (?,?,?,?)";
                            
        con.query(AddSugg,[objet,description,emailUser,role],(err,result)=>{
            if (err){
                console.log(err.sqlMessage);      
            }else{
                if(result){
                     res.status(200).json({message:"Suggestion enregistrée avec succès!"})
                }else{
                    console.log("Pas d'ingenieurs");
                }
            }
        })
    },
    modifyName: (req,res)=>{
        const {nom,email}=req.body
        const UpdateName="UPDATE agriculteurs SET pseudos=? WHERE emails=?";
                            
        con.query(UpdateName,[nom,email],(err,result)=>{
            if (err){
                console.log(err.sqlMessage);      
            }else{
                if(result){
                     res.status(200).json({message:"Nom modified"})
                }else{
                    console.log("Pas d'ingenieurs");
                }
            }
        })
    },
    modifyImageProfile: (req, res)=> {
        const file = req.files.img;
        const {email}=req.params
      
        file.mv(`Ressources/${file.name}`, function (err) {
          if (err) {
            return res.status(505).send(err);
          } 
          const changeProfile="UPDATE agriculteurs SET photo=? WHERE emails=?"
          con.query(changeProfile,[file.name,email],(err,result)=>{
            if (err){
              console.log(err);      
            }else{
              if(result){
                res.status(201)
              }else{
                console.log("Erreur au moment de l'insertion");
              }
            }
          })
        });
      },
    downloadFile : (req, res) => {
        const { id, nom } = req.params;
        con.query(
          `SELECT path FROM fichestechniques WHERE id = ?`,
          [id],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({ error });
            } else if (results.length === 0) {
              res.status(404).json({ message: 'Ce fichier n`existe pas' });
            } else {
              res.setHeader('Content-Type', 'application/pdf');
              res.send(results[0].path);
            }
          }
        );
      }
 }

module.exports=agriculteur;