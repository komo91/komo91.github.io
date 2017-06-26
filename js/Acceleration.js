window.addEventListener("devicemotion",function(e){
   //加速度
   var acc = e.acceleration;
   var x = obj2NumberFix(acc.x,2);
   var y = obj2NumberFix(acc.y,2);
   var z = obj2NumberFix(acc.z,2);
   
   //傾き(重力加速度)
   var acc_g = e.accelerationIncludingGravity;
   var gx = obj2NumberFix(acc_g.x,2);
   var gy = obj2NumberFix(acc_g.y,2);
   var gz = obj2NumberFix(acc_g.z,2);
   
   //回転値
   var rota_r = e.rotationRate;
   var r_a = obj2NumberFix(rota_r.alpha,2);
   var r_b = obj2NumberFix(rota_r.beta,2);
   var r_c = obj2NumberFix(rota_r.gamma,2);
   
   function obj2NumberFix(obj,fix_deg) {
      return Number(obj).toFixed(fix_deg);
   }
   
   if(x>=5) {
      alert("歩きスマホダメゼッタイ!");
      var result = document.getElementById('result');
	  result.innerHTML = x;
   }
   
   //表示
   print_3('acc-x',x,'acc-y',y,'acc-z',z);
   print_3('acc-gx',gx,'acc-gy',gy,'acc-gz',gz);
   print_3('rx',r_a,'ry',r_b,'rz',r_c);
   
//    function print_3(id1,value1,id2,value2,id3,value3) {
      print_1(id1,value1);
      print_1(id2,value2);
      print_1(id3,value3);
   }
   function print_1(id,value) {
      var id_obj = document.getElementById(id);
      id_obj.innerHTML = value;
   }
});
