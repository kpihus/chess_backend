const express = require('express');
const bodyParser = require('body-parser');

const app = new express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world')
});

app.post('/move', (req, res) => {
  const {pos, state} = req.body;
  {pos: 16, state: false}
  if(state){
    //Piece landed
  }

  if(!state){
    //Pice taken off

  }
  console.log(req.body)
  res.send('done')
});


app.listen(3000, () => {
  console.log('App started')
});