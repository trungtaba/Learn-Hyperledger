express = require("express");

const route=require('./route/route');

var app = express();  

app.use(express.static("public"));
console.log('server starting');

app.use('/',route);

var server = require("http").createServer(app);

server.listen(3030);

