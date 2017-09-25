'use strict';

const net   = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node httpserver.js [--port port]')
    .default('port', 8007)
    .help('help')
    .argv;

const server = net.createServer(handleClient)
    .on('error', err => {throw err; });

server.listen({port: argv.port}, () => {
  console.log('Echo server is listening at %j', server.address());
});

function handleClient(socket) {
  console.log('New client from %j', socket.address());
  socket
      .on('data', buf => {
        // just echo what received
        var read = buf.toString().toLowerCase().split(' ');
        var method = read[0]; 
        var uri = read[1];
        var http = read[2];   
        if(typeof http != 'undefined' && http.trim() != "http/1.0" )
        {
            socket.write("Invalid HTTP Version");
            //socket.destroy();            
        }else{
            if(typeof method != 'undefined' && method.trim() == 'get' )    
            {
                socket.write("GET method : " + method + " | " + uri  + " | " + http );
                //socket.destroy();                
            }
            if(typeof method != 'undefined' && method.trim() == 'Post' )    
            {
                socket.write("POST method : " + method + " | " + uri  + " | " + http );
                //socket.destroy();                
            }            
            else{
                socket.write("Command not supported yet");      
                //socket.destroy();                
            }
        }


        
        // var method,uri,http;
        // uri = read.toString().split(' ')[1];
        // http = read.toString().split(' ')[2];

        // socket.write("ok");
    })
      .on('error', err => {
        console.log('socket error %j', err);
        socket.destroy();
      })
      .on('end', () => {
        socket.destroy();
      });
}
