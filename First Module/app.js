const http = require("http");
const routes = require("./routes");
// function requestListener(req, res) {}

// http.createServer(requestListener);

const server = http.createServer(routes);

server.listen(3000);
