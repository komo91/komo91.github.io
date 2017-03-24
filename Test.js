
funtion LocationTest() {
  mavigator.geolocation.getCurrentPosition(succesFunc,errorFunc,optionObj);
  
}

function successFunc(position) {
  alert(position.coords.latitude); //緯度
  
  alret(position.coords.longitude); //経度
  
  //document.getElementById('result').innerHTML = <>
  
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
