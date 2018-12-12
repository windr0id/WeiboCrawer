/*
 *	weiboCrawler守护进程
 *
 *
 *	@author windroid
 */


var children = 'weibocrawler.js';

function start(){
	console.log('Mother process is running.');
	var ls = require('child_process').spawn('node', [children]);
	ls.stdout.on('data', function (data){
		var str = data.toString().slice(0, -1);
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