var url ="https://www.yahoo.co.jp/"

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