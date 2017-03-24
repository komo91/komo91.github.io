
funtion LocationTest() {
  mavigator.geolocation.getCurrentPosition(succesFunc,errorFunc,optionObj);
  
}

function successFunc(position) {
  var data = position.coords;
  
  alert("緯度:" + data.latitude + "経度:" + data.longitude); //緯度,経度
  
  document.getElementById('result').innerHTML = '<dl><dt>緯度</dt></dd>' + data.latitude + '</dd><dt>経度</dd></dl>';
  
}

function errorFunc(error) {
  //
  var errorMessage = {
    0: "原因不明",
    1: "位置情報取得不許可",
    2: "位置情報取得電波状況",
    3: "位置情報取得タイムアウト",
  };
  
  alert(errorMessage[error.code]);
}

var optionObj = {
  "enableHighAccuracy": false,
  "timeout": 8000,
  "maximuAge": 5000,
};
