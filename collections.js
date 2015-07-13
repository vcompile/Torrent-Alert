specialAccess = function(userId, doc) {
    return userId == "HedCET";
};

torrent_in = new Meteor.Collection("torrent_in");
torrent_out = new Meteor.Collection("torrent_out");
torrent_push = new Meteor.Collection("torrent_push");
torrent_worker = new Meteor.Collection("torrent_worker");

torrent_worker.allow({
    insert: specialAccess,
    remove: specialAccess,
    update: specialAccess
});
