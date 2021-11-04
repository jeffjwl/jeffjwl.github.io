# A3 - Drawing Tool

## Brushes:
- Round Brush: Standard round brush, makes a smooth, solid line in the primary color. 
- Angled Brush: Brush that creates a sharp quadrilateral on the cursor of specified color and size. 
- Eraser: Same as the round brush, but takes on the color of the current background. Not a true eraser, so if the background color is changed, the old color remains. 
- Spiral: Makes a spiral like looping pattern that grows the longer the stroke. Made using vertex curves. Uses the primary color for stroke and secondary for fill.
- Slinky: Makes a slinky-like shape that bends into itself and changes saturation/brightness as the stroke gets longer. Made with bezier curves.
- Word Soup: Random words from a list of words will pop up around the cursor as it's dragged. Words are randomly either the primary or secondary color.  

## Attribution
- p5 drawing tool boilerplate and example tools (that heavily inspired the current brushes) provided by Professor Kate Compton. 
- p5 animation boilerplate (used for making the toolbar icons) provided by Professor Kate Compton.
- Changing the look of the range inputs with CSS: "https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ "
- p5.js documentation: "https://p5js.org/reference/"