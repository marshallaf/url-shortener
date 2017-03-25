const express = require('express');
const mongodb = require('mongodb');

// set base url
const baseUrl = 'http://localhost:8080/';

// initialize mongo db
const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/url-shortener'

const app = express();

// set port
app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => {
  // send the splash page
  res.send('there\'s nothing here yet');
});

app.get('/new/:newUrl', (req, res) => {
  // insert url into the db
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      console.log('database connection error');
    } else {
      // database connected
      const collection = db.collection('urls');

      collection.count((err, count) => {
        if (err)
          console.log(err);
        else {
          console.log(count);
          const urlObj = {
            shortUrl: baseUrl + count,
            originalUrl: req.params.newUrl,
          };
          collection.insert(urlObj, (err, insertRes) => {
            if (err) console.log('error writing to database', err);
            else {
              res.send({ shortUrl: urlObj.shortUrl, originalUrl: urlObj.originalUrl });
            }
            db.close();
          });
        }
      });
    }
  });

  // send the shortened url
});

app.get('/:urlId', (req, res) => {
  // retrieve the real url
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      console.log('database connection error');
    } else {
      // database connected
    }
  });

  // redirect the user
}); 

app.listen(app.get('port'), () => {
  console.log('App is running on port ' + app.get('port') + '!');
});