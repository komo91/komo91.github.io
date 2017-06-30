var p = document.getElementById('sample');

/*
$(function() {
	$.ajax('LocationTest.html', {
		timeout : 1000,
		datatype:'html'
	}).then(function(data){
		var out_html = $($.parseHTML(data));
		$('#sample').empty().append(out_html.filter('#hoge1')[0].innerHTML);
		$('#sample2').empty().append(out_html.fillter('#hoge2')[0].innerHTML);
	},function(jqXHR, textStatus) {
		if(textStatus!=="success") {
			var txt = "<p>textStatus:"+ textStatus + "</p>" +
				"<p>status:"+ jqXHR.status + "</p>" +
				"<p>responseText : </p><div>" + jqXHR.responseText +
				"</div>";
			$('#sample').html(txt);
			$('#sample2').html(txt);
		}
	});
});
*/



$(function() {
	$.ajax({
		url: 'https://weather.yahoo.co.jp/weather/jp/13/4410/13201.html',
		type: 'GET',
		dataType: 'html',
		success: function(data) {
			$('#hugu').append(data);
			$table = $('table',$('#hugu'));
			$('#sample1').html($table.parent().prev().html());
			$('#sample2').html($table.parent().html());
		}
	});
});


/*
var result = document.evaluate('/descendant::p', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
var node;
while(node=result.iterateNext()) {
	console.log(node.id);
}
*/


/*
var nodelist = document.getElementsByTagName('div');	//divの数
console.log(nodelist.length);
*/



/*
var newelement = document.createElement('p');
var newtextnode = document.createTextNode("new Text Node");
newelement.appendChild(newtextnode);
document.body.appendChild(newelement);
*/


/*
var newelement = document.createElement('p');
console.log(newelement);
document.body.appendChild(newelement);
*/



/*
var children = p.childNodes;
var textnode = children.item(0);
p.removeChild(textnode);	//hogehoge消去
p.removeChild(children.item(0));	//year消去
//children.item(0).nodeValue = "更新";
*/



/*
var children = p.childNodes;
var textnode = children.item(0);
console.log(textnode.nodeValue);
textnode.nodeValue = "書き間違えた";	hogehoge→書き間違えた
*/


/*
var children = p.childNodes;
console.log(children.length);
*/


/*
console.log(p.childNode);	//子ノード内容取得
*/

/*
console.log(p.parentNode.tagName);	//親ノードタグ取得
*/

/*
console.log(p.parentNode);	//親ノード内容取得
*/