#!/usr/bin/env node
'use strict';

/** Http Server comunication Section */
// const net = require('net');
// const yargs = require('yargs');

// const argv = yargs.usage('node echoclient.js [--host host] [--port port]')
//     .default('host', 'localhost')
//     .default('port', 8007)
//     .help('help')
//     .argv;
   
/**
* Module dependencies.
*/
const urlParser = require('url');
var client = require('./newclient');

const program = require('commander');
program
.version('0.0.1'); 

program.command('get <req>')
.description('Get executes a HTTP GET request for a given URL.')
.option('-v, --verb','Prints the detail of the response such as protocol, status, and headers.')
.option('-h, --header <keyvalue>','Associates headers to HTTP Request with the format \'key:value\'')
.action(function(req,optional){
    var url = urlParser.parse(req); 
    var vrb = (optional.verb==true);
    var header = (optional.header) ? optional.header : "" ;
    var qs = (url.search != null) ? url.search : "";
    
    if(url.host != null && url.pathname != null)
    {
        //console.log('1' + url.pathname+url.search );        
        client.getRquest(url.host , url.pathname+qs , vrb,header);
    }
    else{
        //console.log('2');
        client.getRquest(url.pathname , "/" , vrb,header);    
        //console.log("Invalid URL");
    }

    //client.getRquest(url.host , url.pathname+url.search , vrb,header);

    // if(optional.verb)
    // {
    //     console.log(optional.verb);
    // }
    // if(optional.hora)
    // {
    //     console.log(optional.header);
    // }    

    //executeCommand(req);
});

program.command('post <req>')
.description('Post executes a HTTP POST request for a given URL with inline data or from file.')
.option('-v, --verb','Prints the detail of the response such as protocol, status, and headers.')
.option('-l, --list <items>', 'A list', list)
.option('-h, --header <keyvalue>','Associates headers to HTTP Request with the format \'key:value\'', list)
.option('-d, --data <req>','Associates an inline data to the body HTTP POST request.')
.option('-f, --file <req>','Associates the content of a file to the body HTTP POST request.')
.action(function(req,optional){
  console.log('.action() allows us to implement the command');
  console.log('Post %s', req);

  if(optional.header){
    console.log(' list: %j', optional.header);    
    //console.log('header: ');
    //console.log( optional.header[0] );
    
  }
  

});

program.command('help [optional]')
.description('Post executes a HTTP POST request for a given URL with inline data or from file.')
.option('-v','Prints the detail of the response such as protocol, status, and headers.')
.option('-h <req>:<req>','Associates headers to HTTP Request with the format \'key:value\'.')
.option('-d <req>','Associates an inline data to the body HTTP POST request.')
.option('-f <req>','Associates the content of a file to the body HTTP POST request.')
.action(function(optional){
    if(optional){
        if (optional.toLowerCase() == "get") {
            console.log('usage: httpc get [-v] [-h key:value] URL\n\n' + 
                        'Get executes a HTTP GET request for a given URL.\n\n' + 
                        '   -v Prints the detail of the response such as protocol, status, and headers.\n' + 
                        '   -h key:value Associates headers to HTTP Request with the format \'key:value\'.\n'
                    ); 
        }
        else if (optional.toLowerCase() == "post") {
            console.log('usage: httpc post [-v] [-h key:value] [-d inline-data] [-f file] URL\n\n' + 
            'Get executes a HTTP GET request for a given URL.\n\n' + 
            '   -v Prints the detail of the response such as protocol, status, and headers.\n' + 
            '   -h key:value Associates headers to HTTP Request with the format \'key:value\'.\n'
        ); 
        }
        else{
            console.log('Unknown command.' ); 
        }
    }
    else{
        console.log('\n\nhttpc is a curl-like application but supports HTTP protocol only.\n' + 
        'Usage:\n' + 
        '   httpc command [arguments]\n'+
        'The commands are: \n' +
        '   get executes a HTTP GET request and prints the response.\n'+
        '   post executes a HTTP POST request and prints the response.\n'+
        '   help prints this screen.\n\n'+
        'Use "httpc help [command]" for more information about a command.');
    }
});

// program.on('--help', function(){
//     console.log('  Examples:');
//     console.log('');
//     console.log('    $ custom-help --help');
//     console.log('    $ custom-help -h');
//     console.log('');
//   });

program.parse(process.argv); 




function list(val) {
    return val.split(',');
  }




//client.getRquest("eu.httpbin.org" , "/get?mouad=1&steph=2" , true,"Accept-Language:en-US,en;q=0.8",);








// function executeCommand(data) {
//     const client = net.createConnection({host: argv.host, port: argv.port});
//     const requests = [];
        
//     client.on('connect', () =>{
//         const chunk =  Buffer.from(data.toString(),'utf8');
//         if (chunk != null) {
//             requests.push({
//             sendLength: chunk.byteLength,
//             response: new Buffer(0)
//             });
//             client.write(chunk);
//         }
//     });

//    client.on('data', buf => {
//         if (requests.length == 0) {
//             client.end();
//             process.exit(-1);
//         }

//         const r = requests[0];
//         r.response = Buffer.concat([r.response, buf]);

//         if(r.response.byteLength >= r.sendLength){
//             requests.shift();
//             console.log("Replied: " + r.response.toString("utf-8"))
//             client.end();
//         }
//     });

//     client.on('error', err => {
//         console.log('socket error %j', err);
//         client.end();
//         process.exit(-1);
//     });   
// }

// notice that we have to parse in a new statement.

//.command('get', 'get http').alias('g')
//.command('get [getData]', 'get http').alias('g')
//.command('post', 'post http').alias('p')

// httpc is a curl-like application but supports HTTP protocol only.' + 
// 'Usage:\n' + 
// 'httpc command [arguments]'+
// 'The commands are: ' +
// 'get executes a HTTP GET request and prints the response.'+
// 'post executes a HTTP POST request and prints the response.'+
// 'help prints this screen.'+
// 'Use "httpc help [command]" for more information about a command.
// .option('-v','Prints the detail of the response such as protocol, status, and headers.')
// .option('-h <key>:<value>','Associates headers to HTTP Request with the format "key:value".')
// .option('-d','Associates an inline data to the body HTTP POST request.')
// .option('-f','Associates the content of a file to the body HTTP POST request.')