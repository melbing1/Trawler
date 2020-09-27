/*
Main Extension JS file. Most of the js extension code will be within this file unless it serves a purpose that requires that it
be placed elsewhere.

main.js
(c) Matthew Elbing, [ADD YOUR NAME HERE], 2020
 */

function validate(domain){
    checkWhiteList(domain); //Check the domain against the whitelist
    checkBlackList(domain); //Check the domain against the blacklist
    let assertedRegistrant = similarityCheck(domain); //Check for similarity too a domain
    suggest(assertedRegistrant); //Suggest the correct spelling for the URL
    getRegistrationOf(domain); //If the user wants to continue, the heuristic check is performed
}


getRegistrationOf("apple.com")

function getRegistrationOf(domain) { //Gets JSON data about a domain from the public record
    let completeUrl = "https://api.ip2whois.com/v1?key=free&domain=" + domain; //Create a complete query with the domain function argument
    let request = new XMLHttpRequest() //Create Request
    request.open("GET", completeUrl, true); //Open an https connection for the given completed URL
    request.onload = function () {
        /*
        Reads the JSON response from the
         */

        let rawJson = JSON.parse(this.responseText);
        let registrant = rawJson.registrant.organization;

        if (registrant === null || registrant === ""){
            handleRequestRejection()
        }
    }
    request.send() //Request data
}

function handleRequestRejection(status, jsonData){ //Error handler for WHOIS requests
    console.log("Failed to get registration data"); //PLACEHOLDER
    console.log("Request Status: " + status);
    console.log("Request Response JSON: " + jsonData);
}

function checkWhiteList(domain){
    return null;
}

function checkBlackList(domain){
    return null;
}

function similarityCheck(domain){
    return ""; //Return most similar domain
}

function suggest(){
    /*
    Create suggestion for correct URL and show the UI to the user
     */
    return null;
}