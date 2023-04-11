const express = require("express"),
      app = express(),
      server = require("http").Server(app),
      port = 3000;
      path = require("path"),
      io = require("socket.io")(server),
      bodyParser = require('body-parser')

  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/welcome", function(req, res) {
    res.render("welcome.ejs"); 
});

app.get("/race", function(req, res) {
    res.render("race.ejs");
});  

app.get("/thanks", function(req, res) {
    res.render("thanks.ejs");
});
 
server.listen(port, () => console.log("Server Running on port: " + port));
 
//user server
// app.use(express.static(__dirname + "/public"));

// //Arduino to CMD
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const usbport = new SerialPort({ path: 'COM5', baudRate: 115200 })

const parser = usbport.pipe(new ReadlineParser(({ delimiter: '\r\n' })))

parser.on('data', function (data) {
    console.log('Data:', Number(data))
    // console.log('Data:', data)
})


io.on('connection', function (socket) {
    const parser = usbport.pipe(new ReadlineParser(({ delimiter: '\r\n' })))
    console.log("A User Connected")
   
    parser.on('data', function (data){
        console.log(`Data read is: ${data}`)
        // if recieved 'S'
        if(data === 'S'){
            // console.log(`Data read is: ${data}`)
            socket.broadcast.emit('Start', {'signal':'s'})
        }
         
        // if recieved 'P'
        if(data === 'L'){ 
            // console.log(`Data read is: ${data}`)
            socket.broadcast.emit('Play', {'signal':'l'})
        }

        // if recieved 'L'
        if(data === 'P'){
            // console.log(`Data read is: ${data}`)
            socket.broadcast.emit('Pause', {'signal':'p'})
        }
    });

   
 
    // send 'f' from '/thanks' route
    socket.on('finish', ()=>{
        usbport.write('f')
    })
  }) 