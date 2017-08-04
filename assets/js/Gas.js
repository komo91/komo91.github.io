//jQuery

var lat, //緯度,
    lng, //経度
    accLatlng; //緯度・経度の精度

var myPosition,  //現在地地点
    watchId;
var marker = [];  //登録位置情報
var CirclePoint = []; //位置範囲設定

var V_text = '';


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
    name: 'University',
    lat: 35.6259947,
    lng: 139.2785662,
    radius: 20,
    message: "研究室前"
  }, {
    name: 'Takaosanguchi_Station',
    lat: 35.632489,
    lng: 139.269910,
    radius: 35,
    message: "高尾山口駅ですよ"
  }, {
    name: 'Takao_CableCar',
    lat: 35.631106,
    lng: 139.256226,
    radius: 30,
    message: "ケーブルカー高尾山駅ですよ"
  }, {
    name: 'Gongen_Chaya',
    lat: 35.627434,
    lng: 139.250309,
    radius: 20,
    message: "権現茶屋ですよ"
  }, {
    name: 'Takao_Peak',
    lat: 35.625123,
    lng: 139.243657,
    radius: 15,
    message: "高尾山山頂ですよ"
  }, {
    name: 'VisitorCenter',
    lat: 35.625003,
    lng: 139.243245,
    radius: 10,
    message: "高尾ビジターセンターですよ"
  }, {
    name: 'Takao_599Museum',
    lat: 35.630442,
    lng: 139.268698,
    radius: 25,
    message: "高尾599ミュージアムですよ"
  }

function GPS_measure() {
  //GeoLocationAPI対応
  if(navigator.geolocation) {
    //GasRequest(1);
    //現在地測定成功の場合
    function successFunc( position ) {
      var data = position.coords;
      lat = data.latitude;
      lng = data.longitude;
      accLatlng = data.accuracy;

      //時間カウント
      ++syncerWatchPosition.count;
      var nowTime = ~~(new Date() / 1000);

      //3秒後に表示変更
      if((syncerWatchPosition.lastTime + 3) > nowTime) {
        return false;
      }
      syncerWatchPosition.lastTime = nowTime;

      //divにて結果表示
      document.getElementById('result').innerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng + '</dd></dl>';

      //現在地宣言
      myPosition = new google.maps.LatLng(
        {
          lat: lat,
          lng: lng
        });

      if(syncerWatchPosition.map == null) { //新規Map作成
        syncerWatchPosition.map = new google.maps.Map(document.getElementById('map-canvas'), {
          zoom: 18,
          center: myPosition,
        });

        inputMarker();  //マーカー作成

        syncerWatchPosition.marker = new google.maps.Marker({ //新規マーカー作成
          map: syncerWatchPosition.map,
          position: myPosition
        });

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
}

function decision() { //目的地判定
  for(var j = 1; j < CheckData.length; j++) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition,marker[j].position);
    if(CirclePoint[j].radius　>　distance) {
      alert(CheckData[j]['message']);
      navigator.geolocation.clearWatch(watchId);
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
      radius: CheckData[i]['radius']
    };

    var Cir = new google.maps.Circle(CirclePoint[i]); //範囲円表示
    syncerWatchPosition.map.fitBounds(Cir.getBounds()); //地図ビューポート修正

  }
}
function decision() { //目的地判定
  for(var j = 1; j < CheckData.length; j++) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition,marker[j].position);
    if(CirclePoint[j].radius　>　distance) {
      //PushTest(j);
      Speech(j);
      GasRequest(j);
      alert(CheckData[j]['message']);
      //var hoge =  google.script.run.withSuccessHandler(test).Takao_Info_XML();
      navigator.geolocation.clearWatch(watchId);
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
      radius: CheckData[i]['radius']
    };

    var Cir = new google.maps.Circle(CirclePoint[i]); //範囲円表示
    syncerWatchPosition.map.fitBounds(Cir.getBounds()); //地図ビューポート修正
  }
}

function Speech(num) {  //目的地音声案内
  var ssu = new SpeechSynthesisUtterance(); //
  ssu.text = CheckData[num]['message'];  //現在地の名称
  ssu.lang = 'ja-JP';
  speechSynthesis.speak(ssu); //
}

function GasRequest(num) { //GASに指定の値をJSONにて送信
  var script = document.createElement('script');  //scriptタグ生成
  var base = 'https://script.google.com/macros/s/AKfycbw8gy8khaOVo2PBOnR6BasMOC7pquNXj3nOTggRNYLb-psD2xnQ/exec';
  script.src = base + '?callback=receiveJson&action=' + CheckData[num]['name'];
  document.body.appendChild(script);  //bodyにscript追加
  console.log(script.src);
}

function receiveJson(json) {  //GASから返った値を表示させる
  document.getElementById('result_test').innerHTML = json.response;
  if(!json.response){
    return null;
  }
}
