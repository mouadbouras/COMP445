const urlParser = require('url');
var client = require('./newclient');
var fs = require('./filesystem');

    // var url = urlParser.parse("http://test.com"); 
    // var vrb = true;
    // var header =  ["testing:123","hola:amigo", "time:toplee"] ;
    // var qs = (url.search != null) ? url.search : "";
// client.getRequest("localhost" , "/?moaud=1&bouras=2" , vrb,header);    
// client.getRequest("localhost" , "/sample1?moaud=1&bouras=2" , vrb,header);    
// client.getRequest("localhost" , "sample1?moaud=1&bouras=2" , vrb,header);    
// client.getRequest("localhost" , "sampple1?moaud=1&bouras=2" , vrb,header);    
client.postRequest("localhost" , "/moaud.json" , vrb,header, "well hrro der mr upshman\r\n hrr drr");    

// console.log(fs.getFile("/"));
// console.log(fs.getFile("sample1"));
// console.log(fs.getFile("sample1.html"));



