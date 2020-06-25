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
  slider.setAttribute("min", Math.max(0.01, CB - 10).toFixed(2));
  slider.setAttribute("max", (CB + 10).toFixed(2));
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

const computeStairs = stairsCount => {
  const data = new FormData(document.getElementById("stairs_form"));
  const H = toFloat(data.get("stairs_H")) * 100;
  const L = toFloat(data.get("stairs_L")) * 100;

  const N = stairsCount ? stairsCount : Math.round((2 * H + L) / 63);
  const h = H / N;
  const g = L / N;
  const formula = (2 * h + g).toFixed(2);

  document.getElementById("stairs-result").classList.add("show");
  document.getElementById("stairs_count").innerHTML = N;
  document.getElementById("stairs_h").innerHTML = "h = " + h.toFixed(2) + "cm";
  document.getElementById("stairs_g").innerHTML = "g = " + g.toFixed(2) + "cm";
  document.getElementById("stairs_formula").innerHTML = "2h + g = " + formula;
};

document.getElementById("slide-stairs-count").addEventListener("input", e => {
  const stairsCount = e.target.value;
  document.getElementById("stairs_count").innerHTML = stairsCount;
  computeStairs(stairsCount);
});

document.getElementById("stairs_form").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const H = toFloat(data.get("stairs_H")) * 100;
  const L = toFloat(data.get("stairs_L")) * 100;

  const N = Math.round((2 * H + L) / 63);
  const minN = Math.round((2 * H + L) / 66);
  const maxN = Math.round((2 * H + L) / 60);
  const h = H / N;
  const g = L / N;
  const formula = (2 * h + g).toFixed(2);

  document.getElementById("stairs-result").classList.add("show");
  document.getElementById("stairs_count").innerHTML = N;
  document.getElementById("stairs_h").innerHTML = "h = " + h.toFixed(2) + "cm";
  document.getElementById("stairs_g").innerHTML = "g = " + g.toFixed(2) + "cm";
  document.getElementById("stairs_formula").innerHTML = "2h + g = " + formula;
  const slider = document.getElementById("slide-stairs-count");
  slider.setAttribute("min", minN);
  slider.setAttribute("max", maxN);
  slider.value = N;
});
