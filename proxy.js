var http = require('http'),
httpProxy = require('http-proxy');
var fs =  require('fs');
var uuid = require('uuid');

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
  proxy.web(req, res, { target: "http://localhost:8000" });
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
    'status':'success', 
    'response_id': responseId}));
  res.end();
})
.listen(9000);


proxy.on('proxyRes', function (proxyRes, req, res) {
  responseId = req['responseId']; 
  // On response from proxy
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