//Background.js
//This below call works correctly if it is accessable in the context
//alertUser("Hello", "world", false);

function handleCrossScriptMessage(request, sender, sendResponce){
  //All sendMessage calls should include an object key called "call" which can be used here to call the correct func, sanitized first of course
  if (request.data.call == "alertUser"){
    alertUser(request, sender, sendResponce);
  }
  else if (request.data.call === "writeDBLocalStorage"){
    updateLocalWhiteList(request, sender, sendResponce);
  }
  else if (request.data.call === "readDBLocalStorage") { readLocalWhiteList(request, sender, sendResponce); }
}
/**
 * @description Provide the user with an error message informing them of an issue.
 * @param {string} title The title of the alert for the user
 * @param {string} msg The message to display to the user
 * @param {boolean} true -> pop-up window with full html, css, and js support. false-> browser notification API that implements a small OS notificaiton
 */
function alertUser(request, sender, sendResponce){
    //console.log("alert here");
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
    sendResponce({responce: "success"});
    /*browser.tabs.create({url: "troubleshooting.html"}).then(() => {
        browser.tabs.executeScript({
          code: `console.log('location:', window.location.href);`
        });
      }); */
}

function output(contents){
  //console.log(contents);
  console.log(contents);
}
function readLocalWhiteList(request, sender, sendResponce){
  var gettingData = browser.storage.local.get();  
  gettingData.then(storedData => {
    sendResponce({responce: storedData.data}); //Indicates a successful read
    console.log("hello?");
  });
}
function updateLocalWhiteList(request, sender, sendResponce) {
  browser.storage.local.set(request).then( () => console.log("done"));  
}

browser.runtime.onMessage.addListener(handleCrossScriptMessage);
