// _splash = null;

// if (Meteor.isCordova) {
//     _splash = LaunchScreen.hold();

//     document.addEventListener("deviceready", function() {
//         document.addEventListener("backbutton", backbutton, false);
//         document.addEventListener("pause", pause, false);
//     }, false);

//     function backbutton() {
//         for (var A = document.querySelectorAll("paper-dialog"), Z = 0; Z < A.length; Z++) {
//             A[Z].close();
//         }

//         if (document.querySelector("#exit_controller")) {
//             document.querySelector("#exit_controller").time(moment().format("x"));
//         }

//         if (document.querySelector("modal-wrapper")) {
//             document.querySelector("modal-wrapper").active = false;
//         }

//         if (document.querySelector("#add_project")) {
//             document.querySelector("#add_project").active = false;
//         }

//         if (document.querySelector("#drawer")) {
//             document.querySelector("#drawer").closeDrawer();
//         }

//         if (document.querySelector("#search_bar")) {
//             document.querySelector("#search_bar").active = false;
//         }
//     }

//     function pause() {
//         project_save();
//     }
// } else {
//     $(window).on("beforeunload", function() {
//         project_save();
//     });
// }
