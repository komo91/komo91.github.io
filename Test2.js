var lat //緯度
var lng //経度
var alt //高度
var accLatlng //緯度・経度の精度
var accAlt  //高度の精度
var heading //方角
var speed //速度

var myPosition
var marker = [];
var CirclePoint = [];

//動的情報取得データ
var syncerWatchPosition = {
  count: 0,
  lastTime: 0,
  map: null,
  marker: null,
};

var CheckData = [ //位置情報配列
  {
    name: '仮地点',
    lat: 35.6382236,
    lng: 139.3020877
  }, {
    name: '神社近く',
    lat: 35.6387688,
    lng: 139.3030753
  }, {
    name: 'ドンキ',
    lat: 35.63836704,
    lng: 139.30648098
  }, {
    name: '元セブン',
    lat: 35.63781429,
    lng: 139.30421229
  }, {
    name: 'アルプス',
    lat: 35.63805769,
    lng: 139.30061043
  }, {
    name: '大学',
    lat: 35.6259947,
    lng: 139.2785662
  }
];

//周囲判定円
var CirclePoint;


//GeoLocationAPI対応
if(navigator.geolocation) {
  //現在地測定成功の場合
  function successFunc( position ) {
    var data = position.coords;
    
    lat =  35.6259947 //data.latitude;
    lng =  139.2785662 //data.longitude;
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

    //myPosition = new google.maps.LatLng(lat,lng);
    myPosition = {lat: 35.6259947,lng: 139.2785662};
      
    if(syncerWatchPosition.map == null) {
      syncerWatchPosition.map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 18,
        center: myPosition,
      });
      
      inputMarker();
      
    } else {
      syncerWatchPosition.map.setCenter(myPosition);
      syncerWatchPosition.marker.setPosition(myPosition);
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

    alert(errorMessage);
    console.log("test3");

    document.getElementById("result").innerHTML = errorMessage;

  }

  //オプション
  var optionObj = {
    "enableHighAccuracy": false,
    "timeout": 8000,
    "maximumAge": 2000,
  };
} else {
  var errorMessage = "御使いの端末は、GeoLocationAPIに対応していません"

  alert(errorMessage);

  document.getElementById('result').innerHTML = errorMessage;
}
  
var watchId = navigator.geolocation.watchPosition( successFunc, errorFunc, optionObj );


function decision() {
  if(CheckData[0] == myPosition) {
    alert("この場所は地点Aです");
  } else if(CheckData[1] == myPosition) {  
    alert("この地点は神社近くです");
  } else if(CheckData[2] == myPosition) { 
    alert("この地点はドンキ前です");
  } else if(CheckData[3] == myPosition) {  
    alert("この地点は元セブン前です");
  } else if(CheckData[4] == myPosition) {  
    alert("この地点はアルプス前です");
  } else if(CheckData[5] == myPosition) { //テスト
    alert("円の中");
    test(5);
    navigator.geolcation.clearWatch(watchId);
  }
  
}

function inputMarker() {
  for(var i = 0; i < CheckData.length; i++) {
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
    CirclePoint[i] = {
      center: new google.maps.LatLng(CheckData[i]['lat'],CheckData[i]['lng']),
      map: syncerWatchPosition.map,
      radius: 10
    };
    
    var Cir = new google.maps.Circle(CirclePoint[i]);
    syncerWatchPosition.map.fitBounds(Cir.getBounds());
    console.log(CheckData[i]['lat'],CheckData[i]['lng']);
  }
}

function test(i) {
  var distance = Math.hypot(CheckData[i]['lat'] - lat,CheckData[i]['lng'] - lng);
  console.log(distance);
}
