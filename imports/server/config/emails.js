import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.enrollAccount = {
  subject() {
    return "enrollAccount URL";
  },
  text(user, url) {
    return `Hi,

    Please open this URL in Google Chrome browser to enrollAccount & set password

    ${url}

    ThankYou`;
  },
};
Accounts.emailTemplates.from = "request<request@vcompile.com>";
Accounts.emailTemplates.resetPassword = {
  subject() {
    return "reset password URL";
  },
  text(user, url) {
    return `Hi,

    Please open this URL in Google Chrome browser to reset your password

    ${url}

    ThankYou`;
  },
};
Accounts.emailTemplates.siteName = "Torrent Alert";
Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "VERIFY registered mailId";
  },
  text(user, url) {
    return `Hi,

    Please open this URL in Google Chrome browser to VERIFY your mailId

    ${url}

    ThankYou`;
  },
};
