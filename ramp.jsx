import { h, Component, render } from "preact";
import { useState } from "preact/hooks";

const maxLength = slope => {
  if (8 < slope) return 50;
  if (5 < slope) return 200;
  if (4 < slope) return 1000;
  return Infinity;
};

const newSection = (slope, length) => {
  const sections = [];
  length = Math.min(maxLength(slope), length);
  sections.push({
    slope,
    length,
    height: (slope * length) / 100
  });
  if (4 < slope) {
    sections.push({ slope: 0, length: 140, height: 0 });
  }
  return sections;
};

const slopePoints = (sections, L, H) => {
  let x = 0;
  let y = H;
  return ["15,90"].concat(
    sections.flatMap(slope => {
      const points = [
        `${Math.round((x * 170) / L) + 15},${Math.round((80 * y) / H) + 10}`,
        `${Math.round(((x + slope.length) * 170) / L) + 15},${Math.round(
          (80 * (y - slope.height)) / H
        ) + 10}`
      ];
      x = x + slope.length;
      y = y - slope.height;

      return points;
    })
  );
};

const toSvg = (sections, L, H) => {
  let x = 0;
  let y = H;

  return sections.map(section => {
    const topLeftX = Math.round((x * 170) / L) + 15;
    const topLeftY = Math.round((80 * y) / H) + 10;
    const topRightX = Math.round(((x + section.length) * 170) / L) + 15;
    const topRightY = Math.round((80 * (y - section.height)) / H) + 10;

    const polygon = (
      <polygon
        fill="none"
        stroke="currentColor"
        points={`${topLeftX},${topLeftY} ${topRightX},${topRightY} ${topRightX},90 ${topLeftX},90`}
      />
    );

    x = x + section.length;
    y = y - section.height;

    return polygon;
  });
};

const propSum = (list, prop) => list.reduce((acc, item) => acc + item[prop], 0);

const App = () => {
  const [dimensionsSet, setDimensionsSet] = useState(false);
  const [H, setH] = useState(null);
  const [L, setL] = useState(null);

  const onSubmitDimensions = e => {
    e.preventDefault();
    setDimensionsSet(true);
  };

  const [sections, setSections] = useState([]);
  const [sectionSlope, setSectionSlope] = useState(null);
  const [sectionLength, setSectionLength] = useState(null);

  const addSection = e => {
    e.preventDefault();
    setSections(sections.concat(newSection(sectionSlope, sectionLength * 100)));
    setSectionSlope(null);
    setSectionLength(null);
  };

  const reset = () => {
    setSections([]);
    setH(null);
    setL(null);
    setSectionSlope(null);
    setSectionLength(null);
    setDimensionsSet(false);
  };

  const totalLength = propSum(sections, "length");
  const totalHeight = propSum(sections, "height");

  const H_inCm = H * 100;
  const L_inCm = L * 100;

  const allSections = sections.concat([
    {
      length: L_inCm - totalLength,
      height: H_inCm - totalHeight,
      slope: (((H_inCm - totalHeight) * 100) / (L_inCm - totalLength)).toFixed(
        2
      )
    }
  ]);

  return (
    <div class="with-sidebar">
      <div>
        <form
          id="ramp_form"
          onSubmit={onSubmitDimensions}
          hidden={dimensionsSet}
        >
          <div class="inputs">
            <label for="ramp_H">Hauteur totale</label>
            <div class="nowrap">
              <input
                required
                id="ramp_H"
                name="ramp_H"
                inputmode="decimal"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
                value={H}
                onInput={e => setH(e.target.value)}
              />
              <span>&nbsp;m</span>
            </div>
            <label for="ramp_L">Longueur totale</label>
            <div class="nowrap">
              <input
                required
                id="ramp_L"
                name="ramp_L"
                inputmode="decimal"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
                value={L}
                onInput={e => setL(e.target.value)}
              />
              <span>&nbsp;m</span>
            </div>
          </div>
          <button type="submit">Continuer</button>
        </form>
        <form id="ramp_steps" onSubmit={addSection} hidden={!dimensionsSet}>
          <h3>Nouvelle rampe</h3>
          <div class="inputs">
            <label for="ramp_new-step-slope">Pente</label>
            <div class="nowrap">
              <input
                required
                id="ramp_new-step-slope"
                name="ramp_new-step-slope"
                inputmode="decimal"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
                value={sectionSlope}
                onInput={e => setSectionSlope(e.target.value)}
              />
              <span>&nbsp;%</span>
            </div>
            <label for="ramp_new-step-length">
              <div>Longueur</div>
              {sectionSlope !== null && maxLength(sectionSlope) !== Infinity && (
                <div>
                  <small>(max {maxLength(sectionSlope) / 100}m)</small>
                </div>
              )}
            </label>
            <div class="nowrap">
              <input
                required
                id="ramp_new-step-length"
                name="ramp_new-step-length"
                inputmode="decimal"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
                value={sectionLength}
                onInput={e => setSectionLength(e.target.value)}
              />
              <span>&nbsp;m</span>
            </div>
          </div>
          <button type="submit">Ajouter</button>
          <div>
            <button onClick={reset} class="btn-link">
              Recommencer
            </button>
          </div>
        </form>
        <section class="triangle">
          <svg
            id="ramp-svg"
            viewBox="0 0 200 105"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="15,90 185,90 185,10 "
              fill="none"
              stroke="currentColor"
            />
            {!dimensionsSet && (
              <polyline
                points="185,10 15,90"
                fill="none"
                stroke="currentColor"
              />
            )}
            {dimensionsSet && toSvg(allSections, L_inCm, H_inCm)}
            <text
              x="190"
              y="55"
              transform={H === null ? "" : "rotate(90, 200, 45)"}
            >
              {H === null ? "H" : `${H}m`}
            </text>
            <text x="85" y="105">
              {L === null ? "L" : `${L}m`}
            </text>
          </svg>
          {dimensionsSet && (
            <div>
              <ol class="ramp-sections">
                {allSections.map((section, i) => (
                  <li>
                    {section.slope > 0 && (
                      <span>
                        Rampe à <b>{section.slope}%</b> sur{" "}
                        <b>{section.length / 100}m</b>
                      </span>
                    )}
                    {section.slope === 0 && (
                      <span>
                        Palier <b>{section.length / 100}m</b>
                      </span>
                    )}
                    {i < allSections.length - 1 && (
                      <button
                        class="btn-link"
                        onClick={() =>
                          setSections(
                            sections.filter((section, index) => index !== i)
                          )
                        }
                      >
                        supprimer
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("ramp-app"));
