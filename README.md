# Spotify favorite genre
Script for [IFTTT](https://ifttt.com/) Maker channel to save your favorite songs genres from spotify using [WebTask](https://webtask.io/), [Mongolab](https://mlab.com/) and [Last.fm API](http://www.last.fm/api)

#Setup

### Webtask

First you'll need to replace `apiKey` on `spotify-favorite-genre.js` with you last.fm api key.

Install webtask cli:
```
$ npm i -g wt-cli
$ wt init
```

Deploy both files on Webtask adding your mongo lab url:
```
$ wt create --secret MONGO_URL=<YOUR_MONGO_LAB_URL> spotify-favorite-genres-view.js
$ wt create --secret MONGO_URL=<YOUR_MONGO_LAB_URL> spotify-favorite-genres.js
```

Web task will return both url's: one for viewing the resuls and one for hooking on IFTTT.

### IFTTT

Create a new recipe with Spotify channel and select `New Saved Track` recipe.

Select Maker channel for `then` and paste the url given by webtask.io plus the parameters:
`&artist={{ArtistName}}&title={{TrackName}}`

Done. When adding a track to your music on spotify the script will check the track genre and incretment the counter. Just open the view url given by webtask on your browse to check the results!
