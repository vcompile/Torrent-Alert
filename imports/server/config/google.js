import { Accounts } from 'meteor/accounts-base';

Accounts.loginServiceConfiguration.remove({
  service: 'google',
});

Accounts.loginServiceConfiguration.insert({
  clientId: '731987698101-thavlbcphk9v1kco7l7bl3q70dph819m.apps.googleusercontent.com',
  secret: 'JVs09s23ytqnolXkU-HEvBgU',
  service: 'google',
});
