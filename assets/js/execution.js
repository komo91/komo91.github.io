var CLIENT_ID = '141427175625-6q7m1u1s9dkpbmv2eapqutk4qihiffm2.apps.googleusercontent.com';

var scriptId = '1p5iyaVqWKumxGUhceTlbddof2mPxTal-SFcbNMkxbrsg1ivHhdV0fCCc'

var SCOPES = ['https://www.googleapis.com/auth/drive'];

//
var request = {
  'function': 'Takao_Info_XML'
}

//APIリクエスト
var op = gapi.client.request({
  'root': '',
  'path': 'v1/scripts/' + scriptId + ':run',
  'method': 'POST',
  'body': request
});

op.execute(function(resp) {
  if(resp.error && resp.error.status) {
    //API実行失敗時
    console.log('Error calling API:' + JSON.stringify(resp, null, 2));
  } else if(resp.error) {
    //API実行時にエラー
    var error = resp.error.details[0];
    console.log('Script error! Message:' + error.errorMessage);
  } else {
    //API実行成功時にreturnされた値を処理
    console.log(resp);
  }
});
