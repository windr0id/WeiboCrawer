/*
 *	微博date
 *
 *
 *	@author windroid
 */

var mysql = require('mysql');
var config = require('./../config');
var conn = mysql.createConnection(config.connOptions);

function checkTime(i){
	if (i < 10){
		i = "0" + i;
	}
  	return i;
}
var p = 0;
function testOver(num){
	p += 1;
	if(p == num){
		console.log('all over.');
	}
}
conn.query('SELECT Id, date, timestamp FROM w_weibo', function(err , weibos){
	var d = new Date();

	for(var x=0; x<weibos.length; x++){
		d.setTime(weibos[x]['timestamp']);
		var wd = weibos[x]['date'];
		var idate = '';
		var ifrom = wd.match(/来自.*?$/);
		if(ifrom){
			ifrom = ifrom[0].slice(2);
		}

		if(wd.match(/今天/)){
			idate += d.getFullYear()+'-';
			idate += checkTime(d.getMonth())+'-';
			idate += checkTime(d.getDate())+' ';
			idate += wd.substr(3, 5)+':';
			idate += checkTime(d.getSeconds());
			//console.log('1 '+weibos[x]['date']);
		}else if(wd.match(/^\d{1,2}分钟前/)){
			var n = wd.match(/^\d{1,2}分钟前/)[0].slice(0, -3);
			d.setTime(weibos[x]['timestamp']-n*1000*60);
			idate += d.getFullYear()+'-';
			idate += checkTime(d.getMonth())+'-';
			idate += checkTime(d.getDate())+' ';
			idate += checkTime(d.getHours())+':';
			idate += checkTime(d.getMinutes())+':';
			idate += checkTime(d.getSeconds());
			//console.log('2 '+weibos[x]['date']);
		}else if(wd.match(/\d{2}月/)){
			idate += d.getFullYear()+'-';
			idate += wd.substr(0, 2)+'-';
			idate += wd.substr(3, 2)+' ';
			idate += wd.substr(7, 5)+':';
			idate += checkTime(d.getSeconds());;
			//console.log('3 '+weibos[x]['date']);
		}else{
			idate += wd.substr(0, 19);
			//console.log('4 '+weibos[x]['date']);
		}
		//console.log(from);
		conn.query("UPDATE w_weibo SET idate = ?, ifrom = ? WHERE Id = ?", [idate, ifrom, weibos[x]['Id']], function(err, result){
			//console.log(result);
			if(err){
				console.log(err);
			}
			testOver(weibos.length);
		});
	}
	console.log('query over, please waiting...');
});


