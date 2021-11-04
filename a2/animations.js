
let animations = [
    {
        title: "tug-o-war",

        draw: (p) => {
            let themeHSL = getThemeHSL()
            let main = themeHSL.main;
            let secondary = themeHSL.secondary;
            let content = themeHSL.content;
            
			let t = p.millis()*.001;
            let d = (p.noise(t))*60 
            
            p.background(secondary[0], secondary[1], secondary[2]-d);
			for(var i=0; i< 20; i++) {
				let x = p.width/4 * (p.noise(t)) * (i/1.1)
                let y = p.height/4 * p.noise(t+10) * i + 30

                let z = (p.noise(t))*25
                //console.log(z)
                p.fill(main[0], main[1], main[2]-z)
                p.rect(x,y+50,50,30)
                p.rect(x,y-30,50,30)
                p.rect(x,y+130,50,30)
                p.rect(x,y-110,50,30)
				p.fill(content[0], content[1], content[2]+z)
				p.square(x,y,50)
                p.square(x,y+80,50)
                p.square(x,y-80,50)
                p.square(x,y+160,50)
                p.square(x,y-160,50)
                p.noStroke()
			}


        }
    },
    {
        title: "marbles",

        draw: (p) => {
            let themeHSL = getThemeHSL()
            let main = themeHSL.main;
            let secondary = themeHSL.secondary;
            let content = themeHSL.content;
            
			p.background(content[0], content[1], content[2]);

            let t = p.millis()*.001 % 30
            p.fill(secondary[0], secondary[1], secondary[2])
			//p.circle((p.width/2),p.height/2,100/t)
            p.noStroke();
            for(let i = 0; i < 50; i++) {
                if(i%2 === 0) {
                    p.fill(main[0], main[1], (main[2]-(t*2)) % 101) 
                    p.stroke(secondary[0], secondary[1], (secondary[2]-(t*2)) % 101)
                }
                else if(i===49){
                    
                    p.fill(content[0], content[1], (content[2]+(t*2)) % 101);
                }
                else {
                    p.fill(secondary[0], secondary[1], (secondary[2]-(t*2)) % 101)
                    p.stroke(content[0], content[1], (content[2]-(t*2)) % 101)
                }
                p.circle((p.width/2),p.height/2,200*t/i)
                let x = p.width/2 + (i * 4 * Math.cos(t* i/5));
                let y = p.height/2 + (i * 4 * Math.sin(t* i/5));
                p.circle(x,y,8)
                //p.stroke(secondary[0], secondary[1], (secondary[2]-(t*2)) % 101)
            }
			
        }
    },
    {
        title: "galaxy",

        draw: (p) => {
            let themeHSL = getThemeHSL()
            let main = themeHSL.main;
            let secondary = themeHSL.secondary;
            let content = themeHSL.content;
            let t = p.millis()*.001 
			p.background(content[0], content[1], content[2]);
            
            for(let i = 0; i < 120; i++) {
                let x = p.width/2 + ((150-i) * Math.cos(t+i));
                let y = p.height/2 + ((150-i) * Math.sin(t+i));
                p.strokeWeight(i/120)
                p.stroke(secondary[0], secondary[1], (secondary[2])-(40*(i/360)))
                p.line(x,y,p.width/2,p.width/2)
                p.strokeWeight(1)
                p.stroke(secondary[0], secondary[1], (secondary[2])-(10*(i/360)))
                if(i%3 === 0){
                    p.fill(0,0,0)
                    p.circle(x-(i/2),y-(i/2),3)

                }
                //p.line(x,y,(p.width/2 + ((150-i+10)%360 * Math.cos(t+i+10))), p.height/2 + ((150-i+10)%360 * Math.sin(t+i+10)))
            }
		
        }
    },
    {
        title: "eyes",

        draw: (p) => {
            let themeHSL = getThemeHSL()
            let main = themeHSL.main;
            let secondary = themeHSL.secondary;
            let content = themeHSL.content;
            let t = p.millis()*.001 
			p.background(main[0], main[1], main[2]);
            p.noStroke()
            for(let i = 0; i < 40; i++) {                
                let x = i*40
				let y = t*20 * 10 + i*30
				x %= p.width+10
				y %= p.height

                if(i%2 === 0) {
                    p.fill(content[0],content[1],content[2],0.8)
                } else {
                    p.fill(secondary[0],secondary[1],secondary[2],0.8)
                }
                p.circle(x,y,30)
                if(i%2 == 0) {
                    p.fill(secondary[0],secondary[1],secondary[2],0.8)
                } else {
                    p.fill(content[0],content[1],content[2],0.8)
                }
                
                p.ellipse(x,y,30,10*Math.sin(t*3))
                
                if(Math.abs(10*Math.sin(t*3)) < 4.5) {
                    p.fill(0,0,0,0)  
                    p.circle(x,y,8) 
                }
                else {
                    if(i%2 === 0) {
                        p.fill(0,0,0)
                    } else {
                        p.fill(0,0,100)
                    }
                //    p.fill(0,0,0)  
                   p.circle(x,y,8)
                } 
                
            }
            
        }
    }

]