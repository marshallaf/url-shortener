const express = require('express');
const app = express();

// set port
app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => {
  res.send('crabs');
});

app.listen(app.get('port'), () => {
  console.log('App is running on port ' + app.get('port') + '!');
});