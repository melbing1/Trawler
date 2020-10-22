//Background.js
//This below call works correctly if it is accessable in the context


//alertUser("Hello", "world", false);
console.log("test");
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

browser.runtime.onMessage.addListener(alertUser);