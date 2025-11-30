import path from "node:path";
import { writeFile } from "node:fs/promises";

function renderSvg({ length = 4, debug = false, offset = 0 }) {
  return `
<svg stroke="#221F20" fill="#221F20" stroke-width="0" viewBox="0 0 100 100" height="400px"
  width="400px" xmlns="http://www.w3.org/2000/svg">
  ${debug ? '<rect x="0" y="0" width="100" height="100" fill="#f0a944"/>' : ""}

  <circle cx="50" cy="50" r="30" />
  <circle cx="50" cy="50" r="33" fill="none" stroke-width="1"/>
  <circle cx="50" cy="50" r="36" fill="none" stroke-width="1"/>
  <circle cx="50" cy="50" r="40" fill="none" stroke-width="7" stroke="#BA7439"/>
  <circle cx="50" cy="50" r="44" fill="none" stroke-width="1"/>
  <circle cx="50" cy="50" r="47" fill="none" stroke-width="1"/>
  ${Array.from(
    { length },
    (_, i) => `
  <g transform="rotate(${(360 / length) * (i + offset)} 50 50)">
    <g transform="rotate(45 50 7.4)">
      <rect x="50" y="7.4" width="3.8" height="3.8" fill="none" stroke="#353233ff" stroke-width="0.8"/>
      <circle cx="50" cy="7.4" r="0.5" fill="#372128ff" transform="translate(-1.3 2)"/>
      <circle cx="50" cy="7.4" r="0.5" fill="#372128ff" transform="translate(2 -1.3)"/>
      <circle cx="50" cy="7.4" r="0.5" fill="#372128ff" transform="translate(2 5.2)"/>
      <circle cx="50" cy="7.4" r="0.5" fill="#372128ff" transform="translate(5.2 2)"/>
    </g>
  </g>  
  `
  ).join("\n")}
  ${
    debug
      ? '<line x1="50" y1="0" x2="50" y2="100" stroke-width="0.1" stroke="red"/>'
      : ""
  }
  ${
    debug
      ? '<line x1="0" y1="50" x2="100" y2="50" stroke-width="0.1" stroke="red"/>'
      : ""
  }
</svg>  
  `;
}

writeFile(
  path.join(process.cwd(), "src", "assets", "rosette.svg"),
  renderSvg({ length: 24, debug: false, offset: 0 })
);
