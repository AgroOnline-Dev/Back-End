const db = require('./database')

 function getUsers(){
let sql ="select * from users"
 db.query(sql,(err,resuts)=> {
    if(err) throw err
    console.log(resuts[0].password);
    })
}

export function addUser(name,email,password,profil){
    let sql ="insert into users (name,email,password,profil) values (?,?,?,?)"
    let tableResults  = [name,email,password,profil]
     db.query(sql,tableResults,(err,resuts)=> {
        if(err) throw err
        console.log(resuts);
    })
}
    
export function getUserByEmail(email){
    let sql ="select * from users where email =? "
    let tableResults  = [email]
     db.query(sql,tableResults,(err,resuts)=> {
        if(err) throw err
        console.log(resuts);
    })
 }

 export function updateUser(name,password,email){
    let sql ="UPDATE `users` SET ? WHERE email =?;"
    let tableResults  = [name,password,email]
     db.query(sql,tableResults,(err,resuts)=> {
        if(err) throw err
        console.log(resuts);
    })
 }



        

        const user = updateUser("agro","agro","AGRO_Team@UIECC.com")    
        console.log(user);    