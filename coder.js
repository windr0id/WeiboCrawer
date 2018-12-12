/*
 *	编码器
 *
 *
 *	@author windroid
 */


function decodeHtml(_str){
	if(_str == null) return '';
	var s = _str.replace(/&#x[\dA-F]{2,4};/g, function(_hex){
		return String.fromCharCode('0' + _hex.slice(2, -1));
	});
	return s;
}

module.exports = {
	decodeHtml : decodeHtml,
}


/*
var str = '<div><span class="cmt">&#x8F6C;&#x53D1;&#x4E86;&#xA0;<a href="http://weibo.cn/u/5229005755">&#x674E;&#x56DB;&#x5927;&#x4EBA;</a>&#xA0;&#x7684;&#x5FAE;&#x535A;:</span><span class="ctt">&#x8DEF;&#x8FC7;&#x62A5;&#x520A;&#x4EAD;&#xFF0C;&#x5E72;&#x4E86;&#x4E00;&#x4EF6;&#x597D;&#x4E8B;&#x3002;&#x628A;<a href="/n/%E5%8D%9A%E7%89%A9%E6%9D%82%E5%BF%97">@&#x535A;&#x7269;&#x6742;&#x5FD7;</a> &#x4ECE;&#x300A;&#x77E5;&#x97F3;&#x300B;&#x540E;&#x9762;&#x626F;&#x51FA;&#x6765;&#x4E86;&#x3002;</span>&#xA0;[<a href="http://weibo.cn/mblog/picAll/DEV5Ftv7C?rl=1">&#x7EC4;&#x56FE;&#x5171;2&#x5F20;</a>]</div><div><a href="http://weibo.cn/mblog/pic/DEV5Ftv7C?rl=0"><img src="http://ww1.sinaimg.cn/wap180/005HSngvjw1f5umlv9af5j32c02c07wi.jpg" alt="&#x56FE;&#x7247;" class="ib"></a>&#xA0;<a href="http://weibo.cn/mblog/oripic?id=DEV5Ftv7C&amp;u=005HSngvjw1f5umlv9af5j32c02c07wi">&#x539F;&#x56FE;</a>&#xA0;<span class="cmt">&#x8D5E;[423]</span>&#xA0;<span class="cmt">&#x539F;&#x6587;&#x8F6C;&#x53D1;[777]</span>&#xA0;<a';
console.log(decodeHtml(str));
*/

