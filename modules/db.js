// setup connection -------------------------
const pg = require('pg');
const dbURI = "postgres://sbitvctcgpaste:17e409b2c45cb21e4b61ba9be178ffdd23373d300eca1c6df8dd488132c48906@ec2-18-202-1-222.eu-west-1.compute.amazonaws.com:5432/d380avq949i83s";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: {rejectUnauthorized: false}
});

// database methods -------------------------
let dbMethods = {}; //create empty object

// ------------------------------------
dbMethods.getAllToDoTasks = function(listid, userid) {
    /* console.log(listid);
    console.log(userid); */
    let sql = "SELECT * FROM todo WHERE listid = $1 AND userid = $2";	
	let values = [listid, userid];
    return pool.query(sql, values); 
}

dbMethods.getAllToDoLists = function(userid) {
    let sql = "SELECT * FROM todolists WHERE userid = $1";	
    let values = [userid];
	return pool.query(sql, values); 
}

// ------------------------------------


dbMethods.createToDoTask = function(heading, date, description, userid, listid) {  
    let sql = "INSERT INTO todo (id, date, heading, description, userid, listid) VALUES(DEFAULT, $4, $1, $2, $3, $5) returning *";
	let values = [heading, description, userid, date, listid];	
    return pool.query(sql, values); 
}

// ------------------------------------
dbMethods.deleteToDoTask = function(id, userid) {  
    let sql = "DELETE FROM todo WHERE id = $1 AND userid = $2 RETURNING *";
	let values = [id, userid];
    return pool.query(sql, values); //return the promise
}


dbMethods.editToDoTask = function(heading, date, description, id) {

   //console.log(date, heading, description, id);

    let sql = "UPDATE todo SET date = $1, heading = $2, description = $3 WHERE id = $4 RETURNING *";
    let values = [date, heading, description, id];
    return pool.query(sql, values); 
}

//---------------------------------------------
dbMethods.getAllUsers = function() {  
    let sql = "SELECT id, username FROM users";
    return pool.query(sql); //return the promise
}

//---------------------------------------------
dbMethods.getUser = function(username) {  
    let sql = "SELECT * FROM users WHERE username = $1";
    let values = [username];
    return pool.query(sql, values); //return the promise
}

//---------------------------------------------
dbMethods.createUser = function(username, password, salt) {  
    let sql = "INSERT INTO users (id, username, password, salt) VALUES(DEFAULT, $1, $2, $3) returning *";
    let values = [username, password, salt];
    return pool.query(sql,values); //return the promise
}

//---------------------------------------------
dbMethods.deleteUser = function(id) {  
    let sql = "DELETE FROM users WHERE id = $1 returning *";
    let values = [id];
    return pool.query(sql, values); //return the promise
}

dbMethods.editUser = function(username, password, salt, userID ) {
    //console.log(date, heading, description, id);
    let sql = "UPDATE users SET username = $1, password = $2, salt = $3 WHERE id = $4 RETURNING *";
    let values = [username, password, salt, userID];
    return pool.query(sql, values); 
}



// CREATETODOLIST!!!!!!!!!!!!!!!!!!!!!
// ------------------------------------

dbMethods.createToDoList = function(listname, userid) {  
   /*  console.log(listname);
    console.log(userid); */
    let sql = "INSERT INTO todolists (id, listname, userid) VALUES(DEFAULT, $1, $2) returning *";
	let values = [listname, userid];	
    return pool.query(sql, values); 
}

// ------------------------------------
dbMethods.deleteToDoList = function(id, userid) {  
    let sql = "DELETE FROM todolists WHERE id = $1 AND userid = $2 RETURNING *";
	let values = [id, userid];
    return pool.query(sql, values); //return the promise
}

dbMethods.editToDoList = function(listname, id) {

    //console.log(listname, id);

    let sql = "UPDATE todolists SET listname = $1 WHERE id = $2 RETURNING *";
    let values = [listname, id];
    return pool.query(sql, values); 
}


// export todoMethods -------------------------
module.exports = dbMethods;

