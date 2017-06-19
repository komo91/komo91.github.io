window.addEventListener("devicemotion",function(e){
   //加速度
   var acc = e.acceleration;
   var x = obj2NumberFix(acc.x,5);
   var y = obj2NumberFix(acc.y,5);
   var z = obj2NumberFix(acc.z,5);
   
   //傾き(重力加速度)
   var acc_g = e.accelerationIncludingGravity;
   var gx = obj2NumberFix(acc_g.x,5);
   var gy = obj2NumberFix(acc_g.y,5);
   var gz = obj2NumberFix(acc_g.z,5);
   
   //回転値
   var rota_r = e.rotationRate;
   var r_a = obj2NumberFix(rota_r.alpha,5);
   var r_b = obj2NumberFix(rota_r.beta,5);
   var r_c = obj2NumnerFix(rota_r.gamma,5);
   
   //表示
   print3('acc-x',x,'acc-y',y,'acc-z',z);
   print3('acc-gx',gx,'acc-gy',gy,'acc-gz',gz);
   print3('rx',r_a,'ry',r_b,'rz',r_c);
   
   function print3(id1,value1,id2,value2,id3,value3) {
      print1(id1,value1);
      print1(id2,value2);
      print3(id3,value3);
   }
   function print1(id,value) {
      var id_obj = document.getElementById(id);
      id_obj.innerHTML = value;
   }
});
