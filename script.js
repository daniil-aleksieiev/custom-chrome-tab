document.addEventListener('DOMContentLoaded', () => {
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');

  const now = new Date();

  const updateTime = () => {
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');

    timeElement.textContent = `${hours}:${minutes}`;
  };

  const getDate = () => {
    let day = now.getDay();
    const date = now.getDate();
    let month = now.getMonth();

    switch (day) {
      case 2:
        day = 'Tuesday';
        break;
      case 3:
        day = 'Wednesday';
        break;
      case 4:
        day = 'Thursday';
        break;
      case 5:
        day = 'Friday';
        break;
      case 6:
        day = 'Saturday';
        break;
      case 7:
        day = 'Sunday';
        break;
      default:
        day = 'Monday';
        break;
    }

    switch (month) {
      case 1:
        month = 'Feb';
        break;
      case 2:
        month = 'Mar';
        break;
      case 3:
        month = 'Apr';
        break;
      case 4:
        month = 'May';
        break;
      case 5:
        month = 'Jun';
        break;
      case 6:
        month = 'Jul';
        break;
      case 7:
        month = 'Aug';
        break;
      case 8:
        month = 'Sep';
        break;
      case 9:
        month = 'Oct';
        break;
      case 10:
        month = 'Nov';
        break;
      case 11:
        month = 'Dec';
        break;
      default:
        month = 'Jan';
        break;
    }

    dateElement.textContent = `${day}, ${date} ${month}`;
  };

  updateTime();
  getDate();
  setInterval(updateTime, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
  const UNSPLASH_URL = `https://api.unsplash.com/photos/random?query=travel&client_id=${CONFIG.IMAGE_API_KEY}`;

  const setDailyBackground = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const storedData = JSON.parse(localStorage.getItem('dailyBackground'));

    if (storedData && storedData.date === today) {
      document.body.style.backgroundImage = `url(${storedData.image})`;
    } else {
      try {
        const response = await fetch(UNSPLASH_URL);
        const data = await response.json();
        const imageUrl = data.urls.full;

        document.body.style.backgroundImage = `url(${imageUrl})`;

        localStorage.setItem('dailyBackground', JSON.stringify({ date: today, image: imageUrl }));
      } catch (error) {
        console.error('Error loading image', error);
      }
    }
  };

  setDailyBackground();
});

document.addEventListener('DOMContentLoaded', () => {
  const weatherElement = document.getElementById('weather');

  const fetchWeather = async () => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CONFIG.WEATHER_CITY}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;

    try {
      const response = await fetch(URL);
      const data = await response.json();

      const temp = Math.round(data.main.temp);
      const feels_like = Math.round(data.main.feels_like);

      weatherElement.innerHTML = `
        <span>${CONFIG.WEATHER_CITY}: ${temp}°C</span>
        <span>Feels Like: ${feels_like}°C</span>
      `;
    } catch (error) {
      weatherElement.textContent = 'Error loading weather';
      console.error('Error loading weather:', error);
    }
  };

  fetchWeather();
});
