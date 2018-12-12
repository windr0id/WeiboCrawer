/*
 *	关系爬取器
 *
 *
 *	@author windroid
 */
var async = require('async');
var database = require('./database');
var downloader = require('./downloader');
var parser = require('./parser');
var urlconverter = require('./urlconverter');
var weibodownloader = require('./weibodownloader');
var config = require('./config');

/*
 *	爬取relation流程
 *		# 从todo表取用户
 *		# 爬取用户资料，存入done表
 *		# visit relation用户 得到用户信息 加入todo表
 *		# 存储relation信息
 *		# 将该用户从todo表移除
 */

/*
 *	info
 */
function info(_userid, relationNum, _callback){
	var d = new Date();
	var timeStamp = d.getTime();
	var infoUrl = urlconverter.getInfoUrl(_userid);
	downloader.getHtml(infoUrl, function(_body){
		var $ = parser.init(_body);
		var userInfo = parser.getUserInfo($);
		
		var datas = [_userid, relationNum[0], relationNum[1], relationNum[2], timeStamp];
		datas = datas.concat(userInfo);
		
		database.insert(
			'w_userdone',
			['userid', 'weibonum', 'follownum', 'fansnum', 'timestamp', 'nick', 'imgsrc', 'authentication', 'gender', 'city', 'birthday', 'level', 'info', 'tag', 'rawData'],
			datas
		);
		if(_callback){
			_callback();
		}
	});
}


/*
 *	follow & fans
 */
function relation(_userid, _isFollow, _fcallback){
	var mpage = 1;
	var page = 1;
	async.doWhilst(
		function(overcallback){
			if(_isFollow){
				var pageUrl = urlconverter.getFollowUrl(_userid, page);
			}else{
				var pageUrl = urlconverter.getFansUrl(_userid, page);
			}
			downloader.getHtml(pageUrl, function(_body){
				var $ = parser.init(_body);
				mpage = parser.getMaxPageNum($);
				var userList = parser.getRelationUser($);
				async.forEach(userList, function(_item, _callback){
					if(_item[0] == null){
						return;
					}
					if(_isFollow){
						database.addRelation(_userid, _item[0]);	
					}else{
						database.addRelation(_item[0], _userid);
					}

					database.check('w_usertodo', 'userid', _item[0], function(_num){
						if(_num != 0){
							//console.log('exists: [relation.loop=>checkUsertodo] @userid:'+_item[0]);
						}else{
							database.check('w_userdone', 'userid', _item[0], function(_num){
								if(_num != 0){
									//console.log('exists: [relation.loop=>checkUserdone] @userid:'+_item[0]);
								}else{
									console.log('success: [relation.loop=>insert] @userid:'+_item[0]);
									database.insert(
										'w_usertodo',
										['userid', 'nick', 'fansnum'],
										_item
									);
								}
							});
							
						}
					});
					_callback();
				}, function(err){
					if(err){
						console.log('err: [relation.loop=>async.forEach] '+err);
					}else{
						//database over
					}
				});
				page++;
				overcallback();
			});
		}, 
		function(){
			return page <= mpage 
		}, 
		function(err){
			if(err){
				console.log('err: [relation.loop=>async.whilst] '+err);
			}
			if(_fcallback){
				_fcallback();
			}
		}
	);
}



function loop(loopcallback){
	database.getOneTodoUser(function(_userid){
		weibodownloader.downWeibo(_userid, function(err, $){
			var relationNum  = parser.getRelationNum($);
			info(_userid, relationNum);

			var isFollow = parseInt(relationNum[1]) < parseInt(relationNum[2]);
			relation(_userid, isFollow, function(){
					database.del('w_usertodo', 'userid', _userid, function(){
						loopcallback();
					});
			});
		});

	});
}

async.doWhilst(
	function(overcallback){
		loop(overcallback);
	},
	function(){
		return true;
	},
	function(err){
		if(err){
			console.log('err: [relation=>anync.doWhilst] '+err);
		}
	}
);

module.exports = {

}