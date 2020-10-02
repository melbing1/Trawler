/*
Database JS file. The database code will live in here because it cannot run in the browser.

Run before using: npm install mysql
To run this file, open a terminal and type: node database.js

**ONLY WORKS IF YOU HAVE MYSQL INSTALLED**

database.js
(c) Matthew Elbing, [ADD YOUR NAME HERE], 2020
 */

// Import mysql functions
const mysql = require('mysql');

/*
    Establishes a connection to the database 
*/
const db = mysql.createConnection({
    host: 'localhost',   // Only runs on local machine currently
    user: 'admin1',      // Change this to the user you want to use
    password: 'root',    // Probably should store this in a cfg file...
    database: 'phishing' // Database table name
});

/*
    Connects to the database using the db object and
    the provided properties(host, username, password, database)
*/
db.connect((err) => {
    if(err) throw err;  // Throw an error if unable to connect
    console.log('Connected to the phishing db...');
});

/*
    Gets the entire list of blacklisted domains from the database.
*/
function getBlacklistedDomains(){
    var sqlQuery = 'SELECT * FROM maliciousdomains'; 

    // Run the provided SQL query
    db.query(sqlQuery, (err, results) => {
        if (err) throw err;

        // Log the data returned
        console.log(results);
    });
};

getBlacklistedDomains();
