'use strict';

const net = require('net');
const yargs = require('yargs');
const port = 8080;        

module.exports = {
getRequest : function (host,url, verb , header)
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
        client.write("GET "+ url +" HTTP/1.0\r\n");   
        //console.log("CLIENT : --> GET "+ url +" HTTP/1.0");
        
        if(header)
        {
            for(var line in header){
                client.write(header[line]+ "\r\n");   
                //console.log("CLIENT : --> "+header[line]+ ""); 
                
            }
        }
        client.write("Host: " + host + "\r\n\r\n");        
        //console.log("CLIENT : --> Host: " + host + "");     
        
    });
    
    client.on('error', err => {
      console.log('socket error %j', err);
      process.exit(-1);
    
    });
},
postRequest : function (host,url, verb , header, content)
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
        client.write("POST "+ url +" HTTP/1.0\r\n");
        client.write("From: " + host + "\r\n");        
      
        if(header)
        {
            for(var line in header){
                client.write(header[line]+ "\r\n");         
            }
        }              
        if(content != ""){
            client.write("Content-Length : " + Buffer.byteLength(content)+ "\r\n\r\n");        
            client.write(content+"\r\n");
        }         
      
        client.write("\r\n");  
    });
    
    client.on('error', err => {
      console.log('socket error %j', err);
      process.exit(-1);
    
    });
}
};
    

