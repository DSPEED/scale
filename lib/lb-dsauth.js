var arguments = process.argv.splice(2);
var httpProxy = require('http-proxy');

var seaport = require('seaport');
var ports = seaport.connect('localhost', 9090);

//
// Addresses to use in the round robin proxy
//
var i = -1;
httpProxy.createServer(function (req, res, proxy) {
    var addresses = ports.query('server');

    // if there are not workers, give an error
    if (!addresses.length) {
        res.writeHead(503, {'Content-Type' : 'text/plain'});
        res.end('Service unavailable');
        return;
    }

    i = (i + 1) % addresses.length;
    proxy.proxyRequest(req, res, addresses[i]);
}).listen(arguments[0] || 8000);