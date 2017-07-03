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
			url: 'http://takaovc599.ec-net.jp/05event/0501event.html',
			dataType: 'html',
		}).done(function(data) {
			console.log(data);
			$('#hoge').html($(data).find('main'));
			//$table = $('table',$('#hoge'));
			//$title = $('title',$('#hoge').html(data).hide());
			//$('#Sample1').html($title.html());
			//$('#Sample2').html($table.parent().html());
		});
	});
});

/*
function XMLHttpRequestCreate() {
	try{
		return new XMLHttpRequest();
	}catch(e){}
	try{
		return new ActiveXObject('MSXML2.XMLHTTP.6.0');
	}catch(e){}
	try{
		return new ActiveXObject('MSXML2.XMLHTTP.3.0');
	}catch(e){}
	try{
		return new ActiveXObject('MSXML2.XMLHTTP');
	}catch(e){}

	return null;
}

var xhr = new XMLHttpRequestCreate();

var url = "https://weather.yahoo.co.jp/weather/jp/13/4410/13201.html";
var send_data = "Hello,World!!";
xhr.open("GET",url);
xhr.send(null);
*/


