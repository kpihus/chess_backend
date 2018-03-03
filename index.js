const express = require('express');

const app = new express();


app.get('/', (req, res) => {
  res.send('hello world')
});


app.listen(3000, () => {
  console.log('App started')
})