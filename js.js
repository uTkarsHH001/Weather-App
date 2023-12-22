const API_KEY = "56292fdafc6c3976964d9158000678ec";
let select = (el) => document.querySelector(`${el}`);

let yourWeatherButton = select("button#btn1");
let searchWeatherButton = select("button#btn2");
let grantAccess = select("button#grantAccess");
let yourWeather = select(".yourWeather");
let searchWeather = select(".searchWeather");
let inp = select(".searchWeather input");
let btn = select("button#search");
let weather = select("div.weather");
let weatherSuccess = select("div.weatherSuccess");
let weatherFail = select("div.weatherFail");
let city;



grantAccess.addEventListener("click",async ()=>{

    getLocation();
})

function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(show);
    }

    async function show(pos){
        
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try{
            let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            let data = await resp.json();

            yourWeather.classList.add("dnone");
            weather.classList.remove("dnone");
            weatherSuccess.classList.remove("dnone");
            fetchWeatherInfo(data);
        }
        catch{
            console.log(err);
        }
    }

}



yourWeatherButton.addEventListener("click", ()=>{
    weather.classList.add("dnone");
    yourWeather.classList.remove("dnone");
    searchWeather.classList.add("dnone");
})

searchWeatherButton.addEventListener("click", ()=>{
    weather.classList.add("dnone");
    yourWeather.classList.add("dnone");
    searchWeather.classList.remove("dnone");
})

inp.addEventListener("keydown", (e)=>{

    if(e.key == 'Enter'){
        city = inp.value;
        inp.value = "";
        
        getData();
        
    }
})

btn.addEventListener("click", ()=>{
        
        city = inp.value;
        inp.value = "";
        getData();
})

async function getData(){

    try{
        let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await resp.json();

    
    weather.classList.remove("dnone");
    weatherSuccess.classList.remove("dnone");
    fetchWeatherInfo(data);

    }
    catch{
        weather.classList.remove("dnone");
        weatherSuccess.classList.add("dnone");
        weatherFail.classList.remove("dnone");
    }
}

function fetchWeatherInfo(data){
    yourWeather
    let h2 = select("h2.city");
    let h4 = select("h4.weatherInfo");
    let h1 = select("h1.temp");
    let iconImg = select(".iconImg");
    let wind = select("p.wind");
    let humidity = select("p.humidity");
    let cloud = select("p.clouds");
    

    h2.innerHTML = data.name;
    h4.innerHTML = data.weather[0].description;
    h1.innerHTML = data.main.temp;
    h1.append("° C");

    let icon = data.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/w/${icon}.png`;

    iconImg.setAttribute("src", iconURL);

    wind.innerHTML = data.wind.speed;
    wind.append(" M/S");

    humidity.innerHTML = data.main.humidity;
    humidity.append("%");

    cloud.innerHTML = data.clouds.all;
    cloud.append("%");

    weatherSuccess.classList.remove("dnone");
    weatherFail.classList.add("dnone");
}

