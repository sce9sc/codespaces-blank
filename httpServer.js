const http = require('http')

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("My first server!");
};

const port = 80

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`Server is running on`);
});