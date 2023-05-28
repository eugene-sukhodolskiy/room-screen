let CUR_VER = "0.0";

function updateTimestamp(timeContainer, dateContainer) {
	const timestamp = new Date();
	let time = [];
	time.push(timestamp.getHours());
	time.push(timestamp.getMinutes());
	time.push(timestamp.getSeconds());
	time = time.map(i => i < 10 ? `0${i}` : i);
	timeContainer.innerHTML = time.join(":");

	let date = [];
	date.push(timestamp.getDate());
	date.push(timestamp.getMonth());
	date.push(timestamp.getFullYear());
	date = date.map(i => i < 10 ? `0${i}` : i);
	let dayName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][timestamp.getDay()];
	dateContainer.innerHTML = `${dayName}. ${(date.join("/"))}`;
}

function timestampViewer() {
	const timestampContainer = document.querySelector(".timestamp-container");
	const timeContainer = timestampContainer.querySelector(".time");
	const dateContainer = timestampContainer.querySelector(".date");

	updateTimestamp(timeContainer, dateContainer);

	setInterval(() => {
		updateTimestamp(timeContainer, dateContainer);	
	}, 1000);
}

function updateMeteo() {
	const xhr = new XMLHttpRequest();

	xhr.open("GET", "/static/meteo.html?v=" + Math.random());

	xhr.onload = () => {
		if(xhr.status != 200) {
			console.error("Error of load meteo.html");
			return;
		}

		const cont = document.createElement("DIV");
		cont.innerHTML = xhr.response;

		const realTemp = cont.querySelector(".now-weather .unit_temperature_c");
		const imaginaryTemp = cont.querySelector(".now-feel .unit_temperature_c");
		const wind = cont.querySelector(".now-info-item.wind");
		const nowDesc = cont.querySelector(".now-desc");
		const humidity = cont.querySelector(".now-info-item.humidity").childNodes[0];
		const sunrise = cont.querySelector(".now-astro-sunrise");
		const sunset = cont.querySelector(".now-astro-sunset");
		const sunsetTime = sunset.querySelector(".time").innerHTML.split(":");
		const sunriseTime = sunrise.querySelector(".time").innerHTML.split(":");

		const meteoContainer = document.querySelector(".meteo-container");
		meteoContainer.querySelector(".temp .real").innerHTML = `<span class="val">${realTemp.innerHTML}<small>C°</small></span>`;
		
		let sunState;
		if((new Date()).getHours() > parseInt(sunriseTime[0]) && (new Date()).getMinutes() > parseInt(sunriseTime[1])) {
			sunState = sunset.innerHTML;
		}
		if((new Date()).getHours() > parseInt(sunsetTime[0]) && (new Date()).getMinutes() > parseInt(sunsetTime[1])) {
			sunState = sunrise.innerHTML;
		}
		console.log(parseInt(sunriseTime[0]), (new Date()).getHours());
		// TODO: rename .imaginary -> .sunrize-sunset
		meteoContainer.querySelector(".temp .imaginary").innerHTML = sunState;
		
		meteoContainer.querySelector(".wind").innerHTML = `<span class="iconify" data-icon="mdi-weather-windy"></span> ${wind.innerHTML}`;
		meteoContainer.querySelector(".now-description").innerHTML = `${nowDesc.innerHTML}`;
		meteoContainer.querySelector(".humidity").innerHTML = `<span class="iconify" data-icon="mdi-water-outline"></span> ${humidity.innerHTML}`;
	}

	xhr.send();
}

function meteoViewer() {
	updateMeteo();

	setInterval(() => {
		updateMeteo();
	}, 1000 * 60);
}

function verAutoReload() {
	const verContainer = document.querySelector(".current-version");

	function loadAndCheckVer(verContainer) {
		const xhr = new XMLHttpRequest();

		xhr.open("GET", "/static/ver.json?v=" + Math.random());
		
		xhr.onload = () => {
			if(xhr.status != 200) {
				console.error("Error of load ver.json");
				return;
			}

			resp = JSON.parse(xhr.response);
			if(CUR_VER == "0.0") {
				CUR_VER = resp.ver;
				verContainer.innerHTML = `v${CUR_VER}`;
				return;
			} else if(CUR_VER != resp.ver) {
				document.location.reload();
			}
		}

		xhr.send();
	}

	loadAndCheckVer(verContainer);

	setInterval(() => {
		loadAndCheckVer(verContainer);
	}, 10 * 1000);
}

document.addEventListener("DOMContentLoaded", e => {
	timestampViewer();
	meteoViewer();
	verAutoReload();
});