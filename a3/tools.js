
let positions = []


let tool = {
	color0: [0,0,0],
	color1: [0,0,0],
	color2: [0,0,0],
	size: 1,
	mode: "roundBrush"
}

let themeColors = null;
window.addEventListener("load", () => {
	themeColors = getThemeHSL();
	//Initialize tool colors as the colors of the theme's CSS
	tool = {
	color0: themeColors.secondary,
	color1: themeColors.content,
	color2: themeColors.main,
	size: 1,
	mode: "roundBrush"
}
})

//When theme is changed, change tool colors
const themeSwitch = () => {
	toggleColors();
	themeColors = getThemeHSL();
	tool.color0 = themeColors.secondary
	tool.color1 = themeColors.content
	tool.color2 = themeColors.main,
	document.getElementById("color0").value = HSLToHex(...tool.color0)
	document.getElementById("color1").value = HSLToHex(...tool.color1)
}

let tools = {
	roundBrush(p, size, background, color, color2) {
		p.stroke(...color)
		p.strokeWeight(size*3)
		p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY)
	},
	eraser(p,size, background, filler, color) {
		p.stroke(...color)
		p.strokeWeight(size*3)
		p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY)
	},
	spiral(p, size, color0, color1, color2) {
		p.fill(...color0,0.01)
		p.strokeWeight(size)
		p.stroke(...color1, Math.random())
		let mouse = new Vector(p.mouseX, p.mouseY)
		positions.push(mouse)
		let t = p.millis()
		p.beginShape()
		for (var i = 0; i < positions.length; i++) {
			// Get that position
			let pos = positions[i]
			pos[0] += Math.cos(i) * p.noise(t) * size * 3
			pos[1] += Math.sin(i) * p.noise(t) * size * 3
			p.curveVertex(...pos)		
		}
		p.endShape()
	},

	slinky(p, size, color0, color1, color2) {
		p.fill(...color0,0.005)
		p.stroke(...color1, Math.random())
		p.strokeWeight(size)
		let mouse = new Vector(p.mouseX, p.mouseY)
		positions.push(mouse)
		let t = p.millis()
		p.beginShape()
		for (var i = 0; i < positions.length; i++) {
		
			let pos = positions[i]
			p.stroke(color1[0],(color1[1]+i)%180,(color1[2]+i)%80)
			p.bezier(...pos, ...pos.map(e => e+= size*30),...positions[Math.floor(i/2)].map(e => e+= size*50),...positions[Math.floor(i/2)])
			
		}
		p.endShape()
	},
	
	angledBrush(p, size, color0, color1, color2) {
		size *= 10
		let x = p.mouseX-(size)
		let y = p.mouseY-(size/2)
		
		p.fill(...color1,0.8)
		p.noStroke()
		p.quad(x,y,x+size,y,x+2*size,y+size,x+size,y+size)
	
	},
	wordSoup(p, size, color0, color1, color2) {
		//Words from a random word gen, with some small edits
		let string = 	`crayon
						lizards
						horn
						existence
						low
						umbrella
						limit
						respect
						giants
						discovery
						SHEEEEeeeeSH
						digestion
						digestion
						coach
						toothbrush
						food
						slope
						squirrel
						join
						skoooo
						hands
						cloth
						wash
						debt
						flower
						station
						run
						increase
						advertisement
						education
						skrrrrt
						wool
						sheesh
						discovery
						giants
						adjustment
						respect
						low
						apple
						sheep
						fork
						oatmeal
						education
						advertisement
						fog
						crush
						vrooom vroom
						kick
						grass
						experience
						poopoopeepee
						horses
						meat
						tiger
						surprise
						seashore
						lake
						experience
						hill
						good-bye
						mice
						door
						music
						verse
						cover
						grandmother
						grandmother
						arm
						jam
						scooby doo
						lets goo		
						`
		
		//Split operation makes every word an element of an array
		let wordOptions = string.split("\n")
		let ind = Math.floor(wordOptions.length*Math.random())
		let word = wordOptions[ind]
		
		let x = p.mouseX
		let y = p.mouseY

		x += Math.cos(x/Math.PI) * p.noise(x) * size * 50
		y += Math.sin(y/Math.PI) * p.noise(y) * size * 50
		if(ind%2 === 0) {
			p.fill(...color0)
		}
		else {
			p.fill(...color1)
		}

		p.textSize(Math.sqrt(size)*10)
		p.text(word, x, y)
	},

}