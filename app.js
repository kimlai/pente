const toFloat = input => parseFloat(input.replace(",", "."));

const computeSlope = () => {
  const data = new FormData(document.getElementById("form"));
  const altitudeA = toFloat(data.get("altitude-A"));
  const altitudeB = toFloat(data.get("altitude-B"));
  const CB = toFloat(data.get("distance-CB"));
  const AC = altitudeA - altitudeB;

  const slope = ((100 * AC) / CB).toFixed(2);
  const AB = Math.sqrt(AC * AC + CB * CB).toFixed(2);
  document.getElementById("slope").innerHTML = slope + "%";
  document.getElementById("distance-AB").innerHTML = AB + "m";
};

document.getElementById("slide-CB").addEventListener("input", e => {
  document.getElementById("distance-CB").value = e.target.value;
  computeSlope();
});

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  computeSlope();

  const CB = toFloat(document.getElementById("distance-CB").value);
  const slider = document.getElementById("slide-CB");
  slider.classList.add("show");
  slider.setAttribute("min", CB - 10);
  slider.setAttribute("max", CB + 10);
  slider.value = CB;
});

document.getElementById("alti_form").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const altitudeA = toFloat(data.get("alti_altitude-A"));
  const altitudeB = toFloat(data.get("alti_altitude-B"));
  const CB = toFloat(data.get("alti_distance-CB"));
  const CD = toFloat(data.get("alti_distance-CD"));
  const DB = CB - CD;
  const AC = altitudeA - altitudeB;

  const altitudeE = (altitudeB + (AC * DB) / CB).toFixed(2);

  document.getElementById("altitude-E").innerHTML = altitudeE + "m";
});
