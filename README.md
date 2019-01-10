## Installations
git clone https://github.com/gaikwad411/bg-api-proxy.git
npm install
#### This will start the proxy on port 9000 and will proxy request on port 8000
node proxy.js 

#### Now you can try requests on http://localhost:9000/foo and it will be proxied to http://localhost:8000/foo
#### You will get response_id in above call response using which you can check the response for above actual api call.
e.g. if you get response id as fa5636ea-31dd-4fa5-ae12-2dad5ca64be2
you can get the output JSON by calling
http://localhost:9000/responses/fa5636ea-31dd-4fa5-ae12-2dad5ca64be2.json
Output JSON will be written to responses folder


#### Note: Currently it supports only JSON apis, work in progress


