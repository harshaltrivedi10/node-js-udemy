const fs = require("fs");
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      "<html><head><title>Form</title></head><body><form action='/message' method='POST'><input type='text' name='message'/><button type='submit'>Send Request</button></form></body></html>"
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      //   console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      //   console.log(message);
      fs.writeFile("message.txt", message, (err) => {
        console.log(err);
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  //   to exit
  //   process.exit();
  res.setHeader("Content-Type", "text/html");
  res.write(
    "<html><head><title>First App</title></head><body><h1>Hello!</h1></body></html>"
  );
  console.log(req.url, req.method, req.headers);
  res.end();
};
// single export
module.exports = requestHandler;

// multiple exports
// module.exports = {
//   handler: requestHandler,
//   somethingElse: "hahahaha",
// };
