

let iconSize = 100; 
//BUILDS A TOOLBAR WITH ICONS FROM P5 CANVAS

//Code below uses the canvas building method in A2. 
window.addEventListener("load", () => {
    let holderEl = document.getElementById("tool-icons-list")
    let holderEl2 = document.getElementById("tool-icons-list2")

    //toolIcons is the first (left) column icons
    let toolIcons = [
        { 
            toolName: "roundBrush",
            draw: (p) => {
                    p.background(0,0,0,0)
                    let themeHSL = getThemeHSL()
                    let content = themeHSL.content;
                    p.noStroke();
                    p.fill(...content)
                    let x = p.width/2;
                    let y = p.height/2;
                    p.circle(x,y-10,50)
                    p.fill(...themeHSL.secondary)
                    p.textAlign(p.CENTER,p.TOP)
                    p.textFont('Work Sans')
                    p.textSize(15)
                    p.textStyle(p.ITALIC)
                    p.text("round brush",p.width/2,p.height-25)
                }
            },
            
        { 
        toolName: "angledBrush",
        draw: (p) => {
                p.background(0,0,0,0)
                p.noStroke()
                let themeHSL = getThemeHSL()
                let content = themeHSL.content;
                p.fill(...content)
                let x = p.width;
                let y = p.height;
                p.quad(20,30,x-30,30,x-20,y-30,30,y-30)
                p.fill(...themeHSL.secondary)
                p.textAlign(p.CENTER,p.TOP)
                p.textFont('Work Sans')
                p.textSize(15)
                p.textStyle(p.ITALIC)
                p.text("angled brush",p.width/2,p.height-25)
            }
        },
        { 
            toolName: "eraser",
            draw: (p) => {
                    p.background(0,0,0,0)
                    p.noStroke();
                    let themeHSL = getThemeHSL()
                    let content = themeHSL.content;
                    let x = p.width;
                    let y = p.height;  
                    p.fill(...content)
                    p.quad(30,20,x-20,20,x-30,y-30,20,y-30)
                    p.fill(...themeHSL.secondary)
                    p.quad(23,50,x-26,50,x-30,y-30,19,y-30)
                    p.textAlign(p.CENTER,p.TOP)
                    p.textFont('Work Sans')
                    p.textSize(18)
                    p.textStyle(p.ITALIC)
                    p.text("eraser",p.width/2,p.height-25)
                }
            },
        
    ]

    //toolIcons2 is the second (right) column of icons
    let toolIcons2 = [
            { 
            toolName: "spiral",
            draw: (p) => {
                p.background(0,0,0,0)
                let themeHSL = getThemeHSL()
                let content = themeHSL.content;
                p.fill(...content)
                p.noStroke()
                let r = 0
                for(let i = 0; i < 100; i++) {
                    let x = p.width/2 + (r * Math.cos(i/8));
                    let y = p.height/2 + (r * Math.sin(i/8));
                    p.circle(x,y,6)
                    r += 0.3
                } 
                p.fill(...themeHSL.secondary)
                p.textAlign(p.CENTER,p.TOP)
                p.textFont('Work Sans')
                p.textSize(20)
                p.textStyle(p.ITALIC)
                p.text("spiral",p.width/2,p.height-25)
            }
        },
        { 
            toolName: "slinky",
            draw: (p) => {
                p.background(0,0,0,0)
                let themeHSL = getThemeHSL()
                let content = themeHSL.content;
                p.stroke(...content)
                p.noFill()
                let r = 40
                for(let i = 0; i < 10; i++) {
                    let x = p.width/2 + (r * Math.cos(i/8))-30;
                    let y = p.height/2 + (r/2 * Math.sin(i/8))-13;
                    
                    p.ellipse(x,y,20,r)
                } 
                p.fill(...themeHSL.secondary)
                p.noStroke()
                p.textAlign(p.CENTER,p.TOP)
                p.textFont('Work Sans')
                p.textSize(20)
                p.textStyle(p.ITALIC)
                p.text("slinky",p.width/2,p.height-25)
            }
        },
        {
        toolName: "wordSoup",
                draw: (p) => {
                        p.background(0,0,0,0)
                        let themeHSL = getThemeHSL()
                        let content = themeHSL.content;
                        let x = p.width;
                        let y = p.height;  
                        p.fill(...content)
                        p.textAlign(p.CENTER,p.TOP)
                        p.textFont('Work Sans')
                        p.textSize(50)
                        p.text("ws",p.width/2,20)
                        p.fill(...themeHSL.secondary)
                        p.textSize(18)
                        p.textStyle(p.ITALIC)
                        p.text("word soup",p.width/2,p.height-25)
                    }
                },
            {
            toolName: "clear",
            draw: (p) => {
                    p.background(0,0,0,0)
                    p.strokeWeight(5);
                    let themeHSL = getThemeHSL()
                    let content = themeHSL.content;
                    let x = p.width;
                    let y = p.height;  
                    p.stroke(...content)
                    p.line(30,20,x-30,y-40)
                    p.line(30,y-40,x-30,20)
                    p.fill(...themeHSL.secondary)    
                    p.noStroke()              
                    p.textAlign(p.CENTER,p.TOP)
                    p.textFont('Work Sans')
                    p.textSize(18)
                    p.textStyle(p.ITALIC)
                    p.text("clear",p.width/2,p.height-25)
                }
            },
            
            
    ]
    //Sets tool when an icon is clicked 
    const setToolClick = (name) => {
        tool.mode = name;
    }
    
    toolIcons.forEach(toolIcon => {

        let el = document.createElement("button")
        el.className = "tool-button"
        el.id = toolIcon.toolName
        el.onclick = () => {setToolClick(toolIcon.toolName)}
        let canvasHolder = document.createElement("div")
        holderEl.append(el)
        el.append(canvasHolder)

        mainP5 = new p5(
            (p) => {
                
                p.colorMode(p.HSL);
                p.ellipseMode(p.ELLIPSE_RADIUS);

                p.setup = () => {
                    let icon = p.createCanvas(iconSize, iconSize);
                    if (toolIcon.setup)
                        toolIcon.setup(p)	
                }
                p.draw = () => {
                    toolIcon.draw(p)
                }
            }, canvasHolder)
    })
    toolIcons2.forEach(toolIcon => {

        let el = document.createElement("button")
        el.className = "tool-button"
        el.id = toolIcon.toolName
        el.onclick = () => {setToolClick(toolIcon.toolName)}
        let canvasHolder = document.createElement("div")
        holderEl2.append(el)
        el.append(canvasHolder)

        mainP5 = new p5(
            (p) => {
                
                p.colorMode(p.HSL);
                p.ellipseMode(p.ELLIPSE_RADIUS);

                p.setup = () => {
                    let icon = p.createCanvas(iconSize, iconSize);
                    if (toolIcon.setup)
                        toolIcon.setup(p)	
                }
                p.draw = () => {
                    toolIcon.draw(p)
                }
            }, canvasHolder)
    })
    })




  