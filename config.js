/*
 *	项目配置
 *
 *
 *	@author windroid
 */
var request = require('request');
var fs = require('fs');

var loginUrl = 'http://login.weibo.cn/login/';
var cookieUrl =  'http://weibo.cn/';

var cookieList = [];

function getCookieStr(_index){
	var raw = fs.readFileSync('usercookie.ini', 'utf8');
	cookieList = raw.split('\n');
	return cookieList[_index%cookieList.length];
}

function getCookieJar(_index){
	var j = request.jar();
	var cookies = getCookieStr(_index).split(';');
	for(var x in cookies){
		var c = request.cookie(cookies[x]);
		j.setCookie(c, cookieUrl);
	}
	return j;
}

var localdb = {
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	port: '3306',
	database: 'weibo',
};

var cdb = {
	host: '10.66.162.112',
	user: 'windroid',
	password: 'qwas12',
	port: '3306',
	database: 'weibo',
};


module.exports = {
	getCookieJar : getCookieJar,
	headers : {
		// 'accept': 'text/html,application/xhtml+xml',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
	},
	connOptions : localdb,
	imgUrl : 'http://windroid-10048101.file.myqcloud.com/',
	fansLimit : 10000000,
	weiboCrawlerHour : 0,
}