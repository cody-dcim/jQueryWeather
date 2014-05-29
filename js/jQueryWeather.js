(function($) {

	$.fn.weatherMe = function( options ) {

		var settings = $.extend({
			location: '',
			woeid: '',
			unit: 'f',
			success: function(weather){},
			error: function(message){}
		}, options);

		return this.each( function() {
			// Saving context of this for use in callback of ajax call
			var self = this;
			var now = new Date();

			// Building weather api call URI
			var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&rnd='+now.getFullYear()+now.getMonth()+now.getDay()+now.getHours()+'&diagnostics=true&callback=?&q=';
			if(options.location !== '') {
				weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="'+options.location+'" and gflags="R") and u="'+options.unit+'"';
			} else if(options.woeid !== '') {
				weatherUrl += 'select * from weather.forecast where woeid='+options.woeid+' and u="'+options.unit+'"';
			} else {
				options.error({message: "Could not retrieve weather due to an invalid location."});
				return false;
			}

			// Calling Weather API to gather data
			$.getJSON(
				encodeURI(weatherUrl),
				function(data) {
					if(data !== null && data.query !== null && data.query.results !== null && data.query.results.channel.description !== 'Yahoo! Weather Error') {
						var result = data.query.results.channel,
						    weather = {},
						    forecast,
						    compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'],
						    image404 = "https://s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";

						// Parsing Weather data from result
						weather.title = result.item.title;
						weather.temp = result.item.condition.temp;
						weather.code = result.item.condition.code;
						weather.todayCode = result.item.forecast[0].code;
						weather.currently = result.item.condition.text;
						weather.high = result.item.forecast[0].high;
						weather.low = result.item.forecast[0].low;
						weather.text = result.item.forecast[0].text;
						weather.humidity = result.atmosphere.humidity;
						weather.pressure = result.atmosphere.pressure;
						weather.rising = result.atmosphere.rising;
						weather.visibility = result.atmosphere.visibility;
						weather.sunrise = result.astronomy.sunrise;
						weather.sunset = result.astronomy.sunset;
						weather.description = result.item.description;
						weather.city = result.location.city;
						weather.country = result.location.country;
						weather.region = result.location.region;
						weather.updated = result.item.pubDate;
						weather.link = result.item.link;
						weather.units = {temp: result.units.temperature, distance: result.units.distance, pressure: result.units.pressure, speed: result.units.speed};
						weather.wind = {chill: result.wind.chill, direction: compass[Math.round(result.wind.direction / 22.5)], speed: result.wind.speed};

						// Handling display of weather data
						$(self).html(generateView(weather));

					} else {
						console.log("Error occurred obtaining weather data.");
					}
				}
			);
		});

	};

	// TODO: Create View based ond ata
	var generateView = function(weatherData) {
		var html = '';

		return html;
	};

}(jQuery));