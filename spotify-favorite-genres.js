var request = require('request');
var MongoClient = require('mongodb').MongoClient;

function saveGenre(genre, url, callback) {
  var doc = {
    genre: genre
  };

  var increment = {
    $inc: {
      count: 1
    }
  };

  var options = {
    upsert: true
  };

  MongoClient.connect(url, function (error, database) {
    if(error) return callback(error);

    database
      .collection('genres')
      .updateOne(doc, increment, options, function (error) {
        if(error) return callback(error);

        callback(null);
      });
  });
}

function requestGenre(title, artist, callback) {
  var apiKey = 'YOUR LAST.FM API KEY';
  var baseUrl = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&format=json&';
  var url = baseUrl + 'api_key=' + apiKey + '&artist=' + artist + '&track=' + title;

  request(url, function(error, response, body) {
    if(error) callback(error, null);

    var json = JSON.parse(body);
    var genre = json.track.toptags.tag[0].name;
    callback(null, genre);
  });
}

module.exports = function (context, done) {
  var title = context.data.title;
  var artist = context.data.artist;
  var mongoUrl = context.data.MONGO_URL;

  requestGenre(title, artist, (error, genre) => {
    if(error) return done(error);

    saveGenre(genre, mongoUrl, function(error) {
      if(error) return done(error);

      var successMessage = 'Updated genre ' + genre + ' for ' + artist + ', ' + title;
      console.log(successMessage);
      done(null, successMessage);
    });
  });
}
