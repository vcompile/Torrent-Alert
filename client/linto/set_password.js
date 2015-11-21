// Template.set_password.events({

//     "click #set-password-submit": function(e) {
//         var password = $("#password").val();

//         if (6 <= password.length) {
//             if (password == $("#retype-password").val()) {
//                 document.querySelector("#load_awesome").toggle();

//                 Accounts.resetPassword(Session.get("password_token"), password, function(error) {
//                     document.querySelector("#load_awesome").toggle();

//                     if (error) {
//                         document.querySelector("#polymer_toast").toast(error.reason);
//                     } else {
//                         if (_done && (typeof _done == "function")) {
//                             _done();
//                         }

//                         Session.set("password_token", "");
//                     }
//                 });
//             } else {
//                 document.querySelector("#polymer_toast").toast("retype password mismatch");
//             }
//         } else {
//             document.querySelector("#polymer_toast").toast("min password length is 6");
//         }
//     },

//     "click .back": function(e) {
//         Session.set("route", "user_check");
//     }

// });
