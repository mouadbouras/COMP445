'use strict';

const net   = require('net');
const yargs = require('yargs');
const queryString = require('querystring');
var fs = require('./filesystem.js');
var golbalRequest = {};

function resetRequest (){
    golbalRequest = {};
}

function buildRequest(key,value){
    golbalRequest[key]=value;
}
function addRequestHeader(headerkey , headervalue)
{    
    if (typeof golbalRequest["headers"] == "undefined")
        {
            golbalRequest["headers"]= {};
        }
    golbalRequest["headers"][headerkey]=headervalue;
}
function showRequest(){
    //console.log(golbalRequest);
}

function printError(error){
    return  "\r\n\n" +
    "HTTP/1.0 " + error + "\r\n" +
    "Date: " + Date()          + "\r\n" +     
    "Server: Node"             + "\r\n" +
    "Connection: Closed " + "\r\n";  
}

function print400(id){
    return printError("400 " +id+ " Bad Request");
}

function print404(){
    return printError("404 Not Found");
}

function print200(){
    return  "\r\n\n" +
            "HTTP/1.0 200 OK" + "\r\n" +
            "Date: " + Date()          + "\r\n" +     
            "Server: Node"             + "\r\n" +
            "Connection: Closed "+ "\r\n" ; 
}
    

// const argv = yargs.usage('node httpserver.js [--port port]')
//     .default('port', 8080)
//     .help('help')
//     .argv;

// const server = net.createServer(handleClient)
// .on('error', err => {throw err; });    

// server.listen({port: argv.port}, () => {
//   console.log('Echo server is listening at %j', server.address());
// });

//console.log(readFile());
var globfs = require('fs');
globfs.readFile('../request', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var lower = data;
  data = lower.toLowerCase()
  handleClient(data);
});

function handleClient(request) {
//   console.log('New client from %j', socket.address());
//   socket
//       .on('data', buf => { 
        //socket.pause();
        
        // just echo what received
        //var request = buf.toString().toLowerCase();
        //buf = null;
        //console.log("req-->"+ request.replace('\r' , " BREAK;"));
        var lines = request.trim().split('\r\n');
        //console.log(request.trim());
        //if(lines.length > 1)
        //{
        //    console.log('Invalid input : ' + lines);
            //socket.destroy();
        //}
        for (var line in lines)
        {
            if(lines[line].substr(0,3) == "get"){
                if(typeof golbalRequest["method"] != 'undefined')
                {
                    console.log(print400("5"))
                    resetRequest();showRequest();
                    return;
                    //socket.end();                  
                }
                //console.log("get request");
                var read = lines[line].split(' ');
                var method = read[0]; 
                var uri = read[1];
                var http = read[2];          
                if(typeof http == 'undefined' || (typeof http != 'undefined' && http.trim() != "http/1.0"))
                {
                    console.log(print400("1"))
                    resetRequest();
                    return;
                    
                    //socket.end();
                }

                buildRequest("method" , read[0]);
                buildRequest("uri" , read[1])  
                buildRequest("http" , read[2])  
            }
            else if(lines[line].substr(0,4) == "host"){
                if(typeof golbalRequest["host"] != 'undefined')
                {
                    console.log(print400("2"))
                    resetRequest();return;                    

                    //socket.end();                    
                }
                var host = lines[line].substring(5,lines[line].length).trim();
                buildRequest("host" ,  lines[line].substring(5,lines[line].length).trim())  
            }
            else if(lines[line].substr(0,4) == "post"){
                if(typeof golbalRequest["method"] != 'undefined')
                {
                    console.log(print400("52 - " + lines[line].substr(0,4)))
                    resetRequest();
                    showRequest();
                    return;
                    //socket.end();                  
                }
                //console.log("get request");
                var read = lines[line].split(' ');
                var method = read[0]; 
                var uri = read[1];
                var http = read[2];          
                if(typeof http == 'undefined' || (typeof http != 'undefined' && http.trim() != "http/1.0"))
                {
                    console.log(print400("1"))
                    resetRequest();
                    return;
                    
                    //socket.end();
                }

                buildRequest("method" , read[0]);
                buildRequest("uri" , read[1])  
                buildRequest("http" , read[2])  
            }

            else if(lines[line].substr(0,4) == "from"){
                if(typeof golbalRequest["from"] != 'undefined')
                {
                    console.log(print400("2"))
                    resetRequest();return;                    
                    //socket.end();                    
                }
                var host = lines[line].substring(5,lines[line].length).trim();
                buildRequest("from" ,  lines[line].substring(5,lines[line].length).trim())  
            }            

            else if(lines[line].indexOf(':') > 1 ){
                var headerline = lines[line].split(':')

                addRequestHeader(headerline[0],headerline[1]);
                            
            }
            else{
                if (typeof golbalRequest["body"] == "undefined")
                {
                    golbalRequest["body"] = lines[line];
                }else{
                    golbalRequest["body"] += lines[line];
                    
                }
                
            }
        }

        //GET REQUEST 
        if( typeof golbalRequest["method"]!= "undefined" &&
            typeof golbalRequest["uri"]!= "undefined" &&
            typeof golbalRequest["http"]!= "undefined" &&
            typeof golbalRequest["host"]!= "undefined" &&
                 golbalRequest["method"]== "get")
            {
                var response = "";
                //console.log("GETTING : ");
                showRequest();
                var query = (golbalRequest["uri"].toString().indexOf('?')>=0) ? golbalRequest["uri"].split('?') : [golbalRequest["uri"]] ;
                var queryParams ={};
                if (golbalRequest["uri"].toString().indexOf('?')>=0 && query.length!=2) {response = print400("4");resetRequest();
            }
                else{
                    queryParams = queryString.parse(query[1]);
                }          
                
                if(golbalRequest["http"].trim() != "http/1.0" || golbalRequest["host"]=="" )
                {
                    console.log(print400("3"))                    
                    resetRequest();return;
                    //socket.end();

                }
                //console.log("GETTING1");
                
                response += print200();
                if(typeof golbalRequest["headers"] != "undefined")
                {
                    for(var header in golbalRequest["headers"])
                    {
                        response += header + ":" + golbalRequest["headers"][header] + "\r\n" 
                    }
                }
                var getFile = fs.getFile(query[0]);
                //console.log("GETTING2");
                
                if(getFile == 404)
                {
                    console.log(print404())                                        
                    resetRequest();return;
                    //socket.end();
                }
                else{
                    response += "\n\n" + getFile;                                    
                }
                //console.log("GETTING3");
                
                console.log(response);
                //console.log(response);
                resetRequest();
            }
            showRequest();
            
        //POST REQUEST 
        if( typeof golbalRequest["method"]!= "undefined" &&
        typeof golbalRequest["uri"]!= "undefined" &&
        typeof golbalRequest["http"]!= "undefined" &&
        typeof golbalRequest["from"]!= "undefined" &&
        typeof golbalRequest["body"]!= "undefined" &&        
             golbalRequest["method"]== "post")
        {
            
            var response = "";

            showRequest();
            var query = (golbalRequest["uri"].toString().indexOf('?')>=0) ? golbalRequest["uri"].split('?') : [golbalRequest["uri"]];
            var queryParams ={};
            if (golbalRequest["uri"].toString().indexOf('?')>=0 && query.length!=2) {response = print400("4");resetRequest();
        }
            else{
                queryParams = queryString.parse(query[1]);
            }          
            
            if(golbalRequest["http"].trim() != "http/1.0" || golbalRequest["from"]=="" || golbalRequest["from"]=="" )
            {
                console.log(print400())                                                        
                resetRequest();return;
                //socket.end();
            }
            
            response += print200();
            if(typeof golbalRequest["headers"] != "undefined")
            {
                for(var header in golbalRequest["headers"])
                {
                    response += header + ":" + golbalRequest["headers"][header] + "\r\n" 
                }
            }

             fs.postFile(query[0],golbalRequest["body"]);
            // var getFile = fs.getFile(query[0]);
            // if(getFile == 404)
            // {
            //     response = print404();
            //     resetRequest();return;
            //     //socket.end();
            // }
            // else{
            //     response += "\n\n" + getFile;                                    
            // }
            console.log(response);
            //console.log("response " + response);
            resetRequest();
        }            

        // //console.log(socket);
        // var lines = request.split('\r\n');
        // var read = lines[0].split(' ');
        // var method = read[0]; 
        // var uri = read[1];
        // var http = read[2];
        // var requestData  = "";
        // var host = "";
        // var headers = {};
        // var headerCount=0;
        // console.log(typeof(uri));
        // console.log(uri)
     
        // for(var line in lines)
        // {
        //     if(line==0)continue;
        //     //console.log("--"  + lines);
        //     if(lines[line].trim().substring(0,5) == "host:" )
        //     {
        //         host = lines[line].substring(5,lines[line].length).trim();
        //     }
        //     else if (lines[line].trim() != "" ){
        //         headers[headerCount] = lines[line];
        //         headerCount++;
        //     }
        // }
       
        // console.log(queryParams);
        

    

//        else{
        //     if(typeof method != 'undefined' && method.trim() == 'get' )    
        //     {
                                  
        //           

        //         //   var filePath = path.join(__dirname, 'sample1.html');    
        //         //   var file = ""; 
        //         //   fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        //         //   if (!err) {
        //         //     socket.write(response + "\r\n" + data);
        //         //   } else {
        //         //       file = "<html><body>404 Not Found</body></html>";
        //         //   }
        //         //   });
        //           //"Content-Length: " + Buffer.byteLength(data, ['utf-8']) + "\r\n\n" +          
        //           //data ;                                    

        //         //response += uri.slice(uri.indexOf('/')+1).replace('/','\\');
        //         // var body= parseURL(uri);
        //         // if (body!= "")
        //         // {
        //         //     response += "Content-length : " + Buffer.byteLength(body)+ "\r\n" ;         
        //         //     response += "Content-Type: text/json " + "\r\n" ;   
        //         //     response += "Connection: Closed "+ "\r\n" ;                     
        //         //     response += "Values : " + body; 
        //         // } 
  
        //         // if(uri.indexOf('?') > 0 )
        //         // {
        //         //     var items = uri.slice(uri.indexOf('?')+1).split('&');
        //         //     var itemsObj ={};
                    
        //         //     for(var i = 0 ; i < items.length ; i++ ){
        //         //         //console.log(items[i]);
        //         //       var tmp = items[i].split('=');
        //         //       itemsObj[tmp[0]] = tmp[1];
        //         //     }
        //         //     response += "Content-length : " + Buffer.byteLength(JSON.stringify(itemsObj))+ "\r\n" ;         
        //         //     response += "Content-Type: text/json " + "\r\n" ;   
        //         //     response += "Connection: Closed "+ "\r\n" ;                     
        //         //     response += "Values : " + JSON.stringify(itemsObj);                    
        //         // }
        //         //response += "Connection: Closed "; 
                
        //         //socket.destroy();                
        //     }
        //     else if(typeof method != 'undefined' && method.trim() == 'head' )    
        //     {
        //         response = "\r\n\n" +
        //         "HTTP/1.0 200 OK" + "\r\n" +
        //         "Date: " + Date()          + "\r\n" +     
        //         "Server: Node"             + "\r\n" +
        //         "Connection: Closed "+ "\r\n" ; 
        //         var body= parseURL(uri);
        //         if (body!= "")
        //         {
        //             response += "Content-length : " + Buffer.byteLength(body)+ "\r\n" ;         
        //             response += "Content-Type: text/json " + "\r\n" ;   
        //             response += "Connection: Closed "+ "\r\n" ;                     
        //         }                

        //     }            
        //     else if(typeof method != 'undefined' && method.trim() == 'post' )    
        //     {
        //         response = "POST method : " + requestData + " to " + requestData;
        //         //socket.destroy();                
        //     }            
        //     else{
        //         response =  " \r\n\n" +
        //                     "HTTP/1.0 400 Bad Request" + "\r\n" +
        //                     "Date: " + Date()          + "\r\n" +     
        //                     "Server: Node"             + "\r\n" +
        //                     "Connection: Closed " + "\r\n" ;             
                
                //socket.destroy();                
            //}
        //}
        
        
        //response += "read:" + read + " method:" + method + " uri:"+ uri + " http:"+ http
        
        //socket.write(response);
        //console.log(response);
        // var method,uri,http;
        // uri = read.toString().split(' ')[1];
        // http = read.toString().split(' ')[2];
        //socket.resume();
    // })
    //   .on('error', err => {
    //     console.log('socket error %j', err);
    //     socket.destroy();
    //   })
    //   .on('end', () => {
    //     console.log('communication ended %j');        
    //     socket.destroy();
    //   });
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

