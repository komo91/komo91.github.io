var lat, //緯度,
    lng, //経度
    accLatlng, //緯度・経度の精度
    myPosition,  //現在地地点
    watchId,
    marker = [],  //登録位置情報
    CirclePoint = [], //位置範囲設定
    CheckPoint = false;

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
  }, {
    name: 'Cafe',
    lat: 35.624922,
    lng: 139.281390,
    radius: 20,
    message: "Grand E'terna Caf'eですって"
  }
];

//GeoLocationAPI対応
if(navigator.geolocation) {
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
      navicheck();

      syncerWatchPosition.marker = new google.maps.Marker({ //新規マーカー作成
        map: syncerWatchPosition.map,
        position: myPosition
      });

    } else {
      syncerWatchPosition.map.setCenter(myPosition);  //地図中心変更
      LogPost(myPosition);
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
    //現在地から目的地点までの距離
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition,marker[j].position);
    if(CirclePoint[j].radius　>　distance && CheckPoint==false) {  //範囲円に現在地点に入った場合
      PushTest(j);
      GasRequest(j);
      LogPost(CheckData[j]['name']);
      alert(CheckData[j]['message']);
      CheckPoint = true;
      console.log(CheckPoint);
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

function Speech(text) {  //指定されたテキスト内容を喋らす
  var ssu = new SpeechSynthesisUtterance(); //
  ssu.text = text;  //
  ssu.lang = 'ja-JP';
  //ssu.rate = 2;
  speechSynthesis.speak(ssu); //
}

function PushTest(num) {	//通知機能
	Push.Permission.request();	//通知許可
	Push.create(CheckData[num]['message'],{	//通知情報
		body: "詳しくはコチラ!",
		icon: 'assets/img/mountain_icon.png',
		timeout: 10000,
		vibrate: [200,100,200,100,200,100,200],	//バイブレーションのパターン
		link: "https://komo91.github.io/PushTest.html",
		onClick: function (){	//クリック時
			console.log("Fired!");
			window.focus();	//windowsを最前列移動
			this.close();	//通知を閉じる
		},
	});
}

function GasRequest(num) { //GASに指定の値をJSONにて送信
  var script = document.createElement('script');  //scriptタグ生成
  var base = 'https://script.google.com/macros/s/AKfycbw8gy8khaOVo2PBOnR6BasMOC7pquNXj3nOTggRNYLb-psD2xnQ/exec';
  script.src = base + '?callback=receiveJson&action=' + CheckData[num]['name'];
  document.body.appendChild(script);  //bodyにscript追加
  console.log(script.src);
}

function receiveJson(json) {  //GASから返った値を表示させる
  document.getElementById('gas_result').innerHTML = json.response;
  //研究室
  if(json.spot==CheckData[1]['name']) { //研究室
    var text = json.response[0] + "時現在の天気は" + json.response[1] + ",気温は" + json.response[2] + "度,湿度は" + json.response[3] + "%となっています";
    Speech(text);
  } else if(json.spot==CheckData[2]['name']) {  //高尾山口駅
    var text = '高尾山口駅から登る際には' + json.response[0] + 'と' + json.response[11] + 'と' + json.response[13] + 'の３つのコースから選べます';
    Speech(text);
  } else if(json.spot==CheckData[3]['name']) {  //ケーブルカー高尾駅
    var text = '本日の運行時間は' + json.response[0] + ',' + json.response[1];
    Speech(text);
  } else if(json.spot==CheckData[4]['name']) {  //権現茶屋
    var text = '権現茶屋のおすすめメニューは' + json.response + 'となってます';
    Speech(text);
  } else if(json.spot==CheckData[5]['name']) {  //高尾山山頂
    var text = json.response;
    Speech(text);
  } else if(json.spot==CheckData[6]['name']) {  //高尾ビジターセンター
    var text = json.response;
    Speech(text);
  } else if(json.spot==CheckData[7]['name']) {  //高尾599ミュージアム
    var text = 'ミュージアムからのお知らせは' + json.response[0] + 'です。詳しくは本施設まで';
    Speech(text);
  } else if(json.spot==CheckData[8]['name']) {
    var text = json.response + 'に着きました';
    Speech(text);
  }
  if(!json.response){ //responseなし
    document.getElementById('result_test').innerHTML = json.error;
  }
}

function LogPost(text) {
  var script = document.createElement('script');
  var base = 'https://script.google.com/macros/s/AKfycbyABjS6CnXqSuqoYTFga7_mLjI2Z_rMjseJZ_RS3nXVy90u920/exec';
  var os = navigator.platform;
  console.log(os);
  script.src = base + '?log=' + encodeURI(text) + '&os=' + os;
  document.body.appendChild(script);
  console.log(script.src);
}

function navicheck() {
  var os = navigator.platform;
  console.log(os);
  var ua = navigator.userAgent.toLowerCase();
  console.log(ua);
  var ver = navigator.appVersion.toLowerCase();
  console.log(ver);
}
