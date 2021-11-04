let counter = 0;
let toggleAutomate = true;
let firstClick = false;

document.addEventListener("DOMContentLoaded", function(){
    console.log("ay waddup");
});

const getColors = () => {
    let styles = getComputedStyle(document.body)
    let colors = [];
    colors.push(styles.getPropertyValue('--main-color'));
    colors.push(styles.getPropertyValue('--secondary-color'));
    colors.push(styles.getPropertyValue('--content-color'));
    return colors;
}

const setColors = (main,second,content) => {
    let styleEl = document.documentElement.style;
    styleEl.setProperty('--main-color', main);
    styleEl.setProperty('--secondary-color', second);
    styleEl.setProperty('--content-color', content);
}

const clickMainButton = () => {
    console.log("ayo");
    makeCat()
}

const makeCat = () => {
    const buttonText = document.getElementById("btn-text");
    buttonText.innerHTML = `Cats Clicked: ${counter}`
   
    let catSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    catSVG.setAttribute("width", "355");
    catSVG.setAttribute("height", "174");
    catSVG.setAttribute("viewBox", "0 0 355 174");

    let catPath1 = document.createElementNS('http://www.w3.org/2000/svg',"path");
    catPath1.setAttribute("fill-rule", "evenodd");
    catPath1.setAttribute("clip-rule", "evenodd");
    catPath1.setAttribute(
    "d",
    "M255.649 1.49218C243.839 5.70718 225.199 19.7532 215.725 31.5752L210.518 38.0732L188.448 38.3162C157.099 38.6622 153.714 38.6132 150.587 37.7682C149.052 37.3542 144.102 33.3652 139.587 28.9052C123.012 12.5322 104.414 1.07318 94.4156 1.07318C85.5416 1.07318 84.5966 3.31418 82.7416 28.7402C81.8436 41.0422 81.8376 48.9452 82.7126 61.7892C83.8446 78.3852 83.8216 78.8352 81.3706 88.4992C79.7556 94.8642 78.8766 101.105 78.8766 106.201C78.8766 110.531 78.5386 114.068 78.1266 114.062C77.7146 114.056 75.1676 113.381 72.4676 112.562C67.0436 110.917 60.8766 110.589 60.8766 111.945C60.8766 112.425 62.6756 113.105 64.8736 113.457C70.3616 114.334 79.4336 118.476 80.1906 120.45C80.7396 121.878 79.5886 122.085 70.5956 122.173C64.9746 122.228 59.3376 122.565 58.0676 122.923C52.8956 124.379 56.5496 125.271 68.2936 125.418C75.1226 125.503 80.9366 125.799 81.2126 126.075C81.4886 126.351 82.0036 127.729 82.3566 129.137C82.9696 131.581 82.7156 131.762 76.7706 133.136C73.3456 133.927 70.3326 135.205 70.0756 135.976C69.7056 137.085 70.3126 137.22 72.9926 136.622C84.3916 134.08 83.9676 134.058 85.7386 137.297C86.6396 138.945 88.2946 141.706 89.4166 143.433L91.4566 146.573L178.087 146.573H264.716L267.438 144.073C268.935 142.698 271.441 138.783 273.006 135.373L275.851 129.173L281.114 130.728C284.009 131.584 286.683 132.469 287.058 132.695C287.432 132.921 287.991 132.698 288.299 132.199C289.052 130.981 285.179 128.543 280.055 127.008C275.566 125.663 275.413 125.424 276.768 121.86C277.652 119.536 277.744 119.523 288.472 120.258C294.419 120.665 299.46 120.823 299.674 120.609C300.909 119.374 292.46 116.787 285.673 116.322C278.358 115.82 277.798 115.625 278.077 113.677C278.321 111.968 279.316 111.449 283.377 110.911C286.127 110.546 290.74 110.209 293.627 110.161C296.514 110.112 298.877 109.643 298.877 109.118C298.877 107.68 293.076 106.88 285.31 107.246L278.377 107.573L277.683 99.5732C277.301 95.1732 276.366 88.3532 275.605 84.4182C274.681 79.6382 274.471 75.1582 274.974 70.9182C276.525 57.8382 277.015 36.2942 275.995 26.0732C273.661 2.68618 268.79 -3.19882 255.649 1.49218ZM139.658 67.0602C148.567 71.1042 158.876 85.2182 160.415 95.4782C161.762 104.462 154.624 114.486 142.997 119.938C138.043 122.261 136.132 122.573 126.877 122.573C114.907 122.573 109.864 120.906 103.954 114.996C96.2586 107.302 93.8956 93.3512 98.7136 84.0732C106.439 69.2012 126.243 60.9712 139.658 67.0602ZM241.872 69.6512C252.953 74.6242 259.036 83.9222 259.111 96.0012C259.233 115.385 246.743 126.397 226.486 124.769C212.759 123.665 202.748 117.881 197.585 108.069C195.061 103.271 194.77 101.875 195.3 97.0732C196.598 85.2982 206.866 71.4582 217.11 67.6752C223.233 65.4142 234.42 66.3072 241.872 69.6512ZM222.451 87.3232C220.968 90.0902 220.833 91.8352 221.543 99.0612C222.192 105.661 222.738 107.619 223.998 107.86C226.141 108.27 226.85 105.341 226.85 96.0732C226.85 88.2982 226.169 84.0732 224.918 84.0732C224.519 84.0732 223.408 85.5362 222.451 87.3232ZM132.434 87.2962C128.955 92.2632 131.247 111.031 134.894 107.439C137.335 105.034 137.316 85.0732 134.872 85.0732C134.387 85.0732 133.29 86.0732 132.434 87.2962ZM182.877 116.759C182.877 118.104 178.501 122.073 177.017 122.073C175.396 122.073 170.877 118.265 170.877 116.899C170.877 116.445 173.577 116.073 176.877 116.073C180.177 116.073 182.877 116.381 182.877 116.759ZM313.877 123.717C312.502 123.974 308.902 125.396 305.877 126.878C295.224 132.098 294.231 140.646 303.877 144.093C306.352 144.977 310.512 147.332 313.122 149.325C318.946 153.772 325.013 154.93 332.877 153.094C335.902 152.388 341.456 151.524 345.22 151.175C350.326 150.7 352.42 150.051 353.47 148.615C356.747 144.133 353.872 134.955 347.674 130.114C341.903 125.605 335.83 123.763 325.877 123.501C320.652 123.363 315.252 123.461 313.877 123.717ZM25.8766 128.215C18.4016 129.45 9.14464 133.947 3.99864 138.843C0.39064 142.274 -0.214362 143.409 0.0566383 146.235C0.337638 149.162 0.868638 149.722 4.37664 150.788C6.57664 151.457 10.6266 152.758 13.3766 153.679C21.0456 156.249 30.9556 156.608 35.0256 154.464C37.2946 153.268 41.0306 152.627 46.5936 152.477C60.0536 152.116 63.7706 147.631 58.8916 137.639C54.4376 128.516 43.2996 125.337 25.8766 128.215Z"
    );

    let catPath2 = document.createElementNS('http://www.w3.org/2000/svg',"path");
    catPath2.setAttribute("d", "M92 146.326C155.445 183.989 194.036 182.09 265.5 146.326L92 146.326Z")

    let catColor = getColors()[2]
    catPath1.setAttribute("fill", catColor)
    catPath2.setAttribute("fill", catColor)
    catSVG.appendChild(catPath1);
    catSVG.appendChild(catPath2);
    
    randomizePos(catSVG);
    document.body.appendChild(catSVG);
    //catSVG.setAttribute("onclick", "clickCat()")
    catSVG.setAttribute("isClicked", 0)
    catSVG.onclick = () => clickCat(catSVG);
    
    catSVG.style.cursor = "pointer";

    if(!firstClick) {
        //console.log("yo")
        firstClick = true;
        automateCats();
        let makeButton = document.getElementById('sub-text');
        makeButton.onclick = () => clickAutomateCats();
        makeButton.style.cursor = "pointer";
        makeButton.innerHTML = "(Click me to <span class = 'underline'>disable</span> automatic cat spawning)";
    }
    

    setTimeout(() => {
        catSVG.style.display = "none";
        document.body.removeChild(catSVG);
    }, 2990)
}



const randomizePos = catSVG => {
    let viewWidth = window.innerWidth;
    let viewHeight = window.innerHeight;
    catSVG.style.position = "absolute";
    
    let direction = Math.floor(Math.random() * 3);

    let yPos = Math.floor(Math.random() * (viewHeight-400)) + 110;
    let xPos = Math.floor(Math.random() * (viewWidth-650)) + 300;

    if (direction == 0) {      
        catSVG.style.top = yPos;
        catSVG.style.left = "-120px";
        catSVG.style.animation = "popOut-left 3s cubic-bezier(.16,1.95,.81,.33) 1";
    }
    else if(direction == 1) {
        catSVG.style.top = yPos;
        catSVG.style.right = "-120px";
        catSVG.style.animation = "popOut-right 3s cubic-bezier(.16,1.95,.81,.33) 1";
    }
    else if(direction == 2) {
        catSVG.style.top = "-25px";
        catSVG.style.left = xPos;
        catSVG.style.animation = "popOut-top 3s cubic-bezier(.16,1.95,.81,.33) 1";
    }
}

const clickCat = (catSVG) => { 
    //console.log(catSVG.getAttribute("isClicked"))
    if(catSVG.getAttribute("isClicked") === "0") {
        const buttonText = document.getElementById("btn-text");
        counter++;
        buttonText.innerHTML = `Cats Clicked: ${counter}`
        //console.log("yuh")
        if(counter % 5 === 0) {
            toggleColors();
        }
        catSVG.setAttribute("isClicked", 1);
    }
}

const toggleColors = () => {
    let currColors = getColors()
    //console.log("bruh")
    //console.log(currColors)
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

const automateCats = () => {
    if(toggleAutomate) {
        setTimeout(() => {
            makeCat();
            automateCats();
        }, 1600);
    }
}

const clickAutomateCats = () => {
    let makeButton = document.getElementById('sub-text');
    //console.log("skoo")
    toggleAutomate = !toggleAutomate;

    if(toggleAutomate) {
        makeButton.innerHTML = "(Click me to <span class = 'underline'>disable</span> automatic cat spawning)";
    } else {
        makeButton.innerHTML = "(Click me to <span class = 'underline'>enable</span> automatic cat spawning)";
    }
    
    automateCats();
}

