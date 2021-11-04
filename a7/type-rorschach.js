

class Rorschach {
	// Create a branching system  Each branch can hold other branches
	constructor(aof) {
		
		this.aof = aof
		this.center = new Vector()
	}


	update(t, dt) {
		// No update needed here
		// Updates are good for if you want to maintain more complicated state 
	}

	draw(p) {
		let t = p.millis()*.001
		let themeColors = getThemeHSL()
		p.push()
		p.translate(0, -200)

		//Set vars to slider vals 
		let blotSize = this.aof.get("size")*20 + 10
		let pointCount = this.aof.get("complexity")*20 + 3
		let spikiness = this.aof.get("sharpness")
		let deformation = this.aof.get("center push")
		let splatterCount = this.aof.get("splatter")
		let innerHoles = Math.max(1.2,blotSize - (this.aof.get("inversion")+0.5) * blotSize/1.3 - 1)

		// Make the point on the body
		let bodyPoint = (r, theta, index) => {
			// Make every other point lumpy

			r *= 1+spikiness*(index%2)
			let bp = Vector.polar(r, theta)
						
			// Use noise to offset each point
			let defR =  .2*r*deformation
			let scale = .1
			let defTheta =  20*p.noise((bp[0]*scale, bp[1]*scale))
			

			// Sweep the body back
			bp[0] += 1.5*this.aof.get("spread")*Math.abs(bp[1])
			bp.addPolar(defR, defTheta)
			return bp
		}
		//bodypoint but make it reverse
		let bodyPoint2 = (r, theta, index) => {
			// Make every other point lumpy

			r *= 1+spikiness*(index%2)
			let bp = Vector.polar(r, theta).mult(-1)
						
			// Use noise to offset each point
			let defR =  -.2*r*deformation
			let scale = .1
			let defTheta =  20*p.noise((bp[0]*scale, bp[1]*scale))
			

			// Sweep the body back
			bp[0] -= 1.5*this.aof.get("spread")*Math.abs(bp[1])
			bp.addPolar(defR, defTheta)
			return bp
		}

		// Draw a blobby shape
		for (var i = 0; i < 1; i++) {
			let size = blotSize*(1 - i*.2)
			p.fill(...themeColors.content)
			
			p.beginShape()
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount
				let bp = bodyPoint(size, theta/2, j)
				p.curveVertex(bp[0],bp[1]-size)
			}
			//Create the inner hole
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount
				let bp = bodyPoint(size/innerHoles, -theta/2, j)
				p.curveVertex(bp[0],bp[1]-size)
			}
			p.endShape()
			p.beginShape()
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount
				let bp = bodyPoint2(size, theta/2, j)
				p.curveVertex(bp[0]-size,-bp[1]-size)
			}
			//Create the inner hole
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount
				let bp = bodyPoint2(size/innerHoles, -theta/2, j)
				p.curveVertex(bp[0]-size,-bp[1]-size)
			}
			p.endShape()
			
		}

		for (var i = 1; i < 2; i++) {
			let size = blotSize*(1 - i*.2)
			p.fill(...themeColors.secondary)
			
			p.beginShape()
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount*i
				let bp = bodyPoint(size, theta, j)
				p.curveVertex(...bp)
			}
			//Create the inner hole
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount*i
				let bp = bodyPoint(size/innerHoles, -theta, j)
				p.curveVertex(...bp)
			}
			p.endShape()
			p.beginShape()
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount*i
				let bp = bodyPoint2(size, theta, j)
				p.curveVertex(bp[0]-size,-bp[1])
			}
			//Create the inner hole
			for (var j = 0; j < pointCount + 2; j++) {
				let theta = j*Math.PI*2/pointCount*i
				let bp = bodyPoint2(size/innerHoles, -theta, j)
				p.curveVertex(bp[0]-size,-bp[1])
			}
			p.endShape()
			
			p.beginShape()
			for (var j = 0; j < Math.floor(splatterCount*4); j++) {
				let theta = j*Math.PI*2/pointCount
				let bp = bodyPoint2(size, theta/2, j)
				p.curveVertex(bp[0]-size,-bp[1]-size)
			}
			p.endShape()
			
		}
		p.pop()
	}
}

// Optional background: drawn once per population
Rorschach.drawBackground = function(p) {
	let themeColors = getThemeHSL()
	p.background(...themeColors.main)
}

// Static properties for this class
Rorschach.landmarks = {
	"butterfly": [0.48,0.50,0.00,1.00,0.00,1.00],
	"paint splatter": [0.20,0.69,1.00,0.91,0.19,0.83],
	'person w/ overalls': [0.259,0.679,0.522,0.161,0,0.00],
	"skull eyes and nose": [0.545,1.00,0.067,0.188,0.299,0.770],
	"man wearing crown": [0.00,1.00,0.7938,0.299,1.00,0.968]
}
Rorschach.labels = ["spread", "size", "sharpness", "complexity", "center push", "inversion"]

