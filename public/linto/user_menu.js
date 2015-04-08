Polymer("user-menu", {
    user_email: "linto.cet@gmail.com",
    user_img: "https://lh4.googleusercontent.com/-oP_FKBNB_S8/AAAAAAAAAAI/AAAAAAAAAhU/bg9hKrkvgLY/photo.jpg",
    user_name: "Linto Cheeran",

    domReady: function() {
        if (Meteor.user()) {
            this.user_email = Meteor.user().profile.email;
            this.user_img = Meteor.user().profile.picture;
            this.user_name = Meteor.user().profile.name;
        }
    }
});
