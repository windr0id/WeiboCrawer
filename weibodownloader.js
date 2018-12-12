/*
 *	微博下载器
 *
 *
 *	@author windroid
 */

var async = require('async');
var database = require('./database');
var downloader = require('./downloader');
var parser = require('./parser');
var urlconverter = require('./urlconverter');
var config = require('./config');

/*
 *	爬取微博流程
 *		# 从w_usertodo & w_userdone取用户 粉丝数大于1e6
 *		# 爬取用户[距明天00:00几天内]的微博
 */

//返回距今天24:00的毫秒数
function checkDate(_idate){
	var d = new Date();
	d.setFullYear(_idate.substr(0, 4));
	d.setMonth(_idate.substr(5, 2)-1);
	d.setDate(_idate.substr(8, 2));
	d.setHours(_idate.substr(11, 2));
	d.setMinutes(_idate.substr(14, 2));
	d.setSeconds(_idate.substr(17, 2));
	d.setMilliseconds(0);

	var t = new Date();
	t.setHours(0);
	t.setMinutes(0);
	t.setSeconds(0);
	t.setMilliseconds(0);
	var timeStamp = t.getTime();
	timeStamp += 1000*3600*24;

	return timeStamp - d.getTime();
}

//爬取日期数
var dateOfCraw = 2;
function setDateOfCraw(_q){
	dateOfCraw = _q;
}

function downWeibo(userid, _foreachcb){
	/*
	 *	每页
	 */
	var $;
	var page = 1;
	var mpage = 1;
	var next = true;
	async.doWhilst(
		function(_overcb){
			downloader.getHtml(urlconverter.getUrl(userid, page), function(_body){
				var d = new Date();
				var timeStamp = d.getTime();
				$ = parser.init(_body);
				mpage = parser.getMaxPageNum($);
				var weibos = parser.getWeibos($);
				var x = 0;
				async.map(
					weibos,
					function(datas, _callback){
						var idate = datas[5];
						if(page != 1 && checkDate(idate) > 1000*3600*24*dateOfCraw){
							next = false;
						}
						datas.push(userid);
						datas.push(timeStamp);
						database.check('w_weibo', 'no', datas[1], function(_num){
							if(_num != 0){
								next = false;
								console.log('exists: [weibo=>checkWeibo] @weibo.no:'+datas[1]);
							}else{
								database.insert(
									'w_weibo', 
									['rawdata', 'no', 'likenum', 'repostnum', 'commentnum', 'idate', 'ifrom', 'userid', 'timestamp'],
									datas
								);
							}
							_callback();
						});
					},
					function(err){
						if(err){
							console.log('err: [weibo=>async.map] '+err);
						}
						page++;
						_overcb();
					}
				);
			});
		},
		function(){
			return next && page<=mpage;
		},
		function(err){
			if(err){
				console.log('err: [weibo=>async.whilst] '+err);
			}
			_foreachcb(null, $);
		}
	);
};

module.exports = {
	downWeibo : downWeibo,
	setDateOfCraw : setDateOfCraw,
}