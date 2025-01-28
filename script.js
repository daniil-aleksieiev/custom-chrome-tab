document.addEventListener('DOMContentLoaded', () => {
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  const weatherElement = document.getElementById('weather');
  const UNSPLASH_URL = `https://api.unsplash.com/photos/random?query=travel&client_id=${CONFIG.IMAGE_API_KEY}`;
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CONFIG.WEATHER_CITY}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
  };

  const updateDate = () => {
    const now = new Date();
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    dateElement.textContent = `${day}, ${date} ${month}`;
  };

  const setDailyBackground = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const storedData = JSON.parse(localStorage.getItem('dailyBackground'));

    if (storedData && storedData.date === today) {
      document.body.style.backgroundImage = `url(${storedData.image})`;
    } else {
      try {
        const response = await fetch(UNSPLASH_URL);
        if (!response.ok) throw new Error('Failed to fetch background image');
        const data = await response.json();
        const imageUrl = data.urls.full;

        document.body.style.backgroundImage = `url(${imageUrl})`;
        localStorage.setItem('dailyBackground', JSON.stringify({ date: today, image: imageUrl }));
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(WEATHER_URL);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();

      const { temp, feels_like } = data.main;
      weatherElement.innerHTML = `
        <span>${CONFIG.WEATHER_CITY}: ${Math.round(temp)}°C</span>
        <span>Feels Like: ${Math.round(feels_like)}°C</span>
      `;
    } catch (error) {
      weatherElement.textContent = 'Error loading weather';
      console.error('Error loading weather:', error);
    }
  };

  // Initialize
  updateTime();
  updateDate();
  setDailyBackground();
  fetchWeather();

  // Update every minute
  setInterval(updateTime, 1000 * 60);
});
