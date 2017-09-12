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

var CheckData =
  {
    name: '現在地',
    lat: lat,
    lng: lng
  };
var spotData = [];

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
      LogPost(myPosition);

    if(syncerWatchPosition.map == null) { //新規Map作成
      syncerWatchPosition.map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 18,
        center: myPosition,
      });
      GasRequest('CheckData');

      inputMarker();
      navicheck();
      browserCheck();
      //新規マーカー作成
      syncerWatchPosition.marker = new google.maps.Marker({
        map: syncerWatchPosition.map,
        position: myPosition
      });

    } else {
      syncerWatchPosition.map.setCenter(myPosition);  //地図中心変更
      LogPost(myPosition);
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

/* ----- Map設定 ----- */

//マーカー・目的地範囲設定・作成
function inputMarker() {
  for(var i = 1; i < spotData.length; i++) {
    var MarkerLatLng = new google.maps.LatLng(  //緯度経度データ作成
      {
        lat: spotData[i][1],
        lng: spotData[i][2]
      });
    marker[i] = new google.maps.Marker( //マーカー追加
      {
        position: MarkerLatLng,
        map: syncerWatchPosition.map
      });
    CirclePoint[i] = {  //目的地範囲円設定
      center: new google.maps.LatLng(spotData[i][1],spotData[i][2]),
      map: syncerWatchPosition.map,
      radius: spotData[i][3]
    };

    var Cir = new google.maps.Circle(CirclePoint[i]); //範囲円表示
    syncerWatchPosition.map.fitBounds(Cir.getBounds()); //地図ビューポート修正

  }
}

//目的地判定
function decision() {
  for(var j = 1; j < spotData.length; j++) {
    //現在地から目的地点までの距離
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition,marker[j].position);
    if(CirclePoint[j].radius > distance && CheckPoint==false) {  //範囲円に現在地点に入った場合
      PushTest(j);
      GasRequest(j);
      LogPost(spotData[j][0]);
      alert(spotData[j][4]);
      CheckPoint = true;
      console.log(CheckPoint);
      navigator.geolocation.clearWatch(watchId);
    }
  }
}

/* ----- 提供設定 ----- */

//指定されたテキスト内容を喋らす
function Speech(text) {
  var ssu = new SpeechSynthesisUtterance(); //
  ssu.text = text;  //
  ssu.lang = 'ja-JP';
  ssu.volume = 1;
  //ssu.rate = 2;
  speechSynthesis.speak(ssu); //
}

//通知機能
function PushTest(num) {
	Push.Permission.request();	//通知許可
	Push.create(spotData[num][4],{	//通知情報
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

/* ----- GAS設定 ----- */

//GASに指定の値をJSONにて送信
function GasRequest(num) {
  var script = document.createElement('script');  //scriptタグ生成
  var base = 'https://script.google.com/macros/s/AKfycbw8gy8khaOVo2PBOnR6BasMOC7pquNXj3nOTggRNYLb-psD2xnQ/exec';
  script.src = base + '?callback=receiveJson&action=' + num;
  document.body.appendChild(script);  //bodyにscript追加
  console.log(script.src);
}

//GASから返った値を表示させる
function receiveJson(json) {
  document.getElementById('gas_result').innerHTML = json.response;
  var text;
  //研究室
  if(json.key==spotData[1][0]) {
    text = json.response[0] + "時現在の天気は" + json.response[1] + ",気温は" + json.response[2] + "度,湿度は" + json.response[3] + "%となっています";
  //高尾山口駅
} else if(json.key==spotData[2]['name']) {
    text = '高尾山口駅から登る際には' + json.response[0] + 'と' + json.response[11] + 'と' + json.response[13] + 'の３つのコースから選べます';
  //ケーブルカー高尾駅
  } else if(json.key==spotData[3]['name']) {
    text = '本日の運行時間は' + json.response[0] + ',' + json.response[1];
  //権現茶屋
  } else if(json.key==spotData[4]['name']) {
    text = '権現茶屋のおすすめメニューは' + json.response + 'となってます';
  //高尾山山頂
  } else if(json.key==spotData[5]['name']) {
    text = json.response;
  //高尾ビジターセンター
  } else if(json.key==spotData[6]['name']) {
    text = json.response;
  //高尾599ミュージアム
  } else if(json.key==spotData[7]['name']) {
    text = 'ミュージアムからのお知らせは' + json.response[0] + 'です。詳しくは本施設まで';
  //Cafe_学内テスト
  } else if(json.key==spotData[8]['name']) {
    text = json.response + 'に着きました';
  }
  Speech(text);
  LogPost(text);
  if(json.key==spot) {
    for(var i = 0; i < json.response.length; i++) {
      spotData = json.response[i];
    }
    console.log(spotData);
  }
  if(!json.response){
    document.getElementById('result_test').innerHTML = json.error;
  }
}

//GASに指定値をpost
function LogPost(text) {
  var script = document.createElement('script');
  var base = 'https://script.google.com/macros/s/AKfycbyABjS6CnXqSuqoYTFga7_mLjI2Z_rMjseJZ_RS3nXVy90u920/exec';
  var user = navicheck();
  var browser = browserCheck();
  script.src = base + '?log=' + encodeURI(text) + '&user=' + user + '&browser=' + browser;
  document.body.appendChild(script);
  console.log(script.src);
}

//端末情報
function navicheck() {
  var ua = window.navigator.userAgent.toLowerCase();
  console.log(ua);
  if(ua.indexOf('iphone') != -1) {
    return 'iPhone';
  } else if(ua.indexOf('ipad') != -1) {
    return 'iPad';
  } else if(ua.indexOf('android') != -1) {
    if(ua.indexOf('moblie') != -1) {
      return 'android_smart';
    } else {
      return 'android_tab';
    }
  }
}

//ブラウザ情報
function browserCheck() {
  var ua = window.navigator.userAgent.toLowerCase();

  if(ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1) {
    return 'IE';
  } else if(ua.indexOf('edge') != -1) {
    return 'Edge';
  } else if(ua.indexOf('chrome') != -1) {
    return 'chrome';
  } else if(ua.indexOf('safari') != -1) {
    return 'safari';
  } else if(ua.indexOf('firefox') != -1) {
    return 'Firefox';
  } else if(ua.indexOf('opera') != -1) {
    return 'Opera';
  } else {
    return 'other';
  }
}
