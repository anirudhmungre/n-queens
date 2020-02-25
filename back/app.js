const Evolution = require('./objects/evolution.js');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 5000;

const socketServer = socket => {
    let connected;
    socket.on('calculate', size => {
        console.log("Starting Genetic Algorithm.");
        let populationSize = Math.floor(Math.pow(1.6, size));
        populationSize = populationSize >= 20 ? populationSize : 20;
        let evolution = new Evolution(populationSize, size);

        connected = setInterval(() => {
            evolution.newEpoch();
            let data = {
                epochId: evolution.getEpoch(),
                population: evolution.getGeneCodes(),
                solutions: evolution.getEpochSolutions()
            };
            evolution.epoch += 1;
            socket.emit('epoch', {
                data: data,
                success: true
            })
        });
    });

    socket.on('disconnect', () => {
        if (connected) {
            clearInterval(connected);
        }
    });

    io.emit('connected', { data: { message: 'You are connected!' }, success: true });
};

io.on('connection', socketServer);
http.listen(port);
console.log(`Listening on port: ${port}`);
