'use strict';

const fs = require('fs'),    
    path = require('path');   

module.exports = {
    getFile : function (request)
    {
        var currpath = __dirname + "/data";
        
        if(request=="/")
        { 
            var output =  "";
            //console.log(currpath);
            fs.readdirSync(currpath) .forEach(file => {
                    output += "\n" + file ;
            })

            //console.log("otp: " + output);
            return output;    
        }else{
            request = (request.trim().charAt(0)=='/')? request.substr(1) : request;

            var filepath = currpath + "/" + request
            
            var fileExtenssion = "";   

            //console.log("IOF" + request.indexOf("."));
            if(request.indexOf(".") < 0 )
                fs.readdirSync(currpath) .forEach(file => {
                    if(file.substr(0,file.indexOf(".")) == request) 
                        fileExtenssion = file.substr(file.indexOf("."));
                })
            
            filepath = filepath + fileExtenssion;
            //console.log("asdf->"+ filepath);
            
            var content = (fs.existsSync(filepath))? fs.readFileSync(filepath).toString() : 404;         
            return content; 
        }
    },
    postFile : function (name, data)
    {
        var currpath = __dirname + "/data";
        
        if(name=="/")
        { 
            var output =  "";
            //console.log(currpath);
            // fs.readdirSync(currpath) .forEach(file => {
            //     output += "\n" + file ;
            // })

            //console.log("otp: " + output);
            return 500;    
        }else{     
             fs.writeFileSync(currpath + '/' + name, data); 
             return 200;
        }   
        
    }
}