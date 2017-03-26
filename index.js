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

app.use(express.static(__dirname));

app.get('/new/https://*', newUrl);
app.get('/new/http://*', newUrl);

app.get('/new/*', (req, res) => {
  res.send({ error: 'urls must begin with http:// or https://' });
});

app.get('/:urlId', (req, res) => {
  // retrieve the real url
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      console.log('database connection error');
    } else {
      // database connected
      const collection = db.collection('urls');

      collection.find({ _id: parseInt(req.params.urlId) }).toArray((err, docs) => {
        if (err) console.log('error finding documents', err);
        else {
          if (docs.length == 0) {
            res.send('no urls found');
          } else {
            res.redirect(docs[0].originalUrl);
          }
          db.close();
        }
      });
    }
  });
}); 

app.listen(app.get('port'), () => {
  console.log('App is running on port ' + app.get('port') + '!');
});

function newUrl(req, res) {
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
          const urlObj = {
            _id: count,
            shortUrl: baseUrl + count,
            originalUrl: req.originalUrl.slice(5),
          };
          collection.insert(urlObj, (err, insertRes) => {
            if (err) console.log('error writing to database', err);
            else {
              console.log('inserted new with id: ' + urlObj._id);
              res.send({ shortUrl: urlObj.shortUrl, originalUrl: urlObj.originalUrl });
            }
            db.close();
          });
        }
      });
    }
  });
}