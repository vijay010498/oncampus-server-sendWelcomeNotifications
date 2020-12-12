"use strict";
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const USER_DB = functions.config().database.userdb;
exports.sendWelcomeNotificatio = 
functions.database.instance(USER_DB).ref('/Users/{userId}')
    .onCreate( async(snapshot, context) => {

        const user = snapshot.val();
        const name = user.name;
        const userId = user.uid;

        console.log('NAME',name);
        console.log('USER ID',userId);

      


        //get user token from token DB
        let app = admin.app();
        var ref = app.database('https://eatitv2-75508-alltokens.firebaseio.com/').ref('Tokens/' +userId+ '/token')
        
        ref.once("value", async function(data) {
            console.log("userToken",data.val()); 
            const userToken = data.val();
            console.log('TOKEN',userToken);
            const payload = {
                notification : {
                    title : 'Welcome onboard ' +name+ '!',
                    body : 'Now Order and get food delivered to your table!'

                }
            };
            try {
                const response = await admin.messaging().sendToDevice(userToken, payload);
                return console.log('Notification sent successfully:', response);
            }
            catch (error) {
                return console.log('Notification sent failed:', error);
            }
          });
         
    });
