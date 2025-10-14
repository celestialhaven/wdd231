/* =========================================================
   WIND CHILL CALCULATOR
   - Calculates and displays wind chill in °C using standard formula
   - Only applies when temperature ≤ 10°C and wind speed > 4.8 km/h
   ========================================================= */

// Get references to temperature, wind speed, and output elements
const tempElement  = document.getElementById("temp");
const speedElement = document.getElementById("speed");
const chillElement = document.getElementById("chill");

// Parse numeric values from element text content
const temperature = parseFloat(tempElement.textContent);
const windSpeed   = parseFloat(speedElement.textContent);

/**
 * Calculates wind chill using the standard Canadian formula:
 * 13.12 + 0.6215T − 11.37V^0.16 + 0.3965TV^0.16
 * where T = temperature (°C) and V = wind speed (km/h)
 * @param {number} temp - Temperature in °C
 * @param {number} speed - Wind speed in km/h
 * @returns {string} - Wind chill value rounded to one decimal place
 */
function calculateWindChill(temp, speed) {
  return (
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(speed, 0.16) +
    0.3965 * temp * Math.pow(speed, 0.16)
  ).toFixed(1);
}

// Apply formula only under valid conditions
if (temperature <= 10 && windSpeed > 4.8) {
  const chill = calculateWindChill(temperature, windSpeed);
  chillElement.textContent = `${chill} °C`;
} else {
  chillElement.textContent = "N/A"; // Not applicable if conditions aren't met
}
