Template.controller_linto.helpers({
    inbox_view: Session.get("inbox_view"),
    resetPasswordToken: ((Session.get("resetPasswordToken") && (Session.get("resetPasswordToken") != "_")) ? true : false)
});
