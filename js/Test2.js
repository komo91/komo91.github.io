var lat; //緯度
var lng; //経度
var alt; //高度
var accLatlng; //緯度・経度の精度
var accAlt;  //高度の精度
var heading; //方角
var speed; //速度

var myPosition;  //現在地地点
var marker = [];  //登録位置情報
var CirclePoint = []; //位置範囲設定
var watchId;

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
  },{
    name: '大学',
    lat: 35.6259947,
    lng: 139.2785662,
    radius: 20,
    message: "研究室前"
  }, {
    name: '高尾山口駅',
    lat: 35.632489,
    lng: 139.269910,
    radius: 35,
    message: "高尾山口駅ですよ"
  }, {
    name: '清滝駅',
    lat: 35.631079,
    lng: 139.266788,
    radius: 20,
    message: "ロープウェイ清滝駅ですよ"
  }, {
    name: '山上駅',
    lat: 35.632475,
    lng: 139.257566,
    radius: 20,
    message: "ロープウェイ山上駅ですよ"
  }, {
    name: 'ケーブルカー高尾山駅',
    lat: 35.631106,
    lng: 139.256226,
    radius: 30,
    message: "ケーブルカー高尾山駅ですよ"
  }, {
    name: '十一丁目茶屋',
    lat: 35.630254,
    lng: 139.255414,
    radius: 20,
    messsage: "十一丁目茶屋ですよ"
  },{
    name: '権現茶屋',
    lat: 35.627434,
    lng: 139.250309,
    radius: 20,
    message: "権現茶屋ですよ"
  },{
    name: 'もみじや',
    lat: 35.626204,
    lng: 139.250899,
    radius: 20,
    message: "もみじやですよ"
  },{
    name: '高尾山薬王院',
    lat: 35.625807,
    lng: 139.249408,
    radius: 60,
    message: "薬王院ですよ"
  }, {
    name: '山頂前トイレ',
    lat: 35.625722,
    lng: 139.244564,
    radius: 20,
    message: "山頂前トイレですよ"
  },{
    name: '高尾山山頂',
    lat: 35.625123,
    lng: 139.243657,
    radius: 15,
    message: "高尾山山頂ですよ"
  }, {
    name: '曙亭',
    lat: 35.624817,
    lng: 139.243261,
    radius: 10,
    message: "曙亭(蕎麦屋)ですよ"
  }, {
    name: '高尾ビジターセンター',
    lat: 35.625003,
    lng: 139.243245,
    radius: 10,
    message: "高尾ビジターセンターですよ"
  },{
    name: 'やまびこ茶屋',
    lat: 35.625507,
    lng: 139.243756,
    radius: 15,
    message: "やまびこ茶屋ですよ"
  }, {
    name: '高尾599ミュージアム',
    lat: 35.630442,
    lng: 139.268698,
    radius: 25,
    message: "高尾599ミュージアムですよ"
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
    
    //時間カウント
    ++syncerWatchPosition.count;
    var nowTime = ~~(new Date() / 1000);
    
    //3秒後に表示変更
    if((syncerWatchPosition.lastTime + 3) > nowTime) {
      return false;
    }
      
    syncerWatchPosition.lastTime = nowTime;
      
    //document.getElementById('result1').innerHTML = '<dl><dt>現在地</dt><dd>' + lat + ',' + lng '</dd></dl>'

    //divにて結果表示
    document.getElementById('result').innerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>高度</dt><dd>' + alt + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng + '</dd><dt>高度の精度</dt><dd>' + accAlt + '</dd><dt>方角</dt><dd>' + heading + '</dd><dt>速度</dt><dd>' + speed + '</dd></dl>';

    //現在地宣言
    myPosition = new google.maps.LatLng(
      {
        lat: lat,
        lng: lng
      });
    
    if(syncerWatchPosition.map == null) { //新規Map作成
      syncerWatchPosition.map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 17,
        center: myPosition,
      });
      
      //inputMarker();  //マーカー作成
      
      syncerWatchPosition.marker = new google.maps.Marker({ //新規マーカー作成
        map: syncerWatchPosition.map,
        position: myPosition
      });
      
      syncerWatchPosition.map.setCenter(myPosition);  //地図中心変更
      
    } else {
      syncerWatchPosition.map.setCenter(myPosition);  //地図中心変更
    } 
    decision(); //目的地判定
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

watchId = navigator.geolocation.watchPosition( successFunc, errorFunc, optionObj );

function decision() { //目的地判定
  for(var j = 1; j < CheckData.length; j++) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition,marker[j].position);
    if(CirclePoint[j].radius　>　distance) {
      alert(CheckData[j]['message']);
      navigator.geolocation.clearWatch(watchId);
    }
    //console.log(distance);
    //console.log("[" + [j] + "]" + CirclePoint[j].radius);
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
      radius: CheckData[i]['radius']
    };
    
    var Cir = new google.maps.Circle(CirclePoint[i]); //範囲円表示
    syncerWatchPosition.map.fitBounds(Cir.getBounds()); //地図ビューポート修正
    //console.log(CheckData[i]['lat'],CheckData[i]['lng']);
    
  }
}
