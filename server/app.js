// Libraries and imports
const mysql = require('mysql');
const request = require('request');
const http = require('http');
const url = require('url');
var stringSimilarity = require('string-similarity');
var db;

// Create db object
db = mysql.createConnection({
    host    : 'localhost',
    user    : '',
    password    : '',
    database    : 'phishing'
});

// Connect to the database with db object
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Connected to phishing db...');
});

// HTTP Server to send and receive requests
const server = http.createServer((req, res) => {
    // req (request) object comes to the server from the browser
    // Parses query string (ex: ?domain=001return.com) into an object { domain: "001return.com" }
    let path = url.parse(req.url, true);
    var JSONquery = JSON.parse(JSON.stringify(path.query));

    // Booleans to tell if the domain has been found in a list 
    var inMalicious = false;
    var inSafe = false;
    var foundDomain = "false";

    // If the given domain is not null and the similarity check is false, check the lists
    if (JSONquery.domain != "" && JSONquery.simCheck == "false"){

        // Query the database to grab existing safe domains
        db.query("SELECT * FROM phishing.safedomains", (err, result, fields) => {
            if (err) throw err;
            // For each entry in the database, compare the given domain to that entry
            for (i=0; i<2; i++){
                if (JSONquery.domain == result[i].domain){
                    // The domain has been found in the safelist, return true
                    console.log("Found safe domain: " + JSONquery.domain);
                    // Flag inSafe boolean to indicate it has been found 
                    inSafe = true;
                    break;
                }
            }
            // HTTP Response
            // If the given domain has been found in the safe list, send "Found safe domain" response
            if (inSafe == true){
                res.writeHead(200);
                res.end("Found safe domain\n");
            }else{
                console.log("Domain not found in safe list");

            }
        });

        // If the domain wasn't found in the safe list, proceed
        if (inSafe == false){
            // Query the database to grab all of the known malicious domains
            db.query("SELECT * FROM phishing.maliciousdomains", (err, result, fields) => {
                if (err) throw err;
                // For each entry in the database, compare the given domain to that entry
                for (i=0; i<71325; i++){

                    if (JSONquery.domain == result[i].domain){
                        // The domain has been found in the blacklist, return true
                        console.log("Found domain: " + JSONquery.domain);
                        // Flag inMalicious boolean to indicate it has been found 
                        inMalicious = true;
                        foundDomain = "same";
                        break;
                    }
                }

                // HTTP Response
                // If the given domain has been found in the blacklist, send "Found malicious domain" response
                if (inMalicious == true){
                    res.writeHead(200);
                    res.end("Found malicious domain\n");
                }
                else{
                    //console.log("Domain not found in any list");
                }
            });
        }
    // If the similarity checker is enabled
    }else if (JSONquery.simCheck == "true"){
        // Ensure that the domain hasn't been found already
        if (inSafe == false && inMalicious == false){
            // Query the database for all safe domains
            db.query("SELECT * FROM phishing.safedomains", (err, result, fields) => {
                if (err) throw err;

                var similarityValue;
                var theDomain = "";
                var respObj;
                // For every entry in the safe list
                for (i=0; i<2; i++){
                    // Assign a similarity value by comparing two strings
                    similarityValue = stringSimilarity.compareTwoStrings(JSONquery.domain, result[i].domain);

                    // The greater the similarity value, the more similar the two strings are. (To achieve 0.8 they must be very similar)
                    if (similarityValue > 0.8){
                        foundDomain = "true";
                        theDomain = result[i].domain;
                        if (theDomain == JSONquery.domain){
                            foundDomain = "same";
                        }
                    }
                }
                // HTTP Responses
                if (foundDomain == "true"){
                    respObj = '{"found": true, "domain": "' + theDomain + '"}';
                    console.log("Found similar domain\n");
                    res.writeHead(200);
                    res.end(respObj);
                }else if (foundDomain == "false") {
                    respObj = '{"found": false, "domain": "NULL"}';
                    console.log("Did not find similar domain\n");
                    res.writeHead(200);
                    res.end(respObj);
                }else{
                    console.log("Error");
                }
            });
        }
    }
    else{
        console.log("End of request");
    }
});


// Start the server and listen on the specified port
server.listen(1234, () => {
    console.log('Server is listening on port 1234...\n');
});


