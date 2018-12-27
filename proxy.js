var http = require('http'),
httpProxy = require('http-proxy');
var fs =  require('fs');
var uuid = require('uuid');

var options = { target: "http://localhost:3000" };
var proxy = httpProxy.createProxyServer({});


http.createServer(function(req, res) {


  var filePath = '.' + req.url;
  if(filePath.indexOf('responses/') > -1){
    fs.readFile(filePath.substring(filePath.indexOf('responses/')), function(err, data) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(data);
      res.end();
    });

    
    return;
  }


  var responseId = uuid.v4();
  req['responseId'] = responseId;
  proxy.web(req, res, { target: "http://localhost:3000" });
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.send(JSON.stringify({
    'status':'success', 
    'response_id': responseId}));
  res.end();
})
.listen(9000);


proxy.on('proxyRes', function (proxyRes, req, res) {
  responseId = req['responseId']; 
  // On response from proxy
  var body = new Buffer('');
    
  proxyRes.on('data', function (data) {
      body = Buffer.concat([body, data]);
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