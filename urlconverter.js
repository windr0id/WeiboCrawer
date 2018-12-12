/*
 *	url转换器
 *
 *
 *	@author windroid
 */

function getUrl(_id, _page){
	var url = 'http://weibo.cn/u/'+_id;
	if(_page){
		url += '?page='+_page;
	}
	return url;
}

function getInfoUrl(_id){
	return 'http://weibo.cn/'+_id+'/info';
}

function getFollowUrl(_id, _page){
	var url = 'http://weibo.cn/'+_id+'/follow';
	if(_page){
		url += '?page='+_page;
	}
	return url;
}

function getFansUrl(_id, _page){
	var url = 'http://weibo.cn/'+_id+'/fans';
	if(_page){
		url += '?page='+_page;
	}
	return url;
}

module.exports = {
	getUrl : getUrl,
	getInfoUrl : getInfoUrl,
	getFollowUrl : getFollowUrl,
	getFansUrl : getFansUrl,
}
