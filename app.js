const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3000;

app.use(express.static('public'));

data = {};
q = {}
calc = {};
master = {};

io.on('connection',function(socket){
    var id = socket.id;
    io.to(id).emit('master', master);
    io.to(id).emit('message', calc);
    console.log("connect");
    console.log(master);
    console.log(calc);

    socket.on('master',function(msg){
        master = msg;
        io.emit('master', msg);
        data = {};
        q={};

        Object.keys(msg).forEach(function (key) {
            if(msg[key] !== ''){
                q[msg[key]] = 0;
            }
          });
    
    });
    socket.on('message',function(msg){
        var id = socket.id;
        data[id]=msg;
        calc = {};
        Object.assign(calc, q);
        Object.keys(data).forEach(function (key) {
            if(calc[data[key]]){
                calc[data[key]]=calc[data[key]] + 1;
            }else{
                calc[data[key]]=1;
            }
        });
        io.emit('message', calc);
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});
