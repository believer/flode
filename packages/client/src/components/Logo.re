module Style = {
  open Css;

  let rotateClockwise =
    keyframes([
      (0, [transform(`rotateZ(`deg(0.0)))]),
      (100, [transform(`rotateZ(`deg(360.0)))]),
    ]);

  let rotateCounterClockwise =
    keyframes([
      (0, [transform(`rotateZ(`deg(0.0)))]),
      (100, [transform(`rotateZ(`deg(-360.0)))]),
    ]);

  let logo =
    merge([
      "h-10 w-10",
      style([
        hover([
          selector(
            ".rotateClockwise",
            [
              animationName(rotateClockwise),
              animationDuration(800),
              animationIterationCount(`count(1)),
              transformOrigin(`percent(50.0), `percent(50.0)),
            ],
          ),
          selector(
            ".rotateCounterClockwise",
            [
              animationName(rotateCounterClockwise),
              animationDuration(600),
              animationIterationCount(`count(1)),
              transformOrigin(`percent(50.0), `percent(50.0)),
            ],
          ),
        ]),
      ]),
    ]);
};

[@react.component]
let make = () => {
  <svg
    className=Style.logo
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 430
    430">
    <g
      fillRule="nonzero"
      stroke="#1A202C"
      strokeWidth="15"
      fill="none"
      strokeLinecap="round">
      <path
        d="M14 215l75.234-30a67.706 67.706 0 0150.155 0l150.468 60a67.706 67.706 0 0050.156 0l75.233-30"
      />
      <path
        d="M14 175l75.234-30a67.706 67.706 0 0150.155 0l150.468 60a67.706 67.706 0 0050.156 0l75.233-30M14 255l75.234-30a67.706 67.706 0 0150.155 0l150.468 60a67.706 67.706 0 0050.156 0l75.233-30"
      />
      <path
        className="rotateCounterClockwise"
        d="M413.139 275.105a205.538 205.538 0 004.921-19.708A208.012 208.012 0 00422 215C422 100.677 329.323 8 215 8c-28.066 0-54.828 5.586-79.234 15.706M16.861 154.896a205.538 205.538 0 00-4.921 19.707A208.012 208.012 0 008 215c0 114.323 92.677 207 207 207 28.066 0 54.828-5.586 79.234-15.706"
      />
      <path
        className="rotateClockwise"
        d="M339.465 94.743C308.037 62.223 263.96 42 215.16 42c-23.435 0-45.78 4.663-66.159 13.112M90.535 335.257C121.963 367.777 166.04 388 214.84 388c23.435 0 45.78-4.663 66.159-13.112"
      />
    </g>
  </svg>;
};
