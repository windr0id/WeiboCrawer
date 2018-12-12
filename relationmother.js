/*
 *	relationCrawler守护进程
 *
 *
 *	@author windroid
 */
var http = require("http");  
var os = require('os');

var children = 'relationcrawler.js';

var pool = [];
var poolnum = 15;

function start(){
	console.log('Mother process is running.');
	var ls = require('child_process').spawn('node', [children]);
	ls.stdout.on('data', function (data){
		var str = data.toString().slice(0, -1);
		pool.push(str);
		if(pool.length > poolnum){
			pool.shift();
		}
		console.log(str);
	});
	ls.stderr.on('data', function (data){
		console.log(data.toString().slice(0, -1));
	});
	ls.on('exit', function (code){
		console.log('child process exited with code ' + code);
		delete(ls);
		setTimeout(start,3000);
	});
}
start();


http.createServer(function(request, response) {  
    //console.log('request received');  
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
    response.write('<!DOCTYPE html>');
    response.write('<html>');
    response.write('<head>');
    response.write('<meta charset="utf-8" />');
    response.write('</head>');
    response.write('<body onload="window.scrollTo(0,document.body.scrollHeight); " >')
    response.write(pool.join(' <br/> '));  
    response.write('</body>');
    response.write('</html>');
    response.end();  
}).listen(9680);  


http.createServer(function(request, response) {  
    var freemem = os.freemem();
	var totalmem = os.totalmem();
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  
    response.write('<!DOCTYPE html>');
    response.write('<html>');
    response.write('<head>');
    response.write('<meta charset="utf-8" />');
    response.write('</head>');
    response.write('<body onload="window.scrollTo(0,document.body.scrollHeight); " >')
    response.write(String((1-freemem/totalmem)*100).substr(0, 5)+"%");  
    response.write('</body>');
    response.write('</html>');
    response.end();  
}).listen(9681);  