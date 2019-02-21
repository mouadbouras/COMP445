'use strict';

const net   = require('net');
const yargs = require('yargs');
var url = require('url');

//const fs = require('fs'),    
//      path = require('path');   

const argv = yargs.usage('node httpserver.js [--port port]')
    .default('port', 8007)
    .help('help')
    .argv;

const server = net.createServer(handleClient)
    .on('error', err => {throw err; });
    

server.listen({port: argv.port}, () => {
  console.log('Echo server is listening attt %j', server.address());
});

//console.log(readFile());

function handleClient(socket) {
  console.log('New client from %j', socket.address());
  socket
      .on('data', buf => {        
        var request = buf.toString().toLowerCase();   
        buf = null;
        //console.log(socket);
        var read = request.split(' ');
        var method = read[0]; 
        var verbose = read[1]
        var uri = read[2];
        var http = read[3];
        var requestData  = "";
        var response = "";
        
        if(request.indexOf('{') > 0 && (request.indexOf('{') < request.indexOf('}')  ))
        {
            requestData = request.substring(request.indexOf('{') , request.indexOf('}')+1);            
        }
        if(typeof http == 'undefined' || (typeof http != 'undefined' && http.trim() != "http/1.0") )
        {
            response = " \r\n\n" +
                         "HTTP/1.0 400 Bad Request" + "\r\n" +
                         "Date: " + Date()          + "\r\n" +     
                         "Server: Node"             + "\r\n" +
                         "Connection: Closed " + "\r\n";                
            //socket.destroy();            
        }else{
            if(typeof method != 'undefined' && method.trim() == 'get' )    
            {
                var parsedURL = url.parse(uri, true);                
                var  JSONresponse = {
                    data : {
                        "args": parsedURL.query, 
                        "headers": {
                        "Accept": "*.*", 
                        "Connection": "close", 
                        "Host": parseURL.host, 
                        "User-Agent": "httpc 1.0"
                        }, 
                        "origin": socket.localAddress, 
                        "url": uri
                    }
                  }
                  JSONresponse[]

                  response += JSON.stringify(JSONresponse);
  
               
            }
            else if(typeof method != 'undefined' && method.trim() == 'head' )    
            {
                response = "\r\n\n" +
                "HTTP/1.0 200 OK" + "\r\n" +
                "Date: " + Date()          + "\r\n" +     
                "Server: Node"             + "\r\n" +
                "Connection: Closed "+ "\r\n" ; 
                var body= parseURL(uri);
                if (body!= "")
                {
                    response += "Content-length : " + Buffer.byteLength(body)+ "\r\n" ;         
                    response += "Content-Type: text/json " + "\r\n" ;   
                    response += "Connection: Closed "+ "\r\n" ;                     
                }                

            }            
            else if(typeof method != 'undefined' && method.trim() == 'post' )    
            {
                response = "POST method : " + requestData + " to " + requestData;
                //socket.destroy();                
            }            
            else{
                response =  " \r\n\n" +
                            "HTTP/1.0 400 Bad Request" + "\r\n" +
                            "Date: " + Date()          + "\r\n" +     
                            "Server: Node"             + "\r\n" +
                            "Connection: Closed " + "\r\n" ;             
                
                //socket.destroy();                
            }
        }
        
        
        
        socket.write(response);
        
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
        console.log('communication ended %j');        
        socket.destroy();
      });
}

function parseURL(uri){
    
    if(uri.indexOf('?') > 0 )
    {
        var itemsObj ={};        
        var items = uri.slice(uri.indexOf('?')+1).split('&');
        
        for(var i = 0 ; i < items.length ; i++ ){
            //console.log(items[i]);
          var tmp = items[i].split('=');
          itemsObj[tmp[0]] = tmp[1];
        }
        return JSON.stringify(itemsObj);        
    }else
    return "";
    
}

