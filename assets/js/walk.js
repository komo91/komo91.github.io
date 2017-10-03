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
}
