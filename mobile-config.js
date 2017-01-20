App.accessRule("*://*.googleusercontent.com/*");

App.appendToConfig(`
  <universal-links>
    <host event="ww8" name="ww8.herokuapp.com" scheme="https" />
  </universal-links>
`);

App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: '731987698101',
});

App.icons({
  android_hdpi: 'public/icons/hdpi.png',
  android_mdpi: 'public/icons/mdpi.png',
  android_xhdpi: 'public/icons/xhdpi.png',
  android_xxhdpi: 'public/icons/xxhdpi.png',
  android_xxxhdpi: 'public/icons/xxhdpi.png',
});

App.info({
  author: "VCompile",
  description: "Torrent Search & Alert",
  email: "linto.cet@gmail.com",
  id: "online.linto.torrentz",
  name: "Torrent Alert",
  website: "https://github.com/HedCET/Torrent-Alert",
  version: "1.0.3",
});

App.setPreference("android-installLocation", "preferExternal");
App.setPreference("android-minSdkVersion", "21");
App.setPreference("AndroidLaunchMode", "singleInstance");
App.setPreference("SplashShowOnlyFirstTime", false);
App.setPreference('StatusBarBackgroundColor', '#009688');
