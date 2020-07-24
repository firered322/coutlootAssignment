const http = require("http");
const { roundRobin } = require("./config/helper");

const server = [
  require("./servers/server1"),
  require("./servers/server2"),
  require("./servers/server3"),
  require("./servers/server4"),
];
const HOME_URL = "localhost";
const PORT = [3000, 3001, 3002, 3003];

// generate the ip addresses based on the configuration
const ips = PORT.map(port=>`${HOME_URL}:${port}`)

// spawn the available servers
server.forEach((s, i) => {
  s.listen(PORT[i], (err) => {
    if (err) {
      console.error("Encountered an error: ", err);
    } else {
      console.log(`Server Up and running at: ${PORT[i]}`);
    }
  });
});

// implement the round robin on the available servers.
let roundServer = roundRobin(ips);

http
  .createServer(function (req, res) {
    var options = {
      host: roundServer(),
      method: req.method,
      path: req.url,
      headers: req.headers
    };

    var server = http.request(options, function (resp) {
      res.statusCode = resp.statusCode;
      Object.keys(resp.headers).forEach(function (header) {
        res.setHeader(header, resp.headers[header]);
      });
      resp.pipe(res);
    });
  
    req.pipe(server);
    // let url = req.url;
    // if (url === "/products/list") {
    //   res.writeHead(301, {
    //     Location: `${HOME_URL}/${roundServer()}`,
    //     //add other headers here...
    //   });
    // } else {
    //   res.end("Invalid request");
    // }
  })
  .listen(5000, () => {
    console.log("Rev Proxy running at port 5000");
  });
