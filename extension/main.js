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
function validate(domain){
    checkWhiteList(domain); //Check the domain against the whitelist
    checkBlackList(domain); //Check the domain against the blacklist
    let assertedRegistrant = similarityCheck(domain); //Check for similarity too a domain
    suggest(assertedRegistrant); //Suggest the correct spelling for the URL
    getRegistrationOf(domain); //If the user wants to continue, the heuristic check is performed
}

/**
 * @description Using the whois API at ip2whois.com the public record of the domain registrant is retrieved via an asynchronous get request.
 * @param {*} domain The domain which is to be used to build a WHOIS API query. 
 */
function getRegistrationOf(domain) { //Gets JSON data about a domain from the public record
    let completeUrl = "https://api.ip2whois.com/v1?key=free&domain=" + domain; //Create a complete query with the domain function argument
    let request = new XMLHttpRequest() //Create Request
    request.open("GET", completeUrl, true); //Open an https connection for the given constructed URL
    request.onload = function () { //The API data loaded
        //Read the JSON response from the API within this function

        let rawJson = JSON.parse(this.responseText); //Get raw JSON response and parse into JSON objects
        let registrant = rawJson.registrant.organization; //Get the registrant orange

        if (registrant === null || registrant === "" && registrant === " ") { //Ensure that the request was successful
            handleRequestRejection(request.status, rawJson); //Gracefully handle API access issues
        }
    }
    request.send() //Request data via get query
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
 * @description Gracefully handle failed API requests
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
        alertUser("Corrupt API Responce", "The json data is not available or was corrupted in transit", true);
    



    console.log(status.status)
    //PLACEHOLDER ERROR HANDLING
    console.log("Failed to get registration data");
    console.log("Request Status: " + status);
    console.log("Request Response JSON: " + jsonData);
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
    alert(msg)
}
