const express = require('express');
const bodyParser = require('body-parser');
const dao = require('./dao');
const cors = require('cors');
const  noble = require('noble');

const messages = [];


const app = new express();
app.use(cors())
var io = require('socket.io')();
io.on('connection', function(client){
  log(`Connection ${client.id}`);
  console.log('CLIENT CONNECt', client.id) // TODO: REMOVE
  // client.emit('move', 'abc')
  client.on('newpgn', (pgn) => {
    console.log('PGN', pgn) // TODO: REMOVE
    dao.updatePgn(pgn)
  });
  client.on('newgame', (playerdata) => {
    dao.startNewGame(playerdata)
  })
});
io.listen(3003);

const log = (msg) =>{
  io.emit('log', msg);
};


app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world')
});

app.get('/history', async(req, res) => {
  const history = await dao.getHistory();
  res.send(history)
});

app.post('/move', (req, res) => {

  const {pos, state} = req.body;
  if(state){
    //Piece landed
  }

  if(!state){
    //Pice taken off
  }
  // console.log('GOT', req.body, new Date().getTime())
  // setTimeout(()=> {
  //   console.log('Sending', req.body, new Date().getTime())
  //   io.emit('move', req.body);
  // }, 500)



  res.send('done')
});


app.listen(3000, () => {
  console.log('App started')
});

// ws.listen(3003, ()=>{
//   console.log('WS listeing on 3003')
// })



const DEVICE_NAME = 'MLT-BT05';
const SERVICE_UUID = 'ffe0';


console.log('scanning...');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  if (peripheral.advertisement.localName === DEVICE_NAME) {
    noble.stopScanning();
    explore(peripheral);
  }
});


function explore(peripheral) {
  console.log('services and characteristics:');

  peripheral.on('disconnect', function() {
    log('BT disconnect, EXITing now')
    process.exit(0);
  });

  peripheral.connect(function(error) {
    console.log("connected...");
    peripheral.discoverServices([], function(err, services) {
      services.forEach(function(service) {
        handleService(service)
      });
    });
  });
}

function handleService(service) {
  console.log('found service:', service.uuid);
  if (service.uuid === SERVICE_UUID) {
    discoverCharacreistics(service);
  }
}

function discoverCharacreistics(service) {
  service.discoverCharacteristics([], function(err, characteristics) {
    characteristics.forEach(function(characteristic){
      handleCharacteristic(characteristic)
    });
  });
}

function handleCharacteristic(characteristic) {
  console.log('found characteristic', characteristic.uuid);
  characteristic.subscribe(function(){
    console.log("subscribed");
    characteristic.on('data', function(data, isNotification){
      console.log("Data is: ");
      console.log(data);
      console.log("Sending data to server: ");
      pushToServer(data, io);
    });
  });
}

function pushToServer(data, io) {
  // Build the post string from an object
  let post_data = JSON.stringify(data);
  post_data = JSON.parse(post_data)["data"];

  let structure = {pos: 0, state: true};
  structure.pos = post_data[0];
  structure.state = post_data[1] === 1;
  console.log('structure in pushToServer: ');
  console.log(JSON.stringify(structure));
  log(`MOVE IN> ${JSON.stringify(structure)}`)
  messages.unshift(structure);

}

setInterval(()=>{
  const item = messages.pop();
  if(item){
    console.log('SENDING MOVE', item, new Date().getTime()) // TODO: REMOVE
    io.emit('move', item);
  }
}, 500);