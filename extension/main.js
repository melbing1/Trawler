/*
Main Extension JS file. Most of the js extension code will be within this file unless it serves a purpose that requires that it
be placed elsewhere.

main.js
(c) Matthew Elbing, [ADD YOUR NAME HERE], 2020

    Example of Usage
    validate("apple.com")
        Do not include http/https or www etc.
*/

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

getRegistrationOf("apple.com", "Apple.com", WhoisDataProcessing, handleRequestRejection);

function validate(domain){
    checkWhiteList(domain); //Check the domain against the whitelist
    checkBlackList(domain); //Check the domain against the blacklist
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
    request.onload = function () { //The API data loaded
        //Read the JSON response from the API within this function

        let rawJson = JSON.parse(this.responseText); //Get raw JSON response and parse into JSON objects
        let registrant = JSON.stringify(rawJson.registrant.organization); //Get the registrant oranganization JSON object and convert it to a string
        registrant = registrant.toString().toLowerCase();
        registrant = registrant.replace(".", ""); //Regex to remove all periods from a string including the last one
        registrant = registrant.replace(new RegExp(/\"/g), "");
        //Checks to the existence of legal incorporation symbols and removes them from the domain string
        //For example: 'apple Inc' -> "apple"
        //Currently this is broken for an unknown reason
        for (var i = 0; i < incorporation.length; i++) {
         if (registrant.toString().includes(incorporation[i])) registrant.split(incorporation[i]).join("");
        }

        if (request.status === 200) success(registrant); //Return registrant organizion if we get an OK from the get request
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
    Check domain against known phishing domains
 */
function checkBlackList(domain){
    return null;
}

/*
    Check the domain against the known domains list for similarity
 */
function similarityCheck(domain){
    return ""; //Return most similar domain
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


/**
 * @description Provide the user with an error message informing them of a non-critical error
 * @param {string} title The title of the alert for the user
 * @param {string} msg The message to display to the user
 * @param {boolean} type The way in which the user is alerted where true indicates a subtle alert and false indicates an obtrusive alert
 */
function alertUser(title, msg, type){
    alert(msg);
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