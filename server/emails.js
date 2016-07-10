Accounts.emailTemplates.siteName = "Torrent Alert";
Accounts.emailTemplates.from = "TA<request@vcompile.com>";

Accounts.emailTemplates.enrollAccount = {
  subject: function() {
    return "enrollAccount URL";
  },
  text: function(user, url) {
    return "Hi\n\tPlease open the URL below in browser to enroll password\n\t" + url + "\n\tThankYou";
  },
};

Accounts.emailTemplates.resetPassword = {
  subject: function() {
    return "reset password URL";
  },
  text: function(user, url) {
    return "Hi\n\tPlease open the URL below in browser to reset your password\n\t" + url + "\n\tThankYou";
  },
};

Accounts.emailTemplates.verifyEmail = {
  subject: function() {
    return "VERIFY registered mailId";
  },
  text: function(user, url) {
    return "Hi\n\tPlease open the URL below in browser to VERIFY your mailId\n\t" + url + "\n\tThankYou";
  },
};
