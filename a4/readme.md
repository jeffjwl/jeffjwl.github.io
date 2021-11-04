# A4 - Swarms

## Particles:
- Food: Originally stationary particle that moves when a predator/dung beetle particle goes over it.
- Dung Beetle: Follows heatmap generated from food using left and right sensors and creates a path on the heatmap. A dung beetle dies if a predator dashes onto it and it will turn black.
- Predator: Follows the path a Dung Beetle makes, does a dash when it has gotten close to a dung beetle.

## Sliders:
- foodAttraction: Increases radius of the food's "heat"
- bugSpeed: Increases speed of predators and bugs
- foodDisplacement: Increases force at which food is moved
- friction: Increases drag on the food once moving.

## Attribution
- p5 Swarms boiler plate provided by Professor Kate Compton.
- Changing the look of the range inputs with CSS: "https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ "
- p5.js documentation: "https://p5js.org/reference/"
