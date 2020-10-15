/*
Main Extension JS file. Most of the js extension code will be within this file unless it serves a purpose that requires that it
be placed elsewhere.

main.js
(c) Matthew Elbing, [ADD YOUR NAME HERE], 2020

*/
/*
Example of Usage
    validate("apple.com")
        Do not include http/https or www etc.
*/

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//npm install string-similarity
var stringSimilarity = require('string-similarity');

// Hardcoded phishing site database (100 entries)
const maliciousData = [
    {
        "domainId": 1,
        "domain": "001return.com"
    },
    {
        "domainId": 2,
        "domain": "00000000000000000000000000000000000000dfjjjhv.000webhostapp.com"
    },
    {
        "domainId": 3,
        "domain": "000000000000000000000000000000000000dbscrfg.000webhostapp.com"
    },
    {
        "domainId": 4,
        "domain": "000000000000000000000000000yteyeuya.000webhostapp.com"
    },
    {
        "domainId": 5,
        "domain": "00000000000000000dhl.000webhostapp.com"
    },
    {
        "domainId": 6,
        "domain": "00000000000000rqrewewrwrdfq.000webhostapp.com"
    },
    {
        "domainId": 7,
        "domain": "0000000000000qowowiieueu0000000.000webhostapp.com"
    },
    {
        "domainId": 8,
        "domain": "0000000wer.000webhostapp.com"
    },
    {
        "domainId": 9,
        "domain": "00000skunnnn.000webhostapp.com"
    },
    {
        "domainId": 10,
        "domain": "00024390000067.000webhostapp.com"
    },
    {
        "domainId": 11,
        "domain": "000945.000webhostapp.com"
    },
    {
        "domainId": 12,
        "domain": "000f02ef-3ec1-4247-ae2a-17788214a6a0.htmlpasta.com"
    },
    {
        "domainId": 13,
        "domain": "000m8ih.wcomhost.com"
    },
    {
        "domainId": 14,
        "domain": "000web2.000webhostapp.com"
    },
    {
        "domainId": 15,
        "domain": "000web3.000webhostapp.com"
    },
    {
        "domainId": 16,
        "domain": "000webhos1.000webhostapp.com"
    },
    {
        "domainId": 17,
        "domain": "000webhostcrazystikers.000webhostapp.com"
    },
    {
        "domainId": 18,
        "domain": "000wechost.000webhostapp.com"
    },
    {
        "domainId": 19,
        "domain": "000wexbhost.000webhostapp.com"
    },
    {
        "domainId": 20,
        "domain": "001-prime-000.com"
    },
    {
        "domainId": 21,
        "domain": "001return.com"
    },
    {
        "domainId": 22,
        "domain": "001tr3nsf00.com"
    },
    {
        "domainId": 23,
        "domain": "003999.cc"
    },
    {
        "domainId": 24,
        "domain": "005desj-verfact1.com"
    },
    {
        "domainId": 25,
        "domain": "005verf-d.com"
    },
    {
        "domainId": 26,
        "domain": "005verf-desj01controle.com"
    },
    {
        "domainId": 27,
        "domain": "005verfdesj-act1.com"
    },
    {
        "domainId": 28,
        "domain": "005verfdesj-action.com"
    },
    {
        "domainId": 29,
        "domain": "005verf-desjactnow.com"
    },
    {
        "domainId": 30,
        "domain": "005verf-desj.com"
    },
    {
        "domainId": 31,
        "domain": "005verf-desjcontrole01.com"
    },
    {
        "domainId": 32,
        "domain": "006.co.il"
    },
    {
        "domainId": 33,
        "domain": "006.zzz.com.ua"
    },
    {
        "domainId": 34,
        "domain": "009verf-desj.com"
    },
    {
        "domainId": 35,
        "domain": "00ad019.000webhostapp.com"
    },
    {
        "domainId": 36,
        "domain": "00-c1aimn0w.com"
    },
    {
        "domainId": 37,
        "domain": "00de.blob.core.windows.net"
    },
    {
        "domainId": 38,
        "domain": "00emt123.com"
    },
    {
        "domainId": 39,
        "domain": "00o0o0o0o0oqqqdddouuoooo0oorderoooiofile0ooo.000webhostapp.com"
    },
    {
        "domainId": 40,
        "domain": "00vk.tk"
    },
    {
        "domainId": 41,
        "domain": "0101010scotia-rst.agency"
    },
    {
        "domainId": 42,
        "domain": "011bank.com"
    },
    {
        "domainId": 43,
        "domain": "012345bet.com"
    },
    {
        "domainId": 44,
        "domain": "012qas.000webhostapp.com"
    },
    {
        "domainId": 45,
        "domain": "01921.cnltsln.com"
    },
    {
        "domainId": 46,
        "domain": "01ab4d64-0fbb-411e-bac1-a50a9987c622.htmlpasta.com"
    },
    {
        "domainId": 47,
        "domain": "01m0n3ym4il00set.com"
    },
    {
        "domainId": 48,
        "domain": "0202202comcast0212145.000webhostapp.com"
    },
    {
        "domainId": 49,
        "domain": "023316807029161-dot-ifile-document.appspot.com"
    },
    {
        "domainId": 50,
        "domain": "025g.top"
    },
    {
        "domainId": 51,
        "domain": "025sn.com"
    },
    {
        "domainId": 52,
        "domain": "027sn.com"
    },
    {
        "domainId": 53,
        "domain": "02ci9bc-33i.com"
    },
    {
        "domainId": 54,
        "domain": "02ci-bc3lk.com"
    },
    {
        "domainId": 55,
        "domain": "030277188517882-dot-ifile-document.appspot.com"
    },
    {
        "domainId": 56,
        "domain": "030sn.com"
    },
    {
        "domainId": 57,
        "domain": "03383bd.netsolhost.com"
    },
    {
        "domainId": 58,
        "domain": "03418f6.netsolhost.com"
    },
    {
        "domainId": 59,
        "domain": "039026.com"
    },
    {
        "domainId": 60,
        "domain": "03.by"
    },
    {
        "domainId": 61,
        "domain": "041ffb0c97e1baf5ae407c63f4feffa5.com"
    },
    {
        "domainId": 62,
        "domain": "0440082.wcomhost.com"
    },
    {
        "domainId": 63,
        "domain": "0441ecc.wcomhost.com"
    },
    {
        "domainId": 64,
        "domain": "049864ac5e806f903e13b6558e846f87.udagwebspace.de"
    },
    {
        "domainId": 65,
        "domain": "04a9d0bc-0ebf-4fc1-bff5-ff4090db82fd.htmlpasta.com"
    },
    {
        "domainId": 66,
        "domain": "05-006-001.com"
    },
    {
        "domainId": 67,
        "domain": "0517.info"
    },
    {
        "domainId": 68,
        "domain": "053xsecurity-pages.000webhostapp.com"
    },
    {
        "domainId": 69,
        "domain": "0591234.com"
    },
    {
        "domainId": 70,
        "domain": "059148217030.ctinets.com"
    },
    {
        "domainId": 71,
        "domain": "05f1a4ea-1bd4-4fe3-8d4c-5dbf4668e4a7.htmlpasta.com"
    },
    {
        "domainId": 72,
        "domain": "05verf-desjaction1.com"
    },
    {
        "domainId": 73,
        "domain": "05verf-lcd.com"
    },
    {
        "domainId": 74,
        "domain": "05verification-desjconnection.com"
    },
    {
        "domainId": 75,
        "domain": "06642.ir"
    },
    {
        "domainId": 76,
        "domain": "0673edbf-0770-4366-90c0-4ea7a9d98a79.htmlpasta.com"
    },
    {
        "domainId": 77,
        "domain": "06ci9bc-73.com"
    },
    {
        "domainId": 78,
        "domain": "06d8cbf0-4ce5-4fab-aed9-8f37d7c13256.htmlpasta.com"
    },
    {
        "domainId": 79,
        "domain": "06thsense.com"
    },
    {
        "domainId": 80,
        "domain": "0731yewang.cn"
    },
    {
        "domainId": 81,
        "domain": "07701-d3p01slt.com"
    },
    {
        "domainId": 82,
        "domain": "077jnbcvbn-fghj.000webhostapp.com"
    },
    {
        "domainId": 83,
        "domain": "079350326878598-dot-ifile-document.appspot.com"
    },
    {
        "domainId": 84,
        "domain": "079876pt.000webhostapp.com"
    },
    {
        "domainId": 85,
        "domain": "081.co.uk"
    },
    {
        "domainId": 86,
        "domain": "0851sn.com"
    },
    {
        "domainId": 87,
        "domain": "0871ye.com"
    },
    {
        "domainId": 88,
        "domain": "08safety-help.000webhostapp.com"
    },
    {
        "domainId": 89,
        "domain": "09098765467892345678001.000webhostapp.com"
    },
    {
        "domainId": 90,
        "domain": "0913291928783581922.top"
    },
    {
        "domainId": 91,
        "domain": "09-2019adesao-way--sac.cloudaccess.host"
    },
    {
        "domainId": 92,
        "domain": "093u93u030e03.000webhostapp.com"
    },
    {
        "domainId": 93,
        "domain": "098secure.000webhostapp.com"
    },
    {
        "domainId": 94,
        "domain": "099976gr1.000webhostapp.com"
    },
    {
        "domainId": 95,
        "domain": "09dhhgy.000webhostapp.com"
    },
    {
        "domainId": 96,
        "domain": "09ofarya.000webhostapp.com"
    },
    {
        "domainId": 97,
        "domain": "09safety-help.000webhostapp.com"
    },
    {
        "domainId": 98,
        "domain": "09w.cloudns.asia"
    },
    {
        "domainId": 99,
        "domain": "0a0be174-ee07-4d6f-9f68-14b0c2bb2514.htmlpasta.com"
    },
    {
        "domainId": 100,
        "domain": "0b3d5087-314f-4299-a47a-5a9f742a5d1d.htmlpasta.com"
    }
]

getRegistrationOf("apple.com", "Apple.com", WhoisDataProcessing, handleRequestRejection);

/*
Demo Functions:

validate("Apple.com");
validate("mozilla.org");
validate("hofstra.edu");
*/


function validate(domain){
    /*
    Temporarily removed for demo
    checkWhiteList(domain); //Check the domain against the whitelist
    checkBlackList(domain); //Check the domain against the blacklist
    */
    siteList(domain); //See if the site is good bad or unknown.
    let assertedRegistrant = similarityCheck(domain); //Check for similarity too a domain
    suggest(assertedRegistrant); //Suggest the correct spelling for the URL
    getRegistrationOf(domain); //If the user wants to continue, the heuristic check is performed
}

/**
 * @description Using the whois API at ip2whois.com the public record of the domain registrant is retrieved via an asynchronous get request.
 * @param {string} domain The domain in standardardized format which is to be used to build a WHOIS API query.
 * @param {string} compareTo The suspected domain registrant
 * @param {function} successCallback Called on async success
 * @param {function} FailureCallback Called on aysnc failure
 */
function getRegistrationOf(domain, compareTo, success, failure) { //Gets JSON data about a domain from the public record
    let completeUrl = "https://api.ip2whois.com/v1?key=free&domain=" + domain; //Create a complete query with the domain function argument
    let request = new XMLHttpRequest() //Create Request
    let incorporation = ["llc", "inc", "corp", "university"]; //TODO: Extend this list if nessasary

    request.open("GET", completeUrl, true); //Open an async https connection for the given constructed URL
    request.onload = function () { //The API data loaded and can now be safely utilized
        //Read the JSON response from the API within this function only due async execution

        let rawJson = JSON.parse(this.responseText); //Get raw JSON response from the API and parse it into individual JSON objects
        let registrant = JSON.stringify(rawJson.registrant.organization); //Get the registrant oranganization JSON object and convert it to a string
        
        registrant = registrant.toString().toLowerCase();

        //Remove periods and quotes from JSON data for consistency
        registrant = registrant.replace(".", "");
        registrant = registrant.replace(new RegExp(/\"/g), "");
        
        /* Checks to the existence of legal incorporation symbols and removes them from the domain string
        For example: 'apple inc' -> "apple" */
        var incSymbolRegularExpression = ""; //Temp value to build custom per-iteration regex expressions
        incorporation.forEach(incorporationSymbol => {
            if (registrant.includes(incorporationSymbol))
                registrant = registrant.replace(new RegExp(incorporationSymbol, "g"), ""); //Find all instances of the incorporation symbol with a regex and remove them from the string
        });

        if (request.status === 200) success(registrant.trim()); //Return registrant organizion if we get an OK from the get request
        else failure(request.status, rawJson); //Call the handleRequestRejection function to alert the system (and user if needed) about the API issue
        return;

        /* 
        This code should probably be deprecated as there is no good reason to handle edge cases here for both reliability and testing reasons.
        if (registrant === null || registrant === "" || registrant === " " || registrant === undefined) { //Ensure that the request was successful
            handleRequestRejection(request.status, rawJson); //Gracefully handle API access issues
        } 
        */
    }
    request.send() //Request data via get query
}

/*
    Callback function for the whois asychronous execution where the api data (when and if received) is processed
    IMPORTANT: All code that deals with data from the WHOIS API call must start within this function. Otherwise the data will NOT be accurate
*/
function WhoisDataProcessing(registrant, compareTo){
    /*

    */
    //console.log(registrant);
    return registrant == compareTo;
}


/*
    Trim domain wrapping units which are unnessaray
    Args: url -> A full URL
    Return: domain -> A domain string (domain.tld)

    For example: "https://www.apple.com/mac/" should become "apple.com" 
*/

function trimDomain(url){
    let domain = url; //PLACEHOLDER
    return domain
}

/**
 * @description Gracefully handle failed API requests. Failed callback for getRegistrationOf(domain)
 * @param {number} status The HTTP GET status string 
 * @param {JSON} jsonData The raw JSON data of the request if it exists.
 */
function handleRequestRejection(status, jsonData) { //Error handler for WHOIS requests
    //The API is down or unreachable
    if (status == 404) { 
        alertUser("API Unreachable", "WHOIS API was unreachable, heuristics are not being performed", true);
        console.log("API was unreachable")
        return
    }
    if (jsonData == null || jsonData.toString == "")
        alertUser("Corrupt API Responce", "The registration data for this domain is not available or was corrupted in transit", true);
    



    /*console.log(status.status)
    //PLACEHOLDER ERROR HANDLING
    console.log("Failed to get registration data");
    console.log("Request Status: " + status);
    console.log("Request Response JSON: " + jsonData); */
}

/*
    Check domain against known safe domains whitelist
 */
function checkWhiteList(domain){
    return null;
}

/*
    Check domain against known phishing domains.
    Args: domain -> A domain in string format
    Return: The matched domain in string format or null if not found
 */
function checkBlackList(domain){
    /*
      const maliciousData is the malicious domain database in JSON format.
      To access a specific entry use: maliciousData[n], where n = entry number.
      The domainId or domain for that entry can be accessed via: 
      maliciousData[n].domainId OR maliciousData[n].domain
    */

    /*
      For every entry in the database, check to see if the provided domain
      matches the entry.
    */
    for (var entry in maliciousData){
        if (domain == maliciousData[entry].domain){
            console.log('Matched domain: ' + entry);

            //Return the matched domain string.
            return true;
        }
    }
    return false;
}

/*
    Check the domain against the known domains list for similarity
 */
function similarityCheck(domain){
    var similarityValue;

    // For every entry in the phishing sites list
    for (var entry in maliciousData){

        //Perform a similarity check on the domain that was passed in and current entry in the database
        similarityValue = stringSimilarity.compareTwoStrings(domain, maliciousData[entry].domain);

        /* 
        Value returned is a decimal between [0,1].
        If the returned value is greater than 0.8
        (meaning they are very similar), suggest domain 
        to the user.
        */
        if (similarityValue > 0.8){
            console.log('Did you mean to go to: ' + maliciousData[entry].domain + '?');
            return maliciousData[entry].domain;
        }
    }
    //Notify user if no similar domain is found
    console.log('No similar domains found.');
    return null;
}

/*
    Suggest a corrected URL to handle URL Typos
 */
function suggest(registrant){
    /*
    Create suggestion for correct URL and display it to the user
     */
    return null;
}




function updateLocalWhiteList(domain){

}

function updateLocalBlacklist(domain){

}
    

/**
 * @description Provide the user with an error message informing them of a non-critical error
 * @param {string} title The title of the alert for the user
 * @param {string} msg The message to display to the user
 * @param {boolean} type The way in which the user is alerted where true indicates a subtle alert and false indicates an obtrusive alert
 */
function alertUser(title, msg, type){
    alert(title + "\n", msg);
}

function siteList(domain){
    console.log("LL");
    if(checkWhiteList){
        return;
    } else if(checkBlackList(domain)) {
        alert(domain + " is a known phishing site, For your safty we are stopping you from going there.");
    } else{
        alert("This is a unknown site. Procede with caution");
    }
}

/*
* Example testing function
*/
/*
function add(x,y){
    return x + y;
}
*/

/*
* NOTE: export for testing purposes only
*/
exports.getRegistrationOf = getRegistrationOf;
exports.WhoisDataProcessing = WhoisDataProcessing;
exports.handleRequestRejection = handleRequestRejection;

//Example export for testing
//exports.add = add; 

// Main Calls
var myDomain = "001return.com";
//checkBlackList(myDomain);
//similarityCheck("001return.com");

validate(myDomain);

