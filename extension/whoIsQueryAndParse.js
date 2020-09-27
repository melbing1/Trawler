/* Places a query to the whois API and parse the domain owner" */

const url = "https://api.ip2whois.com/v1?key=free&domain="; //Generic API Query String

browser.notification.create("Hello World", {
	"type": "basic",
	"title": "testing",
	"message": "hello world"
});

function getRegistrationOf(domain) { //Gets JSON data about a domain from the public record
	var completeUrl = url + domain; //Create a complete query with the domain function argument
	request.open("GET", completeUrl, true); //Open an https connection for the given completed URL
	request.onload = function () {
		//Save API provided data in this function
	}
	request.send() //REquest data
}
