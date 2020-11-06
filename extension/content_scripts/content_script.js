//PLEASE RESET THE whoIsResponce VALUE TO NULL AFTER  IT IS READ S.T. IT DOES NOT GIVE MISLEADING DATA
//Please compare domains to the `whoIsResponce` var to check validity
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
function WhoisDataProcessing(domain, compareTo){
    if (domain == compareTo) {
        //CONTINUE TO THE WEBSITE SINCE THE DOMAIN AND COMPARETO MATCH
        console.log("MATCH!");
    }  
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

function siteList(domain){
    //Check if domain is found in whitelist
    if(checkWhiteList(domain)){
        console.log("LA");
        return;
    //Check if domain is found in blacklist    
    } else if(checkBlackList(domain)) {
        console.log("LB");
        alert(domain + " is a known phishing site, For your safty we are stopping you from going there.");
    //Check if domain was found in the similarity checker and offer suggestion if it is    
    } else if (similarityCheck(domain) != null){
        console.log("LF");
        alert(domain + " is what you were trying to. \nDid you mean " + similarityCheck(domain) + "?");

        //create suggestion UI here
        //give the user a choice whether to continue to website or not
    } else {
        console.log("LC");
        if (confirm("This website is unknown to our databases and may be malicious. Do you still wish to proceed?")) {
            if (confirm("Would you like to add this website to your trusted websites?")){
                alert(domain + " added to trusted websites.")
            }else{
                alert(domain + " has not been added to trusted websites")
            }
        } else {
            alert("Your connection to " + domain + " has been terminated")
        }
    }
}

// function handleBackgroundScriptMessage(request, sender, sendResponce){
//     if (request.data.call = "whois"){
//         getRegistrationOf(request.domain, request.compareTo, WhoisDataProcessing, handleRequestRejection, sendResponce);
//     } 
// }

function sleepFor(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(ms){
    await sleepFor(ms);
}
console.log(validate("google.com", "google.com")); //TEST 

/**
 * @description Validate a domain as legitament
 * @param {string} domain The domain which is being connected to
 * @param {string} compareTo The suspected domain owner -> should match the domain argument
 * @returns {boolean} True if the domain matchs the suspected owner
 * 
 * Return after each call if it is able to verify the   
 */
function validate(domain, compareTo){
  siteList(domain);
  //TODO: Add all other validation options before WHOIS API call
  //TODO: Test this msg call and ensure that you can get result back to background.js
  getRegistrationOf(domain, WhoisDataProcessing, handleRequestRejection); //The response for this function call is handled in `WhoIsDataProcessing`
  return false;
}

//browser.runtime.onMessage.addListener(handleBackgroundScriptMessage);