/*
 *	内容下载器
 *
 *
 *	@author windroid
 */
var url = require('url');
var cheerio = require('cheerio');
var request = require('request');
var config = require('./config');

/*
 * 得到url的内容
 * @param _callback(body)
 * @return document
 */
var cookieIndex = parseInt(Math.random()*100);
function getHtml(_url, _callback){
	var j = config.getCookieJar(cookieIndex);
	var options = {
		url: _url,
		headers: config.headers,
		jar: j,
	};
	request(options, function(err, response, body){
		//console.log(response);
		//console.log(body);
		if(!err){
			if(body == ''){
				console.log('err: [downloader.getHtml] @info: body is null @url:'+_url+' @statusCode:'+response.statusCode);
				retry(_url, _callback);
			}else{
				console.log('success: [downloader.getHtml] @url:' + _url);
				_callback(body);
			}
		}else{
			console.log('err: [downloader.getHtml] '+err+' @url:'+_url);
			retry(_url, _callback);
		}
	});
}
function retry(_url, _callback){
	console.log('retry: [downloader.retry]');
	cookieIndex += parseInt(Math.random()*10);
	getHtml(_url, _callback);
}

module.exports = {
	getHtml : getHtml,
}