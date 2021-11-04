// Create a particle system with an initialize, update, and draw function

// let mySystem = new BasicParticleSystem()
// mySystem.update()
// mySystem.draw()

class DungBeetleParticleSystem {
	constructor() {
		this.bugs = []
		for (var i = 0; i < 5; i++) {
			this.bugs.push(new DungBeetle())
		}
	}
	
	update(p) {
		this.bugs.forEach(b => b.update(p))
	}

	// Draw INTO the heatmap
	drawHeatmap2(p, heatmapScale) {
		p.fill(0, 0, 0, 3)
		p.rect(0, 0, p.width, p.height)
		p.push()
		p.scale(1/heatmapScale)
		p.fill(255, 0, 0)
		p.noStroke()
		this.bugs.forEach(b => {
			p.fill(0, 255, 0)

			// Draw *behind* the bug
			let pos = Vector.addMultiples(b.position, 1, b.velocity, -200)
			p.circle(...pos, 20)
		})
		p.pop()
	}

	getClosest(point, range) {
		let closestDist = range
		let closest = undefined

		this.bugs.forEach(b => {
			let d = Vector.getDistance(b.position, point)
			if (d < closestDist) {
				closest = b
				closestDist = d
			}
		})
		if (closest)
			return closest.position 
	}

	draw(p) {

		let debugDraw = DEBUG_DRAW[this.constructor.name]
		if (debugDraw) {
			debugDrawHeatmap2(p)
		}
		

		p.push()
		p.noStroke()
		// p.fill(0, 0, .2, .5)
		// // p.translate(p.width/2, p.height/2)
		// p.circle(0, 0, 100)
		this.bugs.forEach(b => b.draw(p))
		if (debugDraw) {
			this.bugs.forEach(b => b.drawDebug(p))
		}
		p.pop()
	}
}



class DungBeetle {
	constructor() {
		this.position = new Vector(Math.random()*400,Math.random()*300)
		this.posLeft = new Vector(0,0)
		this.posRight = new Vector(0,0)
		this.velocity = Vector.polar(SLIDER.bugSpeed * 0.4, Math.random()*200)
		this.smellValue =[0,0,0]
		this.smellValueL = [0,0,0]
		this.smellValueR = [0,0,0]
		this.angle = 0
		this.dead = false;
		this.deathtimer = 0;
	}

	update(p) {

		let dt = Math.min(.1, p.deltaTime*.001)
		let t = p.millis()*.001
		this.smellValue = readHeatmapAt(this.position)
		let speed = SLIDER.bugSpeed * 0.4
		let oldpos = this.position
		//console.log(speed)
		//Deep copies for velocity and position vectors
		let vecL = new Vector(0,0)
		let vecR = new Vector(0,0)
		let posL = new Vector(0,0)
		let posR = new Vector(0,0)
		vecR.copy(this.velocity)
		vecL.copy(this.velocity)
		posL.copy(this.position)
		posR.copy(this.position)
		//Check left and right of bug to see which smell value is higher
		//Probably can be done better with some big brain math, but the way it knows what's left and right of the bug is
		//Setting the velocity angle to increment or decrement and checking then offsetting that from the position and then checking the smell value
		vecR.setToPolar(0.07, this.incrementAngle(p,this.velocity.angle,1))
		vecL.setToPolar(0.07, this.decrementAngle(p,this.velocity.angle,1))
		posL.addMultiples(vecL, 300)
		posR.addMultiples(vecR, 300)
		this.posLeft = posL
		this.posRight = posR
		this.smellValueL = readHeatmapAt(posL)
		this.smellValueR = readHeatmapAt(posR)
		let smellValue2 = readHeatmapAt2(this.position)
		let smellValue2L = readHeatmapAt2(posL)
		let smellValue2R = readHeatmapAt2(posR)
		if(this.smellValueR[0] > this.smellValueL[0] ) {
			//console.log("R")
			this.velocity.setToPolar(speed, this.incrementAngle(p,this.velocity.angle,0.05))
			this.oldSmellVal = this.smellValue
		}
		else if(this.smellValueL[0] > this.smellValueR[0] ) {
			//console.log("L")
			this.velocity.setToPolar(speed, this.decrementAngle(p,this.velocity.angle,0.05))
			this.oldSmellVal = this.smellValue
		}
	
		

		if(smellValue2[2] === 240 || smellValue2R[2] === 240 || smellValue2L[2] === 240) {
			if(!this.dead) {
				this.dead = !this.dead
				console.log("ayo")
			} 
		}
		if(this.dead) {
			if(this.deathtimer <= 600) {
				this.velocity.mult(0)
				this.deathtimer++; 
				//console.log(this.deathtimer)
			}
			else {
				this.dead = !this.dead
				this.deathtimer = 0;
				this.velocity = Vector.polar(SLIDER.bugSpeed * 0.4, Math.random()*200)
			}
		}
		this.position.addMultiples(this.velocity, p.deltaTime)
		// Wraparound
		this.position[0] = (this.position[0]+p.width)%p.width
		this.position[1] = (this.position[1]+p.height)%p.height

		this.angle = this.velocity.angle

		
	}

	incrementAngle(p,angle, amt) {
		if(angle+amt > Math.PI) {
			return -1 * Math.PI
		}
			return angle + amt
	}

	decrementAngle(p,angle, amt) {
		if(angle-amt < -1 * Math.PI) {
			return Math.PI
		}
			return angle - amt
	}

	// incrementAngle(p,angle) {
	// 	if(angle > Math.PI) {
	// 		return -1 * Math.PI
	// 	}
	// 		return angle + 0.008
	// }

	drawDebug(p) {
		// p.circle(...this.position, 100)
		p.stroke(0, 0, 100)
		p.strokeWeight(3)
		p.fill(0)
		//p.text(this.smellValue, ...this.position)
		p.text(this.smellValue[0],...this.position)
		p.text(this.smellValueL[0],...this.posLeft)
		p.text(this.smellValueR[0], ...this.posRight)
		
	}

	draw(p) {
		// console.log(this.value)
		let themeColors = getThemeHSL()
		p.push()

		p.translate(...this.position)
		p.rotate(this.angle)
		if(this.dead) {
			p.fill(0)
		}
		else {
			p.fill(...themeColors.content)
		}
		// p.fill(0, 0, 100*this.smellValue[0]/255)

		p.noStroke()

		let bodyWidth = 20
		let bodyLength = 40
		p.ellipse(-bodyLength*.3, 0, -bodyLength, bodyWidth)

		// p.fill(0, 0, 30)
		p.circle(0, 0, bodyWidth, bodyWidth)
		
		p.pop()

		p.fill(100)
		p.circle(...this.posLeft, 20)
		p.circle(...this.posRight, 20)
		p.fill(0)
		p.circle(...this.posLeft, 10)
		p.circle(...this.posRight, 10)
	
	}


}


