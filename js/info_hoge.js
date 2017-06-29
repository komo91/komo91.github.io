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


/*
$(document).ready(function() {
	console.log("hoge2");
	$(function() {
		console.log("hoge");
		$.ajax({
			type: 'GET',
			url: 'https://weather.yahoo.co.jp/weather/jp/13/4410/13201.html',
			dataType: 'html',
			success: function(data) {
				console.log(data);
				$('#hoge').html(data.responseText);
				$table = $('table',$('#hoge'));
				$('#Sample1').html($table.parent().prev().html());
				$('#Sample2').html($table.parent().html());
			}
		});
	});
});
*/

$(document).ready(function() {
	$(function() {
		console.log("hoge");
		$.ajax({
			type: 'GET',
			url: 'Accleration.html',
			dataType: 'html',
		}).done(function(data) {
			console.log(data);
			$('#hoge').html(data);
			$table = $('table',$('#hoge'));
			$title = $('title',$('#hoge'));
			$('#Sample1').html($title.html());
			$('#Sample2').html($table.parent().html());
		});
	});
});