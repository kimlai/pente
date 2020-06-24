const computeSlope = () => {
  const data = new FormData(document.getElementById("form"));
  const altitudeA = parseInt(data.get("altitude-A"), 10);
  const altitudeB = parseInt(data.get("altitude-B"), 10);
  const CB = parseInt(data.get("distance-CB"), 10);
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

  const CB = parseInt(document.getElementById("distance-CB").value, 10);
  const slider = document.getElementById("slide-CB");
  slider.classList.add("show");
  slider.setAttribute("min", CB - 30);
  slider.setAttribute("max", CB + 30);
  slider.value = CB;
});
