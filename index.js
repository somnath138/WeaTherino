const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const timezoneEl = document.getElementById('time-zone');
const currentweathervaluesEl = document.getElementById('current-weather-values');
const weatherforecastEl = document.getElementById('weather-forecast1');
const currentforecastE1 = document.getElementById('current-forecast1');
const tableEl = document.getElementById('table-values');

const searchButton = document.querySelector('.search-button');
const gpsSearch = document.querySelector('.gps-search');
var inputValue = document.querySelector('.search-box');
var loading= document.getElementById("loader");


const days = [ 'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const API_KEY = '67026f69f0a11b549ae71c22b8df0590';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0,0);

setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12format = hour >= 13 ? hour %12 : hour ;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';

    timeEl.innerHTML = (hourIn12format  <10 ? '0'+ hourIn12format : hourIn12format) + ':' + (minutes <10 ? '0'+ minutes : minutes) + `<div class="am-pm">${ampm}</div>`;
    dateEl.innerHTML = days[day]+ ', '+ date+ ' '+ months[month];
    
},1000);

locationData();

function locationData_gps(){
    navigator.geolocation.getCurrentPosition((sucesss) => {
        let{latitude, longitude} = sucesss.coords;
        getweatherData(latitude, longitude);
    });
    handle_locationPermission();
}

function locationData(){

    var latitude, longitude;
    loading.style.display= "block";
    if(inputValue.value == ''){

            // message
            document.getElementById("alert").classList.add("active");
            alert_message1();

            latitude = 51.5085 //22.5697;
            longitude = -0.1257 //88.3697;
            getweatherData(latitude, longitude); 

    }
    else{
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=`+inputValue.value+`&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            latitude = data.coord.lat;
            longitude = data.coord.lon;
            inputValue.value = '';
            getweatherData(latitude, longitude);
        })
        .catch(err => alert("Invalid name!! Please enter a valid name"));
        loading.style.display= "none";
        inputValue.value = '';
    }    
}
function getweatherData(latitude, longitude){
        console.clear();
        loading.style.display= "block";
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showweatherData(data);
        });
}

function showweatherData(data){
    let{humidity, temp, wind_speed} = data.current;

    currentweathervaluesEl.innerHTML = `
    <div>${humidity} %</div>
    <div>${temp} &deg;c</div>
    <div>${wind_speed} m/s </div>
    <div>${data.current.weather[0].description}</div>`;
    timezoneEl.innerHTML = data.timezone;
     
    // change header images according to weather

    let id= data.current.weather[0].id;
    document.querySelector('.header-wrapper').classList.add("active");
    if(id>=200 && id<300){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img6.jpg)";
    }
    else if(id>=300 && id<400){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img7.jpg)";
    }
    else if(id>=500 && id<600){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img8.jpg)";
    }
    else if(id>=600 && id<700){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img9.jpg)";
    }
    else if(id>=700 && id<=741){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img10.jpg)";
    }
    else if(id== 800){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img12.jpg)";
    }
    else if(id>=801 && id<=804){
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img11.jpg)";
    }
    else {
        document.querySelector('.header-wrapper.active').style.backgroundImage = "url(images/img4.jpg)";
    }


    // Tables

    let tableDataforecast = '';
    let dailyforecast = '';
    let currentforecast = '';

    data.daily.forEach((day, idx) => {
   
        if(idx == 0){
            currentforecast +=
            `<div class="upper">
                <div class="left">
                    <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                    <div class="date">${window.moment(day.dt * 1000).format('DD/MM/YYYY')}</div>
                    <div class="time-zone">${data.timezone}</div>
                    <div class="weather">${day.weather[0].description} </div>
                </div>
                <div class="right">
                    <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                </div>
            </div>
            <div class="lower">
                <div class="data-name">
                    <div>Max Temp </div>
                    <div>Min Temp  </div>
                    <div>Humidity </div>
                    <div>Wind speed </div>
                </div>
                <div class="data-value">
                    <div>${day.temp.max} &deg;c</div>
                    <div>${day.temp.min} &deg;c</div>
                    <div>${day.humidity} %</div>
                    <div>${day.wind_speed} m/s</div>
                </div>
            </div>`
        };
        
        dailyforecast +=
        `<div class="weather-data">
            <div class="upper"  id="weather-forecast1">
                <div class="left">
                    <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                </div>
                <div class="right" >
                    <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                    <div class="date">${window.moment(day.dt * 1000).format('DD/MM/YYYY')}</div>
                    <div class="time-zone">${data.timezone}</div>
                    <div class="weather">${day.weather[0].description} </div>
                </div>
            </div>
            <div class="lower">
                <div class="data-name">
                    <div>Max Temp </div>
                    <div>Min Temp  </div>
                    <div>Humidity </div>
                    <div>Wind speed </div>
                </div>
                <div class="data-value">
                    <div>${day.temp.max} &deg;c</div>
                    <div>${day.temp.min} &deg;c</div>
                    <div>${day.humidity} %</div>
                    <div>${day.wind_speed} m/s</div>
                </div>
            </div>
        </div>`

        tableDataforecast +=
        `<div class="column">
            <div class="row">${window.moment(day.dt * 1000).format('dddd')}</div>
            <div class="row">${window.moment(day.dt * 1000).format('DD/MM/YYYY')}</div>
            <div class="row"> 
                <div class="sub-row">${day.temp.day} &deg;c</div>
                <div class="sub-row">${day.temp.night} &deg;c</div>
                <div class="sub-row">${day.temp.max} &deg;c</div>
                <div class="sub-row">${day.temp.min} &deg;c</div>
            </div>
            <div class="row weather">${day.weather[0].description}</div>
            <div class="row">${day.humidity} %</div>
            <div class="row">${day.wind_speed} m/s</div>
            <div class="row">${day.pressure*100} Pa</div>
            <div class="row">${window.moment(day.sunrise * 1000).format('hh:mm a')} </div>
            <div class="row">${window.moment(day.sunset * 1000).format('hh:mm a')}</div>
            <div class="row">${window.moment(day.moonrise * 1000).format('hh:mm a')}</div>
            <div class="row">${window.moment(day.moonset * 1000).format('hh:mm a')}</div>

        </div>
        `
    })
    currentforecastE1.innerHTML = currentforecast;
    weatherforecastEl.innerHTML = dailyforecast;
    tableEl.innerHTML = tableDataforecast;

    
    loading.style.display= "none";
}

// Permissions
function handle_locationPermission(){
    navigator.permissions.query({name: 'geolocation'}).then(function(result){
        if(result.state == 'denied'){
            document.getElementById("location-alert1").classList.add("active");
            location_alert_message();
        }
    })
}

// Messages
function alert_message1(){
    window.scrollTo(0,0);
    document.getElementById("body").style.overflow = "hidden";
    document.getElementById("allow1").addEventListener("click",function(){
        document.getElementById("alert").classList.remove("active");
        document.getElementById("body").style.overflow = "unset";
        locationData_gps();
    });
    document.getElementById("dismiss1").addEventListener("click",function(){
        document.getElementById("alert").classList.remove("active");
        document.getElementById("body").style.overflow = "unset";
    });
}
// function alert_message2(){
//     window.scrollTo(0,0);
//     document.getElementById("body").style.overflow = "hidden";
//     document.getElementById("allow3").addEventListener("click",function(){
//         document.getElementById("name_alert").classList.remove("active");
//         document.getElementById("body").style.overflow = "unset";
//     });
// }
function location_alert_message(){
    window.scrollTo(0,0);
    loading.style.display= "none";
    document.getElementById("body").style.overflow = "hidden";
    document.getElementById("allow2").addEventListener("click",function(){
        document.getElementById("location-alert1").classList.remove("active");
        document.getElementById("body").style.overflow = "unset";
    });
}

// Responsive purpose
function mobileMenu()
    {
        var click = document.getElementById("mobile-menu-container");
        if(click.style.display === "block")
        {
            click.style.display= "none";
        }
        else {
            click.style.display = "flex";
        }
        
    }

function normal() {
    var click = document.getElementById("mobile-menu-container");
    if(click.style.display === "none")
    {
        click.style.display= "block";
    }
    else {
        click.style.display = "none"
    }
}