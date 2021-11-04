//Adapted from https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    let newOut = [h,s,l]
    return newOut;
}

//Gets colors of the theme from the webpage
const getColors = () => {
    let styles = getComputedStyle(document.body)
    let colors = [];
    colors.push(styles.getPropertyValue('--main-color'));
    colors.push(styles.getPropertyValue('--secondary-color'));
    colors.push(styles.getPropertyValue('--content-color'));
    return colors;
}

//Sets the colors for the theme
const setColors = (main,second,content) => {
    let styleEl = document.documentElement.style;
    styleEl.setProperty('--main-color', main);
    styleEl.setProperty('--secondary-color', second);
    styleEl.setProperty('--content-color', content);
}

//Toggles between different themes
const toggleColors = () => {
    let currColors = getColors()
    if (currColors[0] === "#8d99ae") {
        setColors("#948E81","#C5C2B9","#000000");
    }
    else if(currColors[0] === "#948E81"){
        setColors("#b7b7a4", "#7f9183","#6b705c");    
    }
    else if(currColors[0] === "#b7b7a4") {
        setColors("#DDB892","#EDE0D4","#7F5539")
    }
    else if(currColors[0] === "#DDB892") {
        setColors("#eee4e1", "#a99985","#b2967d");
    }
    else if (currColors[0] === "#eee4e1"){
        setColors("#000000","#948E81","#C5C2B9"); 
    }
    else if (currColors[0] === "#000000") {
        setColors("#858ae3","#abc4ff","#4e148c");
    }
    else if (currColors[0] === "#858ae3") {
        setColors("#8d99ae","#D6E0E3","#2b2d42");
    }

}

//Converts the theme colors to HSL so that it can work with p5.js
const getThemeHSL = () => {
    let hexColors = getColors();
    return {
        main: hexToHSL(hexColors[0]),
        secondary: hexToHSL(hexColors[1]),
        content: hexToHSL(hexColors[2])
    }
}
