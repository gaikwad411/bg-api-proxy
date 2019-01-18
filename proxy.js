// Asynchronous Proxy Server 
// It creates http proxy server and proxies requests to another server, but it does not wait for response, thus
// it is good for proxy of long running requests.
//
// Created By Sachin Gaikwad <gaikwad411@gmail.com>

var fs =  require('fs');
var uuid = require('uuid');
var config = require('./config.js');
var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});



// Create http server for proxy
var createProxyServer = function(){
  http.createServer(function(req, res) {
    // To handle received responses
    var filePath = '.' + req.url;
    if(filePath.indexOf('responses/') > -1){
      fs.readFile(filePath.substring(filePath.indexOf('responses/')), function(err, data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
      });
      return;
    }
  
    // To handle proxy function
    var responseId = uuid.v4();
    req['responseId'] = responseId;
    proxy.web(req, res, { target: config.proxyURL });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({
      'status':'success', 
      'response_id': responseId}));
    res.end();
  })
  .listen(config.port, '127.0.0.1', function(){
    console.log('Started HTTP server for proxy on port '+config.port+' on host 127.0.0.1');
  });

  // On response received from proxied request
proxy.on('proxyRes', function (proxyRes, req, res) {
  // On response from proxy
  responseId = req['responseId']; 
  var body = '';
  proxyRes.on('data' , function(dataBuffer){
    var data = dataBuffer.toString('utf8');
    console.log("This is the data from target server : "+ data);
    body += data;
  });
    
  proxyRes.on('end', function () {
      body = body.toString();
      fs.writeFile('responses/'+responseId+'.json', body, function(err){
        if(err){
          console.log('Error in writing file.');
          return false;
        }
        console.log('File wrote successfully...');
      });
  });

});

};


if (require.main === module) {
  return createProxyServer();
}

module.exports = {
  createProxyServer
}