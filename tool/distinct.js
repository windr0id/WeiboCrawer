/*
 *	删除重复数据
 *
 *
 *	@author windroid
 */
var database = require('./../database');
var config = require('./../config');
var mysql = require('mysql');

var conn = mysql.createConnection(config.connOptions);


conn.query("SELECT * FROM w_usertodo GROUP BY userid HAVING COUNT(userid)>1", function(err, result){
	if(err){
		console.log(err);
	}else{
		console.log(result.length);
		for(var x in result){
			conn.query("SELECT * FROM w_usertodo WHERE userid = ?", result[x]['userid'], function(err, re1){
				if(err){
					console.log(err);
				}else{
					for(var y in re1){
						if(y != re1.length-2){
							conn.query("DELETE FROM w_usertodo WHERE Id = ?", re1[y]['Id'], function(err){
								if(err){
									console.log(err);
								}else{
									console.log('del: '+re1[y]['userid']);
								}
							});
						}
						
					}
				}
			});
		}
	}
});
