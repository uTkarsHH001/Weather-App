import foodsByTemperature from './foodSuggestion.js';

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
let suggestFood = select('button.suggestFoods');
let weatherFail = select("div.weatherFail");

const foodModal = select("#foodModal");
const closeFoodModalBtn = select("#closeFoodModalBtn");
const foodList = select("#foodList");
// const foods = select('.foods')
let city;
let temp;

// Function to show the modal and populate the suggested foods
const showFoodModal = (foods) => {
    foods.forEach((food) => {
        let listItem = document.createElement("li");
        const Imgg = document.createElement('img');
        let Heading = document.createElement('h1');
        const desc = document.createElement('h5');
        
        Imgg.src = food.image;
        Heading.innerHTML = food.name;
        desc.innerHTML = food.description;
        
        listItem.append(Imgg);
        listItem.append(Heading);
        listItem.append(desc);

        foodList.appendChild(listItem);
    });
    foodModal.showModal();
  };

  closeFoodModalBtn.addEventListener("click", () => {
    foodModal.close();
  });

suggestFood.addEventListener('click', () => {
    let val = parseInt(temp.innerHTML);
    // console.log(val);
    getFoodByTemperature(val);  
})


const getFoodByTemperature = async (temperature) => {
    const foodConainter = select('div.foodConainter');

    try {

        const requestedTemperature = foodsByTemperature;
        
        const temperatureRange = Object.keys(foodsByTemperature)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .find(temp => requestedTemperature <= parseInt(temp));

        const selectedTemperature = temperatureRange || Object.keys(foodsByTemperature).pop();
        const filteredFoods = foodsByTemperature[selectedTemperature] || [];

        const imageUrlPromises = filteredFoods.map(food => getImageUrlByName(food.name));
        const imageUrls = await Promise.all(imageUrlPromises);

        filteredFoods.forEach((food, index) => {
            food.image = imageUrls[index];
        });

        // res.json({ temperature: requestedTemperature, foods: filteredFoods });

        showFoodModal(filteredFoods);
        console.log(filteredFoods)
        console.log('Jugnu')

    } catch (error) {
        console.error('Error fetching food data:', error);
    }
};


const key = '42598473-a3ce5fc16bf8d4b9f85be409f';

async function getImageUrlByName(name) {
    try {
        const response = await axios.get(
            `https://pixabay.com/api/?key=${key}&q=${name}&image_type=photo`
        );
        const data = response.data;

        return data.hits[0]?.previewURL || 'https://cdn.pixabay.com/photo/2014/04/22/02/56/pizza-329523_1280.jpg';
    } catch (error) {
        console.error('Error fetching image:', error.message);
        return 'Image not found';
    }
}



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
    temp = h1;

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

