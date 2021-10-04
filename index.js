
const Gpio = require('pigpio').Gpio;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cv = require('opencv4nodejs');


const { Server } = require("socket.io");
const io = new Server(server);


	app.get('/', (req, res) => {
		res.sendFile(__dirname +"/index.html");
	});

const motor = new Gpio(13, {mode: Gpio.OUTPUT});

let pw = 1000;
motor.servoWrite(pw);


let FPS = 10;

const cap = new cv.VideoCapture(0);
//cap.set(cv.CAP_PROP_FRAME_WIDTH,300);
//cap.set(cv.CAP_PROP_FRAME_HEIGHT,300);
 

setInterval(()=>{
 let frame = cap.read()
 let enImg = cv.imencode('.jpg',frame).toString('base64')
 io.emit("image",enImg)
 
},1000/FPS)





	io.on('connection', (socket) => {
		console.log("Присойденился")
  		socket.on('command', (msg) => {
    		console.log('message: ' + msg);
		
		if (msg == "right" && pw > 600){
			pw = pw - 100
		 	motor.servoWrite(pw);
		}

		if (msg == "left" && pw <= 2200){
			pw = pw + 100
			motor.servoWrite(pw);
		}

		console.log(pw)
		
		
		
	


 	 });
	});



	server.listen(3000, () => {
		console.log('listening on *:3000');
	});
