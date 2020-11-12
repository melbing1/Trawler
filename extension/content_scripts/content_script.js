//PLEASE RESET THE whoIsResponce VALUE TO NULL AFTER  IT IS READ S.T. IT DOES NOT GIVE MISLEADING DATA
//Please compare domains to the `whoIsResponce` var to check validity
whoIsResponce = null; //Boolean value after getRegistrantOf() is called; true if the registerant and the compareTo are equal, else otherwise
foundDomain = false;
abort = false; //Cancel the WHOIS API quert
troubleshootCounter = 0;


/**
 * @description Sends a message to alert the user with a GUI element
 * @param {string} title Title of the GUI alert
 * @param {string} message Text content of the GUI alert
 * @param {boolean} popup Creates a pop-up alert if value true, and an operating system notification from the browser if false
 */
function msgUser(title, message, popup){
    var sending = browser.runtime.sendMessage({
        data: {
            call: "alertUser",
            title: title,
            msg: message,
            type: popup
        }
    });
    sending.then(handleResponce, handleError)
}
/**
 * @description Sends a message to write to local.storage with two lists for which domainsList[n] = ownersList[n] s.t. the owner of domainsList[n] is the owner at ownersList[n]
 * @param {[string]} domainsList list of domains
 * @param {[string]} ownersList list of owners of domains1
 */
function writeDBLocalStorage(domainsList, ownersList){
    var sending = browser.runtime.sendMessage({
        data: {call: "writeDBLocalStorage", domains: domainsList, owners: ownersList}});
    sending.then(handleWriteSuccess, handleErrorLocalDB);
}
/**
 * @description Sends a message to read the contents of local.storage. Then either pass the data to handleReadData or calls handleErrorLocalDB if an issue is encountered
 * @returns {boolean} Async request  
 */
function readDBLocalStorage(){
    var sending = browser.runtime.sendMessage({ data: {call: "readDBLocalStorage"} });
    sending.then(handleReadData, handleErrorLocalDB);
    return true;
}

function trimUrl(url){
    var hostnameStr = new URL(url).hostname;
    return hostnameStr.substring(hostnameStr.lastIndexOf(".", hostnameStr.lastIndexOf(".") - 1) + 1);
}

//Call back functions for readDBLocalStorage and writeDBLocalStorage
/**
 * @description Called when data is read successfully by readDBLocalStorage
 * @param {Object} message A JS object with the contents that were send by sendResponce(obj)
 * @returns {boolean} success?  
 */
function handleReadData(message){
    console.log("Domains: " + message.responce.domains);
    console.log("Owners: " + message.responce.owners);
    return true;
}
function handleErrorLocalDB(error){
    console.log("Error: " + error);
    return true;
}
//HandleResponce and HandleError are generic callbacks for non-essential responces
function handleResponce(msg){
    console.log(msg);
    return true
}
function handleError(err){
    console.log(err);
    return true;
}

function troubleshoot(){
    if (troubleshootCounter < 1) //Prevent multiple popups due to abnormal timings 
        msgUser("Error", "An unknown error has occurred", true);
    troubleshootCounter = troubleshootCounter + 1;
}

/**
 * @description Called when data is read successfully by readDBLocalStorage
 * @param {boolean} msg Did the write succeed?
 * @returns {boolean} Processing Success?
 */
function handleWriteSuccess(msg){
    console.log("Write Success");
    return true;
}
function handleError(error){
    console.log(error);
}

//DEMO FUNCTIONS STORAGE
var exampleDomList = ["google.com", "apple.com", "hofstra.edu"];
var exampleOwnerList = ["google", "apple", "hofstra"];

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
    let incorporation = ["llc", "inc", "corp", "university"];
    console.log("getReg");
    if (domain == "")
        return;
    request.open("GET", completeUrl, true); //Open an async https connection for the given constructed URL
    request.onload = function () { //The API data loaded and can now be safely utilized
        //Read the JSON response from the API within this function only due async execution
        let rawJson = JSON.parse(this.responseText); //Get raw JSON response from the API and parse it into individual JSON objects
        let registrant = null;
        try {
            registrant = JSON.stringify(rawJson.registrant.organization); //Get the registrant oranganization JSON object and convert it to a string
        }
        catch {
            failure("NO RESPONCE");
        }
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

        if (request.status === 200) success(registrant.trim(), compareTo); //Return registrant organizion if we get an OK from the get request
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

function queryDB(domain) { //Gets JSON data about a domain from the public record
    console.log(domain);
    let completeUrl = "http://ec2-3-134-253-33.us-east-2.compute.amazonaws.com:1234/?domain=" + domain + "&simCheck=false"; //Create a complete query with the domain function argument
    let request = new XMLHttpRequest() //Create Request
    request.open("GET", completeUrl, true); //Open an async https connection for the given constructed URL
    request.onload = function () { //The data loaded and can now be safely utilized
        let response = this.responseText; //Get raw response from the webserver
        console.log("Running DB Query");
        if (response.trim() == "Found safe domain"){
            console.log("Found safe domain");
            foundDomain = true;
        }
        else if (response.trim() == "Found malicious domain"){
            if(confirm(domain + " is a known phishing site. Would you like to be redirected?")){
                reDirect(-1);
            }
            console.log("Found malicious domain");
            foundDomain = true;
        }
        else{
            console.log("error");
            similarityChecker(domain);
            foundDomain = false;
        }
    }
    request.send() //Request data via get query
}

function similarityChecker(domain){
    console.log("similaritycheck" + domain);
    let completeUrl = "http://ec2-3-134-253-33.us-east-2.compute.amazonaws.com:1234/?domain=" + domain + "&simCheck=true"; //Create a complete query with the domain function argument
    let request = new XMLHttpRequest(); //Create Request
    console.log("similaritycheck");
    request.open("GET", completeUrl, true); //Open an async https connection for the given constructed URL
    request.onload = function () { //The data loaded and can now be safely utilized
        let response = this.responseText; //Get raw response from the webserver
        console.log("Running similarity check");
        console.log("The response: " + response);
        var simCheck = JSON.parse(response.trim());
        console.log(simCheck);

        if (simCheck.found == true){
            if(confirm("Did you mean to go to: " + simCheck.domain + "?")){
                reDirect(simCheck.domain);
                getRegistrationOf(domain, simCheck.domain, WhoisDataProcessing, handleRequestRejection); //The response for this function call is handled in `WhoIsDataProcessing` 
            } 
            console.log("Found similar domain");

        }
        else if (simCheck.found == false && simCheck.domain == "NULL"){
            console.log("Unknown site");
            if (confirm("This website is unknown to our databases and may be malicious.")) {
                getRegistrationOf(domain, null, WhoisDataProcessing, handleRequestRejection); //The response for this function call is handled in `WhoIsDataProcessing` 
            }
        }else{
            console.log("error");
            getRegistrationOf(domain, null, WhoisDataProcessing, handleRequestRejection); //The response for this function call is handled in `WhoIsDataProcessing` 
        }
    }
    request.send();
}

function reDirect(domain){
    console.log("redirect");
    var sending = browser.runtime.sendMessage({
        data: {call: "reDirectSite", site: domain,}});
    //sending.then(reDirectSite);
    console.log("now here");
}

/*
    Callback function for the whois asychronous execution where the api data (when and if received) is processed
    IMPORTANT: All code that deals with data from the WHOIS API call must start within this function. Otherwise the data will NOT be accurate
*/
function WhoisDataProcessing(domain, compareTo){
    if (domain == compareTo) {
        console.log("MATCH! PHISH-FREE!");
        //NOTE: Do not show the user any information, the extension should not be intrusive when connected to a safe domain
    }  
    else {
        let currentDomain = document.location;
        let warningStr = domain + " has registered " + currentDomain;
        msgUser("Warning", warningStr, false);
    }
}

/**
 * @description Gracefully handle failed API requests. Failed callback for getRegistrationOf(domain)
 * @param {number} status The HTTP GET status string 
 * @param {JSON} jsonData The raw JSON data of the request if it exists.
 */
function handleRequestRejection(status, jsonData) { //Error handler for WHOIS requests
    //The API is down or unreachable
    if (status == 404) { 
        msgUser("API Unreachable", "WHOIS API was unreachable, heuristics are not being performed", true);
        return
    }
    if (jsonData == null || jsonData.toString == "")
        msgUser("Corrupt API Responce", "The registration data for this domain is not available or was corrupted in transit", true);
    else {
        troubleshoot() //Something unknown happened
    }
}
function handleBackgroundScriptMessage(request, sender, sendResponce){
    if (request.data.call = "whois"){
        getRegistrationOf(request.domain, request.compareTo, WhoisDataProcessing, handleRequestRejection, sendResponce);
    } 
 }

/**
 * @description Validate a domain as legitament
 * @param {string} domain The domain which is being connected to
 * @param {string} compareTo The suspected domain owner -> should match the domain argument
 * @returns {boolean} True if the domain matchs the suspected owner
 * 
 * The WHOIS request should be done asynchoniously since it takes time, this means it can not be 
 * blocking the connection. Other validate functions might be fast enough to run while the connection is
 * blocked. Connection blocking should be avoided if possible since it will impact performance.
 * 
 */
function validate(domain, compareTo){
  // Begin processing the domain from the request, if a domain is not found - execute similarity checker
  console.log("validate start");
  queryDB(domain); //STEP 1
  getRegistrationOf(domain, null, WhoisDataProcessing, handleRequestRejection); //The response for this function call is handled in `WhoIsDataProcessing` 
  return false;
}

var mydomain = trimUrl(document.location);
console.log(trimUrl(document.location));
browser.runtime.onMessage.addListener(handleBackgroundScriptMessage);
validate(mydomain);


/*
* NOTE: export for unit testing purposes only

exports.getRegistrationOf = getRegistrationOf;
exports.WhoisDataProcessing = WhoisDataProcessing;
exports.handleRequestRejection = handleRequestRejection;
*/