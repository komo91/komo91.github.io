var lat //緯度
var lng //経度
var alt //高度
var accLatlng //緯度・経度の精度
var accAlt  //高度の精度
var heading //方角
var speed //速度

//var myPosition  //現在地地点
var marker = [];  //登録位置情報
var CirclePoint = []; //位置範囲設定

//動的情報取得データ
var syncerWatchPosition = {
  count: 0,
  lastTime: 0,
  map: null,
  marker: null,
};

var CheckData = [ //位置情報配列
  {
    name: '現在地',
    lat: lat,
    lng: lng
  }, {
    name: '仮地点',
    lat: 35.6382236,
    lng: 139.3020877,
    message: "この場所は地点Aです"
  }, {
    name: '神社近く',
    lat: 35.6387688,
    lng: 139.3030753,
    message: "この地点は神社近くです"
  }, {
    name: 'ドンキ',
    lat: 35.63836704,
    lng: 139.30648098,
    message: "この地点はドンキ前です"
  }, {
    name: '元セブン',
    lat: 35.63781429,
    lng: 139.30421229,
    message: "この地点は元セブン前です"
  }, {
    name: 'アルプス',
    lat: 35.63805769,
    lng: 139.30061043,
    message: "この地点はアルプス前です"
  }, {
    name: '大学',
    lat: 35.6259947,
    lng: 139.2785662,
    message: "研究室前"
  }
];

//GeoLocationAPI対応
if(navigator.geolocation) {
  //現在地測定成功の場合
  function successFunc( position ) {
    var data = position.coords;
    
    lat = data.latitude;
    lng = data.longitude;
    alt = data.altitude;
    accLatlng = data.accuracy;
    accAlt = data.altitudeAccuracy;
    heading = data.heading;
    speed = data.speed;
    
    ++syncerWatchPosition.count;
    var nowTime = ~~(new Date() / 1000);
      
    if((syncerWatchPosition.lastTime + 3) > nowTime) {
      return false;
    }
      
    syncerWatchPosition.lastTime = nowTime;
      
    //document.getElementById('result1').innerHTML = '<dl><dt>現在地</dt><dd>' + lat + ',' + lng '</dd></dl>'

    //divにて結果表示
    document.getElementById('result').innerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>高度</dt><dd>' + alt + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng + '</dd><dt>高度の精度</dt><dd>' + accAlt + '</dd><dt>方角</dt><dd>' + heading + '</dd><dt>速度</dt><dd>' + speed + '</dd></dl>';

    var myPosition = new google.maps.latlng(lat,lng);
    
    if(syncerWatchPosition.map == null) { //新規Map作成
      syncerWatchPosition.map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: myPosition,
      });
      
      syncerWatchPosition.marker = new google.maps.Marker({ //新規マーカー作成
        map: syncerWatchPosition.map,
        position: myPosition
      });
      
      //inputMarker();
      
    } else {
      syncerWatchPosition.map.setCenter(myPosition);  //地図中心変更
      syncerWatchPosition.marker.setPosition(myPosition); //現在地マーカー変更
    } 
    decision();
  }

  //現在地測定失敗の場合
  function errorFunc(error)
  {
    var errorInfo = [
      "原因不明のエラー", //0
      "位置情報取得許可されない", //1
      "電波状況で位置情報取得できず", //2
      "タイムアウト"  //3
    ];

    var errorNo = error.code;

    var errorMessage = "[エラー番号:" + errorNo + "]\n" + errorInfo[errorNo];

    //alert(errorMessage);

    document.getElementById("result").innerHTML = errorMessage;

  }

  //オプション
  var optionObj = {
    "enableHighAccuracy": false,
    "timeout": 10000,
    "maximumAge": 0,
  };
} else {
  var errorMessage = "御使いの端末は、GeoLocationAPIに対応していません"

  alert(errorMessage);

  document.getElementById('result').innerHTML = errorMessage;
}
  
var watchId = navigator.geolocation.watchPosition( successFunc, errorFunc, optionObj ); //追跡中止


function decision() { //目的地判定
  for(var j = 0; j < CheckData.length; j++) {
    var distance = Math.hypot(CheckData[6]['lat'] - lat,CheckData[6]['lng'] - lng);
    if(distance < CirclePoint[6].radius) {
      alert(CheckData[6]['message']);
    }
  }
}


function inputMarker() {  //マーカー・目的地範囲設定・作成
  for(var i = 1; i < CheckData.length; i++) {
    var MarkerLatLng = new google.maps.LatLng(  //緯度経度データ作成
      {
        lat: CheckData[i]['lat'],
        lng: CheckData[i]['lng']
      });
    marker[i] = new google.maps.Marker( //マーカー追加
      {
        position: MarkerLatLng,
        map: syncerWatchPosition.map
      });
    CirclePoint[i] = {  //目的地範囲円設定
      center: new google.maps.LatLng(CheckData[i]['lat'],CheckData[i]['lng']),
      map: syncerWatchPosition.map,
      radius: 10
    };
    
    var Cir = new google.maps.Circle(CirclePoint[i]); //範囲円表示
    syncerWatchPosition.map.fitBounds(Cir.getBounds()); //地図ビューポート修正
    //console.log(CheckData[i]['lat'],CheckData[i]['lng']);
    
  }
}


