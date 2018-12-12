/*
 *	数据库
 *
 *
 *	@author windroid
 */
var mysql = require('mysql');
var url = require('url');
var cheerio = require('cheerio');
var request = require('request');
var config = require('./config');

var conn = mysql.createConnection(config.connOptions);

/*
 *	select a todoUser from database
 *
 */
function getOneTodoUser(_callback){
	//_callback('3822601711'); return; 
	var queSql = "SELECT userid FROM w_usertodo ORDER BY fansnum desc LIMIT 1";
	conn.query(queSql, function(err, result){
		if(err){
			console.log('err: [database.getOneTodoUser] '+err);
		}else{
			var userid = result[0]['userid'];
			if(_callback){
				_callback(userid);
			}
		}
	});
}

/*
 *	select a user from w_usertodo & w_userdone where fansnum>_q
 *
 */
function getUsers(_q, _callback){
	//需重构 2016/7/26
	var overnum = 0;
	var userids = [];
	var queSql = "SELECT userid FROM w_usertodo WHERE fansnum > ?";
	conn.query(queSql, [_q], function(err, result){
		if(err){
			console.log('err: [database.getUsers] '+err);
		}else{
			for(var x in result){
				userids.push(result[x]['userid']);
			}
			overnum++;
			if(overnum == 2 && _callback){
				overnum++;
				_callback(userids);
			}
		}
	});
	queSql = "SELECT userid FROM w_userdone WHERE fansnum > ?";
	conn.query(queSql, [_q], function(err, result){
		if(err){
			console.log('err: [database.getUsers] '+err);
		}else{
			for(var x in result){
				userids.push(result[x]['userid']);
			}
			overnum++;
			if(overnum == 2 && _callback){
				overnum++;
				_callback(userids);
			}
		}
	});
}


/*
 *	database insert操作
 *	_fields & _datas 次序对应
 *	@param _table string tablename
 *	@param _fields string[] fieldname list
 *	@param _datas string[] data list
 */
function insert(_table, _fields, _datas, _callback){
	var queSql = 'INSERT INTO ' + _table +'(';
	var temp = '';
	for(var x in _fields){
		queSql += _fields[x];
		temp += '?';
		if(x != _fields.length-1){
			queSql += ',';
			temp += ',';
		}
	}
	queSql += ') values(' + temp + ')';
	//console.log(queSql);

	conn.query(queSql, _datas, function(err, result){
		if(err){
			//console.log(_datas);
			console.log('err: [database.insert] '+err);
			console.log(queSql);
			console.log(_datas);
		}
		if(_callback){
			_callback(err);
		}
	});
}

function update(_table, _fields, _datas, _callback){
	//TODO
}

function del(_table, _field, _data, _callback){
	var queSql = "DELETE FROM "+_table+" WHERE "+_field+" = ?";
	conn.query(queSql, [_data], function(err){
		if(err){
			console.log('err: [database.delete] '+err);
		}
		if(_callback){
			_callback();
		}
	});
}

function check(_table, _field, _data, _callback){
	var queSql = "SELECT COUNT(*) FROM "+_table+" WHERE "+_field+" = ?";
	conn.query(queSql, [_data], function(err, result){
		if(err){
			console.log('err: [database.check] '+err);
		}
		//console.log(result[0]['COUNT(*)']);
		_callback(result[0]['COUNT(*)']);
	});
}

function addRelation(_userid, _followid){
	if(_userid == '' || _followid == ''){
		return;
	}
	var queSql = "SELECT COUNT(*) FROM w_relation WHERE userid = ? AND followid = ?";
	conn.query(queSql, [_userid, _followid], function(err, result){
		if(err){
			console.log('err: [database.addRelation] '+err);
		}else if(result[0]['COUNT(*)'] != 0){
			console.log('exists: [database.addRelation] '+_userid+'->'+_followid);
		}else{
			var queSql = "INSERT INTO w_relation(userid, followid) VALUES(?, ?)";
			conn.query(queSql, [_userid, _followid], function(err){
				if(err){
					console.log('err: [database.addRelation] '+err);
				}
			});
		}
	});

}

module.exports = {
	getOneTodoUser : getOneTodoUser,
	getUsers : getUsers,
	insert : insert,
	check : check,
	del : del,
	addRelation : addRelation,
}

