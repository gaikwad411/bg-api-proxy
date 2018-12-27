const express = require('express')
const app = express()
const port = 3000
var sleep = require('sleep');

app.get('/', (req, res) => {
  sleep.sleep(10);  
  console.log('API called.' + Math.random())
  res.send('Hello World!' + Math.random());
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));