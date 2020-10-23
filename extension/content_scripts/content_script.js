function msgUser(title, message, popup){
    var sending = browser.runtime.sendMessage({
        call: "alertUser",
        title: title,
        msg: message,
        type: popup
    });
    sending.then(handleResponce, handleError)
}

function handleError(error){
    console.log(error); //Alert not displayed
}

function writeDBLocalStorage(domains, owners){
    var sending = browser.runtime.sendMessage({
        //call: "writeDBLocalStorage",
        //Maybe replace the keys with an array of domains
        data: {call: "writeDBLocalStorage", domains: ["google.com", "apple.com", "hofstra.edu"], owners: ["google", "apple", "hofstra"]},
    });
    sending.then(handleWriteSuccess, handleErrorLocalDB);
}
function readDBLocalStorage(){
    var sending = browser.runtime.sendMessage({
        //call: "writeDBLocalStorage",
        //Maybe replace the keys with an array of domains
        data: {call: "readDBLocalStorage"}
    });
    sending.then(handleReadData, handleErrorLocalDB);
    return true;
}

//Call backs for local storage message
function handleReadData(message){
    console.log("Domains: " + message.responce.domains);
    console.log("Owners: " + message.responce.owners);
    return true;
}
function handleErrorLocalDB(error){
    console.log("Error: " + error);
    return true;
}
function handleWriteSuccess(msg){
    console.log("Wrote: " + msg)
    return true;
}

var exampleData = {"google":"google.com", "apple" :"apple.com"};
//writeDBLocalStorage(exampleData);
readDBLocalStorage();
//DEMO FUNCTIONS
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
function WhoisDataProcessing(registrant, compareTo){
    /*

    */
    //console.log(registrant);
    return registrant == compareTo;
}

/**
 * @description Gracefully handle failed API requests. Failed callback for getRegistrationOf(domain)
 * @param {number} status The HTTP GET status string 
 * @param {JSON} jsonData The raw JSON data of the request if it exists.
 */
function handleRequestRejection(status, jsonData) { //Error handler for WHOIS requests
    //The API is down or unreachable
    if (status == 404) { 
        //alertUser("API Unreachable", "WHOIS API was unreachable, heuristics are not being performed", true);
        console.log("API was unreachable")
        return
    }
    if (jsonData == null || jsonData.toString == "")
        //alertUser("Corrupt API Responce", "The registration data for this domain is not available or was corrupted in transit", true);
        console.log("placeholder");
    



    /*console.log(status.status)
    //PLACEHOLDER ERROR HANDLING
    console.log("Failed to get registration data");
    console.log("Request Status: " + status);
    console.log("Request Response JSON: " + jsonData); */
}

