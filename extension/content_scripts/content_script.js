//PLEASE RESET THE whoIsResponce VALUE TO NULL AFTER  IT IS READ S.T. IT DOES NOT GIVE MISLEADING DATA
whoIsResponce = null; //Boolean value after getRegistrantOf() is called; true if the registerant and the compareTo are equal, else otherwise


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
    msgUser("Error", "An error has occurred, please click the Trawler extension icon to learn more", false);
    //var sending = browser.runtime.sendMessage({data: {call: "troubleshoot"}});
    //sending.then(handleResponce, handleError);
}

/**
 * @description Called when data is read successfully by readDBLocalStorage
 * @param {boolean} msg Did the write succeed?
 * @returns {boolean} Processing Success?
 */
function handleWriteSuccess(msg){
    console.log("Wrote: " + msg)
    return true;
}
function handleError(error){
    console.log(error);
}


//DEMO FUNCTIONS STORAGE
var exampleDomList = ["google.com", "apple.com", "hofstra.edu"];
var exampleOwnerList = ["google", "apple", "hofstra"];

//writeDBLocalStorage(exampleDomList, exampleOwnerList);
//readDBLocalStorage();

//DEMO FUNCTIONS ALERTS
//msgUser("Hello World", "This is the message", true); //Example
//msgUser("Notification from Firefox", "This is the message from firefox", false); //Example

//NOTE: This is currently a work in progress, comment out for the demo and show the comminication and webpages instead
/*function getRegistrationOfDomain(request, sender, sendResponce) {
    getRegistrationOf(domain, compareTo, 
        success(domainStr, compareToStr) => { //Why is this still broken??
            if (domainStr == compareToStr){ sendResponce({responce: "success"}); }},
        failure(status, rawData) => { 
            sendResponce({responce: "failure"});
            handleRequestRejection();
        }
    );
    sendResponce({responce: "success"}); //TODO: return correct code
} */
//browser.runtime.onMessage.addListener(getRegistrationOfDomain);

/** 
 * @description Using the whois API at ip2whois.com the public record of the domain registrant is retrieved via an asynchronous get request.
 * @param {string} domain The domain in standardardized format which is to be used to build a WHOIS API query.
 * @param {string} compareTo The suspected domain registrant
 * @param {function} successCallback Called on async success
 * @param {function} FailureCallback Called on aysnc failure
 */
function getRegistrationOf(domain, compareTo, success, failure, sendResponce) { //Gets JSON data about a domain from the public record
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


/*
    Callback function for the whois asychronous execution where the api data (when and if received) is processed
    IMPORTANT: All code that deals with data from the WHOIS API call must start within this function. Otherwise the data will NOT be accurate
*/
//TODO: Set boolean in this script to global var to be used in this script
function WhoisDataProcessing(registrant, compareTo, sendResponce){
    localWhoIsResponce = registrant == compareTo;
    whoIsResponce = localWhoIsResponce
    sendResponce({data: localWhoIsResponce});
    return registrant == compareTo;
}

/**
 * @description Gracefully handle failed API requests. Failed callback for getRegistrationOf(domain)
 * @param {number} status The HTTP GET status string 
 * @param {JSON} jsonData The raw JSON data of the request if it exists.
 */
function handleRequestRejection(status, jsonData, sendResponce) { //Error handler for WHOIS requests
    //The API is down or unreachable
    if (status == 404) { 
        //alertUser("API Unreachable", "WHOIS API was unreachable, heuristics are not being performed", true);
        console.log("API was unreachable")
        sendResponce({data: "unreachable"});
        return
    }
    if (jsonData == null || jsonData.toString == "")
        //alertUser("Corrupt API Responce", "The registration data for this domain is not available or was corrupted in transit", true);
        console.log("placeholder");
        sendResponce({data: "no json data received"});
}

function handleBackgroundScriptMessage(request, sender, sendResponce){
    if (request.data.call = "whois"){
        console.log("Got the message");
        getRegistrationOf(request.domain, request.compareTo, WhoisDataProcessing, handleRequestRejection, sendResponce);
    }
}

validate("google.com"); //TEST 
function validate(domain){
  //TODO: Add all other validation options before WHOIS API call

  //TODO: Test this msg call and ensure that you can get result back to background.js
  var sending = browser.runtime.sendMessage({ data: {call: "whois", domain: domain}}); //Calls WHOIS API in the content_scipt
  sending.then(apiSucess, apiError);
  return true;
}

function apiSucess(msg){
  console.log(msg);
  return msg;
}
function apiError(err){
  console.log(err);
  return err;
}

browser.runtime.onMessage.addListener(handleBackgroundScriptMessage);