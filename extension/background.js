//Background.js
//This below call works correctly if it is accessable in the context
//alertUser("Hello", "world", false);
/**
 * @description Handles all messages that are send to background.js. The request object MUST contain a "call" key pair to perform the correct operation with the data
 * @param {object} request The data associated with the sendMessage call
 * @param {object} sender Sender object
 * @param {function} sendResponce Function to send data back to the original sender
 * @returns {boolean} Async?
 */
function handleCrossScriptMessage(request, sender, sendResponce){
/**
 * @description Provide the user with a notification message informing them of an issue. Note that the arguments are what must be in the request object for this "call" case
 * @param {string} title The title of the alert for the user
 * @param {string} msg The message to display to the user
 * @param {boolean} true -> pop-up window with full html, css, and js support. false-> browser notification API that implements a small OS notificaiton
 */
  if (request.data.call == "alertUser"){
    if (request.type){
      var notify = browser.notifications.create(request.data.title, {
          "type": "basic",
          "title": request.data.title,
          "message": request.data.msg
      });
     }
     else {
     let panelInfo = {
         type: "panel",
         url: "troubleshooting.html",
         width: 1000,
         height: 500
         };
     let troubleshootingWindow = browser.windows.create(panelInfo);
     }
     return true;
    }
  //Write to storage.local
  else if (request.data.call === "writeDBLocalStorage"){
    browser.storage.local.set(request.data).then( () => { //Successfully wrote the data
      sendResponce({responce: true}); //Confirm data write success to CS
      return true; //Tells sendResponce to work asynchronously which is what we want
    });
  return true;
  }
  //Read from storage.local
  else if (request.data.call === "readDBLocalStorage") {
    //Data is stored in two lists where domains[n] = owners[n]
    //This is required for the API to work as intended
    var gettingData = browser.storage.local.get(); //Get stored data
    gettingData.then(storedData => { //Stored data has been loaded
      var domainList = storedData.domains; //Get domains from loaded data 
      var ownerList = storedData.owners; //Get owners from loaded data
      var responceObject = {domains: domainList, owners: ownerList} //Create an object with domains and owners for the content script
      sendResponce({responce: responceObject}); //Send list to content script
      return true; //async
    });
    return true;
  } else if (request.data.call === "reDirectSite"){
    //console.log(request.data.site);
    if(request.data.site == -1){
      browser.tabs.goBack();
      //console.log("we made it here");
    } else {
      browser.tabs.update({url: "https://" + request.data.site});
    }
  }
}

browser.runtime.onMessage.addListener(handleCrossScriptMessage);

browser.tabs.onUpdated.addListener(handleUpdated);

function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.url) {
    console.log("Tab: " + tabId +
                " URL changed to " + changeInfo.url);
  }
}