$(function() {
		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp&appid=3a156601bcf00db6fb13850feabc0b53',
      cache: false,
			success: function(data) {
				//var img = document.createElement('img');
        //img.src = "http://openweathermap.org/img/w" + data.weather[0].icon + ".png";
        //img.alt = data.weather[0].main;
        //document.getElementById('icon').appendChild(img);

        document.getElementById('temp').innerHTML = Math.floor(data.main.temp -273.15);

        document.getElementById('temp2').innerHTML = Math.floor(data.main.temp_min - 273.15);

        document.getElementById('temp3').innerHTML = Math.floor(data.main.temp_max - 273.15);

        document.getElementById('here').innerHTML = data.name;

        document.getElementById('pressure').innerHTML = data.main.pressure;

			}
		});

    setInterval(function(){
      var date = new Date();
      var tine;
      time = date.getFullYear() + ',' + (date.getMonth()+1) + ',' + date.getHours() + ',' + date.getMinutes() + ',' + date.getSeconds();
      document.getElementById('currenttime').innerHTML = time;
    },1000)
	});
