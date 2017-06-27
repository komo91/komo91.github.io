/*
var hoge ="https://www.yahoo.co.jp/"

function readHtml(url) {
	$.ajax({
		type: 'GET',
		url: url,
		success: function(data) {
			$('#hoge').append(data.responseText);
		},
		error: function(xhr,status,err) {
			alert('HTML読み出しで問題がありました:' + url);
		}
	});
}

readHtml(hoge);
*/

$(function() {
	$.ajax({
		url: 'https://weather.yahoo.co.jp/weather/jp/13/4410/13201.html',
		type: 'GET',
		success: function(data) {
			$('#hoge').html(data.responseText);
			$table = $('table',$('#hoge'));
			$('#Sample1').html($table.parent().prev().html());
			$('#Sample2').html($table.parent().html());
		}
	});
});