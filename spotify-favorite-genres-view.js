"use latest";

var { MongoClient } = require('mongodb');
var handlebars      = require('handlebars');

var View = `
<html>
  <head>
    <title>Favorite genres</title>
  </head>
  <body>
    {{#if genres.length}}
        Favorite genres:
      <ul>
        {{#each genres}}
          <li>{{genre}}: {{count}}</li>
        {{/each}}
      </ul>
    {{else}}
      <h1>No genres found. Go listen to some music!(</h1>
    {{/if}}
  </body>
</html>
`;

function getGenres(mongoUrl, callback) {
  MongoClient.connect(mongoUrl, (error, database) => {
    if(error) callback(error, null);

    database
      .collection('genres')
      .find()
      .toArray( (error, genres) => {
        if(error) callback(error, null);

        callback(null, genres);
      });
  });
}

function buildView(genres) {
  const view_ctx = {
    genres: genres.sort( (genre1, genre2) => {
      return genre2.count - genre1.count;
    })
  };

  const template = handlebars.compile(View);
  return template(view_ctx);
}

return (context, request, response) => {
  getGenres(context.data.MONGO_URL, (error, genres) => {
    if(error) return response.end(error);

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(buildView(genres));
  });
};
