//GoogleExecution API

var CLIENT_ID = '693430757793-o01rnfjaf5jqgh4rrfne1uf49u2v70e0.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive'];

function checkAuth() {
	gapi.auth.authorize(
	{
		'client_id': CLIENT_ID,
		'scope': SCOPES.join(' '),
		'immediate': true
	},handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeDev = document.getElementBuId('result');
	if(authResult && !authResult.error) {
		authorizeDiv.style.display = 'none';
		callScriptFunction();
	} else {
		authorizeDiv.style.display = 'inline';
	}
}

function callScriptFunction() {
	var scriptId = '16-Sg3Lj0tgfQD94n-7I4O4wISZ-vMXRMI5UctYJXHKa0jnu5Zk2u57z0';
	
	var request = {
		'function': 'getFoldersUnderRoot'
	};
	
	var op = gapi.client.request({
		'root': 'https://script.googleapis.com',
		'path': 'v1/scripts' + scriptId + ':run',
		'method': 'POST',
		'body': request
	});
	
	op.execute(function(resp) {
		if(resp.error && resp.error.status) {
			appendPre('Error calling API:');
			appendPre(JSON.stringify(resp,null,2));
		} else if(resp.error) {
			var error = resp.error.details[0];
			appendPre('Script error message: + error.errorMessage');
			
			if(error.scriptStackTraceElements) {
				appendPre('Script error stacktrace:');
				for(var i = 0; i < error.scriptStackTraceElements.length; i++) {
					var trace = error.scriptStackTraceElements[i];
					appendPre('\t' + trace.function + ':' + trace.lineNumber);
				}
			}
		} else {
			var folderSet = resp.response.result;
			if(Object.keys(folderSet).length == 0) {
				appendPre('No folders returned!');
			} else {
				appendPre('Folders under your root folder');
				Object.keys(folderSet).forEach(function(id) {
					appendPre('\t' + folderSet[id] + '(' + id ')');
				});
			}
		}
	});
}

function appendPre(message) {
	var pre = document.getElementById('output');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}