/*
Main Extension JS file. Most of the js extension code will be within this file unless it serves a purpose that requires that it
be placed elsewhere.

main.js
(c) Matthew Elbing, [ADD YOUR NAME HERE], 2020
 */
var obj = {"google":"google.com", "apple" :"apple.com"};
updateLocalWhiteList(obj);
//updateLocalBlacklist();
//alert("This is a test");
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

/*
Args: Domain -> A domain in standard form 
Return: registrant of domain

Using the whois API at ip2whois.com the public record of the domain registrant is retrieved via an asynchronous get request.

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
            handleRequestRejection() //Gracefully handle API access issues
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

function handleRequestRejection(status, jsonData){ //Error handler for WHOIS requests
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

/*
T7 - Maintaining local lists of the 
“known safe domains and ownerships” and 
“known phishing domains” lists
    adds white list domains to local storage 
*/
// testing local storage mechanic
function updateLocalWhiteList(domain) { // assuming one domain is passed in JSON format
    //1. get JSON data from local storage
    // check to make sure there is enough storage
    // this is probably not necessay since storage can store 
    // 
    var parsDomain = JSON.parse(domain);
    browser.storage.local.set(parsDomain);
    // let domainParsW = JSON.parse(domain);
    // handles memory
   // if (storage.storageArea(whiteListLoc) >= browser.storage.) { // placeholder
           // throw new Error("Not enough storage");
    // handles the first domain entry and stores to local storage in JSON
    //if (whiteListLoc === null) 
    //    whiteListLoc.set(domain);
    // handles all other entries
    //else {
        //2. (parse) JSON data to a Javascript object
        //whiteListData = whiteListLoc.get(JSON.parse(whiteListLoc));
        //3. add domain to javascript object
        // assuming the JSON object when converted to a java
        // script object is an array of strings
        //whiteListData.push(domainParse);
        //4. convert object back to JSON (stringify)
       // whitelistData = JSON.stringify(whitelistData);
        //5. store JSON object back to local storage
       //whiteListLoc = storage.storageArea.set(whiteListData);
       //}
}
/*
    Adds black list domains to local storage
*/
// currently being used to test local storage of whitelist
function updateLocalBlacklist() {
    let getData = browser.storage.local.get(); // this should retreive all data from local storage as udefined will do that
    console.log("The data is in local storage as", getData);
    //let blackListLoc = browser.storage.local;
    //let domainParsB =  JSON.parse(domain);

   // if (storage.storageArea(whiteListLoc) >= "bytes allowed") { // placeholder
     //   throw new Error("Not enough storage");
    
   // if (blackListLoc === null) 
       // blackListLoc.set(domain);
    //else blackListData = JSON.parse()

    

    //1. get JSON data from local storage
    //2. (parse) JSON data to a Javascript object
    //3. add domain to javascript object
    //4. convert object back to JSON (stringify)
    //5. store JSON object back to local storage
}