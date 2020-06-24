document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const altitudeA = data.get("altitude-A");
  const altitudeB = data.get("altitude-B");
  const CB = data.get("distance-CB");
  const AC = altitudeA - altitudeB;

  const slope = ((100 * AC) / CB).toFixed(2);
  const AB = Math.sqrt(AC * AC + CB * CB).toFixed(2);
  document.getElementById("slope").innerHTML = slope + "%";
  document.getElementById("distance-AB").innerHTML = AB + "m";
});
