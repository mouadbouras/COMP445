'use strict';

const net = require('net');
const yargs = require('yargs');
const port = 80;        


//getRquest("eu.httpbin.org" , "/get?mouad=1&steph=2" , true,"Accept-Language:en-US,en;q=0.8",);

module.exports = {
getRquest : function (host,url, verb , header)
{
    const client = net.connect({host: host, port: port});    
    const requests = [];
    
    client.on('data', buf => {
        var tmp = buf.toString().split("\r\n\r\n");
        if(verb)
        {
            console.log(tmp[0] + "\r\n\r\n" + tmp[1]);
        }else{
            console.log(tmp[1] + "\r\n\r\n");            
        }
    });
    
    client.on('connect', () => {
      //console.log(command +" "+ url +" HTTP/1.0\r\n");
      //client.write(command.toUpperCase() +" "+ url +" HTTP/1.0\r\n");
      client.write("GET "+ url +" HTTP/1.0\r\n");     
      if(header != "")
      {
        client.write(header + "\r\n");         
      }
      client.write("Host: " + host + "\r\n\r\n");                 
    });
    
    client.on('error', err => {
      console.log('socket error %j', err);
      process.exit(-1);
    
    });
}
};
    

