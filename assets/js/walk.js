var GRAVITY_MIN = 9.8;
var GRAVITY_MAX = 12.00;

var step = 0;

var hoge = false;

/*
function initalize() {
  window.addEventListener('devicemotion',onDeviceMotion);
}
*/

window.addEventListener('devicemotion',onDeviceMotion);

function onDeviceMotion(e) {
  e.preventDefault();

  var ag = e.accelerationIncludingGravity;

  var acc = Math.sqrt(ag.x*ag.x + ag.y*ag.y + ag.z*ag.z);

  if(hoge) {
    if(acc < GRAVITY_MIN) {
      step++;
      hoge = false;
    }
  } else {
    if(acc > GRAVITY_MAX) {
      hoge = true;
    }
  }
  console.log(step + "歩");
  document.getElementById('meter').innerHTML = step + "歩";
  GAS_log(ag,acc,hoge,step);
}

function GAS_log() {
  var script = document.createElement('script');
  var base = 'https://script.google.com/macros/s/AKfycbywGjrfpRlSSfyyePUUDrJl_SeQIESZCw0ZjaHi0eFAJNdsdDs/exec';
  script.src = base + '?callback=receiveJson&ag=' + ag + '&acc=' + acc + '&isStep=' + hoge + '&step' + step;
  document.body.appendChild(script);
}

function receiveJson(json) {
  console.log(json);
}
