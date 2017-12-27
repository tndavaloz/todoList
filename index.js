const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server/server');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());;
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', server);

app.listen(port, () => {
  console.log(`Starting on port ${port}`);
});

module.exports = {app};
