var lat, //緯度,
    lng, //経度
    accLatlng, //緯度・経度の精度
    myPosition,  //現在地地点
    watchId,  //
    marker = [],  //登録位置情報
    CirclePoint = [], //位置範囲設定
    CheckPoint = [];  //到達判定

//加速度判定
var GRAVITY_MIN = 9.8;
var GRAVITY_MAX = 12.0;
var isStep = false,
    step = 0,
    Time_last = 0;
var timeId;

//動的情報取得データ
var syncerWatchPosition = {
  count: 0,
  lastTime: 0,
  map: null,
  marker: null,
};

var CheckData ={
  name: '現在地',
  lat: lat,
  lng: lng
};

//加速度処理
window.addEventListener('devicemotion',onDeviceMotion);

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
    document.getElementById('result').innerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng + '</dd><dt>実行回数</dt><dd>' + syncerWatchPosition.count + '</dd></dl>';

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

      //新規マーカー作成
      syncerWatchPosition.marker = new google.maps.Marker({
        map: syncerWatchPosition.map,
        position: myPosition
      });
      GasRequest('CheckData');  //spot情報要求
      warning_view('sub');  //警告表示描画
    } else {
      syncerWatchPosition.map.setCenter(myPosition);  //地図中心変更
      LogPost(myPosition);
    }
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
  for(var i = 0; i < spotData.length; i++) {
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

    CheckPoint[i] = false;  //未到達判定
    var Cir = new google.maps.Circle(CirclePoint[i]); //範囲円表示
    syncerWatchPosition.map.fitBounds(Cir.getBounds()); //地図ビューポート修正
  }
}

//目的地判定
function decision() {
  for(var j = 0; j < spotData.length; j++) {
    //現在地から目的地点までの距離
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition,marker[j].position);
    if(CirclePoint[j].radius > distance && CheckPoint[j]==false) {  //範囲円に現在地点に入った かつ 一度も到達してない場合
      GasRequest(spotData[j][0]); //スポットごとの外部サイトアクセス
      LogPost(spotData[j][0]);  //スポット到達ログ送信

      CheckPoint[j] = true; //一度到達した判定

    }
  }
}

/* ----- 提供設定 ----- */

//指定されたテキスト内容を喋らす
function Speech(text) {
  var ssu = new SpeechSynthesisUtterance();
  window.speechSynthesis.onvoiceschanged = function() {
    ssu.volume = 1.0;
    ssu.rate = 0.7;
    ssu.pitch = 1.1;
    ssu.text = text;
    ssu.lang = 'ja-JP';
    speechSynthesis.speak(ssu);
  };
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
  //スポットデータ取得
  if(json.key=='spot') {
    spotData = new Array();
    for(var i = 0; i < json.response.length; i++) {
      spotData.push(json.response[i]);
    }
    inputMarker();
    decision();
  }
  //取得情報反映
  for(var i = 0; i < spotData.length; i++) {
    if(json.key==spotData[i][0]) {
      Audio();  //通知音
      spot_alert(spotData[i][4],json.response[0]);  //アラート表示
      document.getElementById('gas_result').innerHTML = json.response[0]; //取得内容書き出し
      //URL反映
      var a = document.createElement('a');
      a.href = json.response[1];
      var str = document.createTextNode('URL');
      a.appendChild(str);
      document.getElementById('gas_url').appendChild(a);
      //画像反映
      if(json.response[2]) {
        var b = document.createElement('img');
        b.src = json.response[2];
        document.getElementById('gas_img').appendChild(b);
      }
    }
  }
  if(!json.response){
    document.getElementById('gas_result').innerHTML = json.error;
  }
}

/* ----- Log記録 ----- */

//GASに指定値をpost
function LogPost(text) {
  var script = document.createElement('script');
  var base = 'https://script.google.com/macros/s/AKfycbyABjS6CnXqSuqoYTFga7_mLjI2Z_rMjseJZ_RS3nXVy90u920/exec';
  var user = navicheck();
  var browser = browserCheck();
  script.src = base + '?callback=return_hoge&log=' + encodeURI(text) + '&user=' + user + '&browser=' + browser;
  document.body.appendChild(script);
}

function return_hoge(json) {}

//端末情報
function navicheck() {
  var ua = window.navigator.userAgent.toLowerCase();
  //console.log(ua);
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

//加速度計算
function obj2NumberFix(obj,fix_deg) {
  return Number(obj).toFixed(fix_deg);
}

//レイヤー作成
function warning_view(id) {
  var tar = document.getElementById(id);

  var a_height = Math.max(document.body.clientHeight,document.body.scrollHeight);
  var b_height = Math.max(document.documentElement.scroollheight,document.documentElement.clientHeight);
  var max_height = Math.max(a_height,b_height);
  tar.style.height - max_height + 'px';

  var a_width = Math.max(document.body.clientWidth,document.body.scrollWidth);
  var b_width = Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth);
  var max_width = Math.max(a_width,b_width);
  tar.style.width = max_width + 'px';
}

//アラート表示
function spot_alert(num,json) {
  swal({
    title: "スポット到達",
    text: num,
    type: "success"
  },function(){
    Speech(json);
  });
}

//通知音取得
function Audio() {
  //AudioNodeの管理
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //音声URL設定
  var Loader = function(url) {
    this.url = url;
  };

  //XMLHttpRequestにて音声データ読み込み
  Loader.prototype.loadBuffer = function() {
    var loader,request;
    loader = this;  //音声URL
    request = new XMLHttpRequest(); //XMLHttpRequest
    request.open('GET',this.url,true);  //リクエスト内容
    request.responseType = 'arraybuffer'; //必要データ値

    request.onload = function() { //リクエストロード時
      audioCtx.decodeAudioData(this.response,function(buffer) {
        if(!buffer) {
          console.log('error');
          return;
        }
        loader.playSound(buffer); //音声再生
      });
    };

    request.onerror = function() {  //リクエストエラー時
      console.log('Loader: XHR error');
    };
    request.send(); //リクエスト送信
  };

  //音声データの再生
  Loader.prototype.playSound = function(buffer) {
    var sourceNode = audioCtx.createBufferSource(); //サウンドSource
    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.0;
    sourceNode.buffer = buffer;                     //再生サウンド設定
    sourceNode.connect(gainNode);       //connectにAudioNodeの値
    gainNode.connect(audioCtx.destination);
    sourceNode.start(0);                            //0秒後に再生
  };

  var loader = new Loader('assets/mp/1.mp3'); //音声データ元
  loader.loadBuffer();
}

//歩数測定・歩きスマホ判定
function onDeviceMotion(e) {
  e.preventDefault();
  var ag = e.accelerationIncludingGravity;
  var acc = Math.sqrt(ag.x*ag.x + ag.y*ag.y + ag.z*ag.z);

  if(isStep) {
    //document.getElementById('sub').style.visibility = "visible";
    if(acc < GRAVITY_MIN) {
      step++;
      view_hoge();
    }
    isStep = false;
  } else {
    if(acc > GRAVITY_MAX) {
      isStep = true;
    }
  }
  document.getElementById('hoge').innerHTML = step + "歩";
}

  //歩行状態ではないかつ歩行停止1秒後
function view_hoge() {
  document.getElementById('sub').style.visibility = "visible";
  timerId = setTimeout(1000);
}

function exhoge() {
  if(isStep) {
    view_hoge();
  } else {
    document.getElementById('sub').style.visibility = "hidden";
    clearTimeout(timerId);
  }
}
