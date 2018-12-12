/*
 *	内容解析器
 *
 *
 *	@author windroid
 */
var url = require('url');
var cheerio = require('cheerio');
var coder = require('./coder');
var config = require('./config');

/*
 *	初始化
 */
function init(_body){
	var $ = cheerio.load(_body);
	return $;
}

/*
 *	得到最大分页
 */
function getMaxPageNum($){
	var mp = $('[name=mp]');
	return mp.val();
}

/*
 *	以下方法基于weibo页面
 */

function getUserState($){
	var errStr = $('.me').text();
	return errStr;
}

function getUserId($){
	var id = $('.ut').children('a').eq(1).attr('href').slice(1, -5);
	return id;
}

function getRelationNum($){
	var weiboNum = $('.tc').eq(0).text().slice(3, -1);
	var followNum = $('.tc').eq(0).next().text().slice(3, -1);
	var fansNum = $('.tc').eq(0).next().next().text().slice(3, -1);

	return [weiboNum, followNum, fansNum];
}

/*
 * @return [weibo0, weibo1 ...]
 */
function getWeibos($){
	var rawDatas = $('.c');
	var likeNums = $('.ct').prev().prev().prev().prev();
	var repostNums = $('.ct').prev().prev().prev();
	var commentNums = $('.ct').prev().prev();
	var dates = $('.ct');

	var _rawDatas = [];
	var _nos = [];
	var _likeNums = [];
	var _repostNums = [];
	var _commentNums = [];
	var _dates = [];
	var _idates = [];
	var _ifroms = [];

	function checkTime(i){
		if (i < 10){
			i = "0" + i;
		}
		return i;
	}
	var d = new Date();
	for(var x=0; x<dates.length; x++){
		_rawDatas.push(coder.decodeHtml(rawDatas.eq(x).html()));
		_nos.push(rawDatas.eq(x).attr('id'));
 		_likeNums.push(likeNums.eq(x).text().slice(2, -1));
 		_repostNums.push(repostNums.eq(x).text().slice(3, -1));
 		_commentNums.push(commentNums.eq(x).text().slice(3, -1));

 		var wd = dates.eq(x).text();
		var idate = '';
		var ifrom = wd.match(/来自.*?$/);
		if(ifrom){
			ifrom = ifrom[0].slice(2);
		}
		if(wd.match(/今天/)){
			idate += d.getFullYear()+'-';
			idate += checkTime(d.getMonth()+1)+'-';
			idate += checkTime(d.getDate())+' ';
			idate += wd.substr(3, 5)+':';
			idate += checkTime(d.getSeconds());
		}else if(wd.match(/^\d{1,2}分钟前/)){
			var n = wd.match(/^\d{1,2}分钟前/)[0].slice(0, -3);
			d.setTime(d.getTime()-n*1000*60);
			idate += d.getFullYear()+'-';
			idate += checkTime(d.getMonth()+1)+'-';
			idate += checkTime(d.getDate())+' ';
			idate += checkTime(d.getHours())+':';
			idate += checkTime(d.getMinutes())+':';
			idate += checkTime(d.getSeconds());
		}else if(wd.match(/\d{2}月/)){
			idate += d.getFullYear()+'-';
			idate += wd.substr(0, 2)+'-';
			idate += wd.substr(3, 2)+' ';
			idate += wd.substr(7, 5)+':';
			idate += checkTime(d.getSeconds());;
		}else{
			idate += wd.substr(0, 19);
		}

		_idates.push(idate);
		_ifroms.push(ifrom);
	}

	var weibos = [];
	for(var x in _nos){
		weibos.push([_rawDatas[x], _nos[x], _likeNums[x], _repostNums[x], _commentNums[x], _idates[x], _ifroms[x]]);
	}

	return weibos;
}

/*
 *	以下方法基于info页面
 */

function getUserInfo($){
	var rawData = coder.decodeHtml($('.tip:contains(基本信息)').next().html());
	//console.log(rawData);
	var imgSrc = $('[alt=头像]').attr('src');
	var level = $('.c:contains(会员等级)').text();
	if(level.match(/未开通/)){
		level = '0';
	}else{
		level = level.match(/会员等级：.*?级/)[0].slice(5, -1);
	}
	
	function filter(reg){
		//console.log(reg);
		var m = rawData.match(reg);
		if(m){
			return m[0].slice(3, -1);
		}else{
			return '';
		}
		
	}
	var nick = filter(/昵称:.*?</);
	var authentication = filter(/认证:.*?</);
	var gender = filter(/性别:.*?</);
	var city = filter(/地区:.*?</);
	var birthday = filter(/生日:.*?</);
	var info = filter(/简介:.*?</);

	var tag = [];
	var taga = $('.tip:contains(基本信息)').next().children('a');
	for(var x=0; x<taga.length-1; x++){
		tag.push(taga.eq(x).text());
	}
	tag = tag.join();

	return [nick, imgSrc, authentication, gender, city, birthday, level, info, tag, rawData];
}

/*
 *	以下方法基于follow&fans页面
 */

/*
 *	@return [user0, user1 ...] 
 */
function getRelationUser($){
	var list = [];
	var tr = $('tr');
	for(var x=0; x<tr.length; x++){
		var td = tr.eq(x).children('td').eq(1);

		var nick = td.children('a').eq(0).text();
		var fansNum = td.text().match(/粉丝\d.*?人/)[0].slice(2, -1);
		var userId = td.children('a').eq(1).attr('href');
		if(userId == undefined){
			console.log(td.html());
		}else{
			userId = userId.match(/uid=\d.*?&/)[0].slice(4, -1);
		}
		
		
		list.push([userId, nick, fansNum]);
	}
	return list;
}


module.exports = {
	init : init,
	getMaxPageNum : getMaxPageNum,
	getUserState : getUserState,
	getUserId : getUserId,
	getRelationNum : getRelationNum,
	getWeibos : getWeibos,
	getUserInfo : getUserInfo,
	getRelationUser : getRelationUser,
}
