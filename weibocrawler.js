/*
 *	微博爬取器
 *
 *
 *	@author windroid
 */
var async = require('async');
var database = require('./database');
var weibodownloader = require('./weibodownloader');
var config = require('./config');


weibodownloader.setDateOfCraw(7);
function loop(){
	var d = new Date();

	if(d.getHours() == config.weiboCrawlerHour || true){
		database.getUsers(config.fansLimit, function(userids){
			/*
			 *	每个user
			 */
			async.forEachSeries(userids, weibodownloader.downWeibo, 
			function(err){
				if(err){
					console.log('err: [weiboCrawler=>forEachSeries] '+err);
				}else{
					console.log('over: [weiboCrawler=>forEachSeries]');
				}
				
			});
		});
	}else{
		console.log(d+' wating...')
	}
	
	setTimeout(loop, 1000*60*60);
}

loop();