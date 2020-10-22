//Background.js
//This below call works correctly if it is accessable in the context


//alertUser("Hello", "world", false);

function handleCrossScriptMessage(request, sender, sendResponce){
  //All sendMessage calls should include an object key called "call" which can be used here to call the correct func, sanitized first of course
  if (request.call == "alertUser"){
    alertUser(request, sender, sendResponce);
  }
  else if (request.call === "writeDBLocalStorage"){
    updateLocalWhiteList(request, sender, sendResponce);
  }
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


function updateLocalWhiteList(request, sender, sendResponce) {
  //var parsDomain = JSON.parse(domain);

  browser.storage.local.set("apple", "apple.com");

  /*
  var listObj = request.data
  var retrievingCurrentData = chrome.storage.local.get();
  retrievingCurrentData.then(results => {
    console.log("BEFORE: " + results.stats);
  });
  chrome.storage.local.set(listObj);
  retrievingCurrentData.then(results => {
    console.log("AFTER: " + results.stats);
  });
  */
  sendResponce("Success"); //Placeholder responce

}

browser.runtime.onMessage.addListener(handleCrossScriptMessage);
