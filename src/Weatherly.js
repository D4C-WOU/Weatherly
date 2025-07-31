document.addEventListener('DOMContentLoaded', function () {

  const key = import.meta.env.VITE_WEATHER_API_KEY

  const baseURL = 'https://api.weatherapi.com/v1/forecast.json'

  const searchBox = document.querySelector('.search-box')
  const searchButton = document.querySelector('button')

  const weatherTemp = document.querySelector('.weather-temp')
  const weatherDesc = document.querySelector('.weather-description')
  const locationElem = document.querySelector('.location')
  const dateDayName = document.querySelector('.date-dayname')
  const dateDay = document.querySelector('.date-day')
  const humidityElem = document.querySelector('.humidity .value')
  const windElem = document.querySelector('.wind .value')
  const percipitationElem = document.querySelector('.percipitation .value')
  const weatherIcon = document.querySelector('.weather-container i')

  function fetchWeather(city) {
    const fullURL = baseURL + '?key=' + key + '&q=' + encodeURIComponent(city) + '&days=4&aqi=no&alerts=no'

    fetch(fullURL)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert('City not found. Please try again.');
          return;
        }

        updateUI(data)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        alert('Network error. Please try again later.')
      });
  }

  function updateUI(data) {
    const { location, current } = data

    locationElem.textContent = location.name + ', ' + location.country
    weatherTemp.textContent = Math.round(current.temp_c) + '°C'
    weatherDesc.textContent = current.condition.text
    humidityElem.textContent = current.humidity + '%'
    windElem.textContent = current.wind_kph + ' km/h'
    percipitationElem.textContent = ' '+ current.precip_mm + ' mm'
    weatherIcon.className = getIcon(current.condition.text)
    updateDate()


    // Forecast list
    const weekList = document.querySelector('.week-list')
    if (weekList) {
             weekList.innerHTML = ''

    data.forecast.forecastday.slice(0, 4).forEach((day, index) => {
    const li = document.createElement('li')
    if (index === 0) li.classList.add('active') 

    const icon = document.createElement('i')
    icon.className = getIcon(day.day.condition.text)

    const name = document.createElement('span')
    name.className = 'day-name'
    name.textContent = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })

    const temp = document.createElement('span')
    temp.className = 'day-temp'
    temp.textContent = Math.round(day.day.avgtemp_c) + '°C'

    li.appendChild(icon)
    li.appendChild(name)
    li.appendChild(temp)
    weekList.appendChild(li)
  })
}

  }

  function getIcon(condition) {
  const lower = condition.toLowerCase()

  if (lower.includes("sun")) return "fa-solid fa-sun icon"
  if (lower.includes("cloud") || lower.includes("overcast")) return "fa-solid fa-cloud icon"
  if (lower.includes("rain") || lower.includes("drizzle")) return "fa-solid fa-cloud-showers-heavy icon"
  if (lower.includes("thunder")) return "fa-solid fa-poo-storm icon"
  if (lower.includes("snow")) return "fa-solid fa-snowflake icon"
  if (lower.includes("mist") || lower.includes("fog")) return "fa-solid fa-smog icon"

  return "fa-solid fa-cloud icon"
}


  function updateDate() {
    const now = new Date()
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
    dateDayName.textContent = now.toLocaleDateString('en-US', { weekday: 'long' })
    dateDay.textContent = now.toLocaleDateString('en-US', options).split(',')[1]
  }

  searchButton.addEventListener('click', function () {
    const city = searchBox.value.trim()
    if (city) fetchWeather(city)
  });

  searchBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const city = searchBox.value.trim()
      if (city) fetchWeather(city)
    }
  })

})
