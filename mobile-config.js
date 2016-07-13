// App.accessRule("*://*.googleusercontent.com/*");

App.icons({
  "android_ldpi": ".build/drawable-ldpi/ic_launcher.png",
  "android_mdpi": ".build/drawable-mdpi/ic_launcher.png",
  "android_hdpi": ".build/drawable-hdpi/ic_launcher.png",
  "android_xhdpi": ".build/drawable-xhdpi/ic_launcher.png",
});

App.info({
  id: "torrentz.scheduler",
  name: "Torrent Alert",
  description: "Torrent Keyword Search, Schedule & Alerter",
  version: "1.0.0",
  author: "Linto Cheeran",
  email: "linto.cet@gmail.com",
  website: "http://vcompile.com/scheduler",
});

// App.launchScreens({
//     "android_ldpi_portrait": ".build/splash/splash-200x320.png",
//     "android_ldpi_landscape": ".build/splash/splash-320x200.png",
//     "android_mdpi_portrait": ".build/splash/splash-320x480.png",
//     "android_mdpi_landscape": ".build/splash/splash-480x320.png",
//     "android_hdpi_portrait": ".build/splash/splash-480x800.png",
//     "android_hdpi_landscape": ".build/splash/splash-800x480.png",
//     "android_xhdpi_portrait": ".build/splash/splash-720x1280.png",
//     "android_xhdpi_landscape": ".build/splash/splash-1280x720.png",
// });

App.setPreference("android-installLocation", "preferExternal");
App.setPreference("android-minSdkVersion", "21");
// App.setPreference("SplashMaintainAspectRatio", true);
App.setPreference("SplashShowOnlyFirstTime", false);
