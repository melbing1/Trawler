//Background.js
//This below call works correctly if it is accessable in the context
//alertUser("Hello", "world", false);

function handleCrossScriptMessage(request, sender, sendResponce){
  //All sendMessage calls should include an object key called "call" which can be used here to call the correct func, sanitized first of course
  //console.log("background script received message");
  //sendResponce({responce: "This is the answer"});
  
  if (request.data.call == "alertUser"){
    if (request.type){
      var notify = browser.notifications.create("Hello World", {
          "type": "basic",
          "title": request.title,
          "message": request.msg
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
     /* browser.tabs.create({url: "troubleshooting.html"}).then(() => {
         browser.tabs.executeScript({
           code: `console.log('location:', window.location.href);`
         });
       }); */
    return true;
  }
  else if (request.data.call === "writeDBLocalStorage"){
    browser.storage.local.set(request.data).then( () => { //Successfully wrote the data
      sendResponce({responce: true}); //Confirm data write success to CS
      return true; //Tells sendResponce to work asynchronously which is what we want
    });
  return true;
  }
  else if (request.data.call === "readDBLocalStorage") {
    //Data is stored in two lists where domains[n] = owners[n]
    //This is required for the API to work as intended
    var gettingData = browser.storage.local.get(); //Get stored data
    gettingData.then(storedData => { //Stored data has been loaded
      var domainList = storedData.data.domains; //Get domains from loaded data 
      var ownerList = storedData.data.owners; //Get owners from loaded data
      var responceObject = {domains: domainList, owners: ownerList} //Create an object with domains and owners for the content script
      sendResponce({responce: responceObject}); //Send list to content script
      return true; //async
    });
    return true;
  }

}
/**
 * @description Provide the user with an error message informing them of an issue.
 * @param {string} title The title of the alert for the user
 * @param {string} msg The message to display to the user
 * @param {boolean} true -> pop-up window with full html, css, and js support. false-> browser notification API that implements a small OS notificaiton
 */
function alertUser(request, sender, sendResponce){
    
}

function output(contents){
  //console.log(contents);
  console.log(contents);
}
function readLocalWhiteList(request, sender, sendResponce){
  

  //var responding = browser.runtime.sendMessage({responce: storedData.data}).then(handle)
}

browser.runtime.onMessage.addListener(handleCrossScriptMessage);
