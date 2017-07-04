
$(document).ready(function() {
	$(function() {
		console.log("hoge");
		$.ajax({
			type: 'GET',
			url: 'http://takaovc599.ec-net.jp/05event/0501event.html',
			dataType: 'html',
		}).done(function(data,textStatus) {
			console.log(textStatus);
			console.log(data);
			$('#hoge').load('url',function() {
				$title = $('title',$('#hoge').html(data).hide());
				$('#Sample1').html($title.html());
			});
			//$('#hoge').html($(data).find('#main'));
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


/*
var url = 'http://takaovc599.ec-net.jp/05event/0501event.html';

function file_read(url,a) {
	var XMLHR = new XMLHttprequest();
	XMLHR.onreadystaechange = function() {
		if(XMLHR.readyState == 4 && XMLHR.status==200) {
			var hoge = XMLHR.responseText;
			document.getElementById("hoge").innerHTML = hoge;
		}
	}
	XMLHR.open("GET",url,true);
	XMLHR.send(null);
}
*/
	
	


