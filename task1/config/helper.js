
// The round-robin implementation used for switching between the servers
exports.roundRobin = (arr) => {
  index = 0;
  return function () {
    if (index >= arr.length) {
      index = 0;
    }
    return arr[index++];
  };
};

// Callback function for each of the 4 servers which exposes a single endpoint
exports.serverCallback = (data, serverNo) => (req, res) => {
  console.log(`Server no: ${serverNo}`)
  console.log(req.url)
  let url = req.url;
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "application.json" });
    res.write(JSON.stringify({ data }));
    res.end();
  } else {
    res.end("Invalid request");
  }
};
