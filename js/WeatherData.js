/*
$(function() {
	$.ajax({
	url: 'http://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp&appid=3a156601bcf00db6fb13850feabc0b53',
	cache: false,
	success: function(data) {
	//var img = document.createElement('img');
        //img.src = "http://openweathermap.org/img/w" + data.weather[0].icon + ".png";
        //img.alt = data.weather[0].main;
        //document.getElementById('icon').appendChild(img);

	//気温
        document.getElementById('temp').innerHTML = Math.floor(data.main.temp -273.15);

	//最低気温
        document.getElementById('temp2').innerHTML = Math.floor(data.main.temp_min - 273.15);

	//最高気温
        document.getElementById('temp3').innerHTML = Math.floor(data.main.temp_max - 273.15);

	//地点
        document.getElementById('here').innerHTML = data.name;

	//気圧
        document.getElementById('pressure').innerHTML = data.main.pressure;

			}
		});

    //時刻表示
    setInterval(function(){
      var date = new Date();
      var tine;
      time = date.getFullYear() + ',' + (date.getMonth()+1) + ',' + date.getHours() + ',' + date.getMinutes() + ',' + date.getSeconds();
      document.getElementById('currenttime').innerHTML = time;
    },1000)
	});
*/

var result = document.evaluate('/html/attribute::lang',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null);

var kekka = result.singleNodeValue;
console.log(kekka);
