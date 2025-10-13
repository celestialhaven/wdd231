
const tempElement = document.getElementById("temp");
const speedElement = document.getElementById("speed");
const chillElement = document.getElementById("chill");

const temperature = parseFloat(tempElement.textContent);
const windSpeed = parseFloat(speedElement.textContent);

function calculateWindChill(temp, speed) {
  return (
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(speed, 0.16) +
    0.3965 * temp * Math.pow(speed, 0.16)
  ).toFixed(1);
}


if (temperature <= 10 && windSpeed > 4.8) {
  const chill = calculateWindChill(temperature, windSpeed);
  chillElement.textContent = `${chill} °C`;
} else {
  chillElement.textContent = "N/A";
}
