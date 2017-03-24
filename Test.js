if(navigator.geolocation) {
  console.log("test1");
  navigator.geolocation.getCurrentPosition(
    function( position )
    {
      var data = position.coords;
      
      var lat = data.latitude;
      var lng = data.longitude;
      var alt = data.altitude;
      var accLatlng = data.accuracy;
      var accAlt = data.altitudeAccuracy;
      var heading = data.heading;
      var speed = data.speed;
      console.log("test2");
      
      alert("現在位置は¥n[" + lat + "," + lng + "]¥nです");
      
      document.getElementById('result').inerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>高度</dt><dd>' + alt + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng + '</dd><dt>高度の精度</dt><dd>' + accAlt + '</dd><dt>方角</dt><dd>' + heading + '</dd><dt>速度</dt><dd>' + speed + '</dd><dl>';
      
    },
    
    function(error)
    {
      var errorInfo = [
        "原因不明のエラー",
        "位置情報取得許可されない",
        "電波状況で位置情報取得できず",
        "タイムアウト"
      ];
      
      var errorNo = error.code;
      
      var errorMessage = "[エラー番号:" + errorNo + "]_n" + errorInfo[errorNo];
      
      alert(errorMessage);
      console.log("test3");
      
      document.getElementById("result").innerHTML = errorMessage;
      
    },
    
    {
      "enableHighAccuracy": false,
      "timeout": 8000,
      "maximumAge": 2000,
    }
  );
}
else 
{
  var errorMessage = "御使いの端末は、GeoLocationAPIに対応していません"
  
  alert(errorMessage);
  
  document.getElementById('result').innerHTML = errorMessage;
}
