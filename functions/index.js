const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const firebase = require('firebase');
firebase.initializeApp(functions.config().firebase);

const App = require('actions-on-google').ApiAiApp;
exports.starsEarth = functions.https.onRequest((request, response) => {
    const  app = new App({ request, response });

    function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
    }

    function isEmpty(obj) {
        return obj == "";
    }

    function getSignLanguage (app) {
        var item = app.getArgument("islSign")
        var type = app.getArgument("signLanguageType");
        if (!isDefined(type) || isEmpty(type)) {
              type = "ISL";
            }   
        item = item.toUpperCase();      
        var ref = firebase.database().ref("SignLanguage").orderByChild("item").equalTo(item);
            ref.once('value', function(snapshot) {
             var matchFound = false;   
             snapshot.forEach(function(childSnapshot) {       
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.type == type) {
                    //app.tell(childData.description)
                    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                        app.ask(app.buildRichResponse()
                        .addSimpleResponse(childData.description)
                        .addBasicCard(app.buildBasicCard(childData.description)
                        .setImage("https://firebasestorage.googleapis.com/v0/b/starsearth-59af6.appspot.com/o/images%2F"+item+"_"+type+".png?alt=media&token=e914aa03-caa2-4bba-9084-9ab8a330f6de", "image if "+item+" "+type)));
                    }
                    else {
                        app.ask(childData.description)
                    }
                    
                    matchFound = true;
                }   
                matchFound = true;
              });   
              if (!matchFound) {
                app.tell("Sorry, we do not have the "+type+" for this")
              } 
            });  
    }

    const actionMap = new Map()
    actionMap.set("getSignLanguage", getSignLanguage);
    app.handleRequest(actionMap)
})

