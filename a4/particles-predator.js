// Create a particle system with an initialize, update, and draw function

// let mySystem = new BasicParticleSystem()
// mySystem.update()
// mySystem.draw()

class PredatorParticleSystem {
	constructor() {
		this.predator = []
		for (var i = 0; i < 2; i++) {
			this.predator.push(new Predator())
		}
	}

	update(p) {
		this.predator.forEach(b => b.update(p))
	}

	// Draw INTO the heatmap
	drawHeatmap2(p, heatmapScale) {
		p.fill(0, 0, 0, 3)
		p.rect(0, 0, p.width, p.height)
		p.push()
		p.scale(1/heatmapScale)
		p.fill(255, 0, 0)
		p.noStroke()
		this.predator.forEach(b => {
			p.fill(0, 0, 255)

			// Draw *behind* the bug
			let pos = Vector.addMultiples(b.position, 1, b.velocity, -200)
			p.circle(...pos, 40)
		})
		p.pop()
	}

	getClosest(point, range) {
		let closestDist = range
		let closest = undefined

		this.predator.forEach(b => {
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
		this.predator.forEach(b => b.draw(p))
		if (debugDraw) {
			this.predator.forEach(b => b.drawDebug(p))
		}
		p.pop()
	}
}



class Predator {
	constructor() {
		this.position = new Vector(Math.random()*400,Math.random()*300)
		this.posLeft = new Vector(0,0)
		this.posRight = new Vector(0,0)
		this.velocity = Vector.polar(SLIDER.bugSpeed * 0.4, Math.random()*200)
		this.smellValue =[0,0,0]
		this.smellValuesL = [0,0,0]
		this.smellValuesR = [0,0,0]
		this.angle = 0
		this.positionBody = []
		this.eaten = 0;
		for(let i = 0; i < this.eaten + 1; i++) {
			this.positionBody.push(this.position.slice().add(this.velocity.slice().addPolar(20*i, this.angle)))
		}

	}

	update(p) {
		//console.log(this.positionBody)
		this.oldVelocity = this.velocity;
		let dt = Math.min(.1, p.deltaTime*.001)
		let t = p.millis()*.001
		this.smellValue = readHeatmapAt(this.position)
		let speed = SLIDER.bugSpeed * 0.4
		let right = true;
		//Found out how to do it the smart way
        this.smellValueL = readHeatmapAt2(this.position.slice().add(this.velocity.slice().addPolar(20, this.angle + 1)))
		this.smellValueR = readHeatmapAt2(this.position.slice().add(this.velocity.slice().addPolar(20, this.angle - 1)))
		this.posLeft = this.position.slice().add(this.velocity.slice().addPolar(20, this.angle - Math.PI/4))
		this.posRight = this.position.slice().add(this.velocity.slice().addPolar(20, this.angle + Math.PI/4))
		
	
		if(this.smellValueR[1] > this.smellValueL[1] ) {
			//console.log("R")
			this.velocity.setToPolar(speed, this.incrementAngle(p,this.velocity.angle,0.05))
			this.oldSmellVal = this.smellValue
			right = true;
		}
		else if(this.smellValueL[1] > this.smellValueR[1] ) {
			//console.log("L")
			this.velocity.setToPolar(speed, this.decrementAngle(p,this.velocity.angle,0.05))
			this.oldSmellVal = this.smellValue
			right = false;
		}
	
		if(this.smellValue[1] > 200 || this.smellValueR[1] > 200 || this.smellValueL[1] > 200) {
			this.velocity.setToPolar(0.5, this.velocity.angle)
			console.log("yo")
		}
		if(this.smellValue[1] > 240 || this.smellValueR[1] > 240 || this.smellValueL[1] > 240) {
			this.eaten++;
		}
		this.position.addMultiples(this.velocity, p.deltaTime)
		

		// Wraparound
		this.position[0] = (this.position[0]+p.width)%p.width
		this.position[1] = (this.position[1]+p.height)%p.height

		this.angle = this.velocity.angle
		for(let i = 0; i < this.eaten+1; i++) {
			this.positionBody[i] = this.position.slice().add(this.oldVelocity.slice().addPolar(20*i, this.angle - Math.PI))
		}
			
		
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
		p.text(this.smellValue[1],...this.position)
		p.text(this.smellValueL[1],...this.posLeft)
		p.text(this.smellValueR[1], ...this.posRight)
		
	}
	
	draw(p) {
		// console.log(this.value)
		let themeColors = getThemeHSL();
		p.push()

		p.translate(...this.position)
		p.rotate(this.angle)
		p.fill(...themeColors.content)

		p.noStroke()

		let bodyWidth = 20
		let bodyLength = 40
		p.circle(0, 0, 60)
		

		p.pop()
		p.fill(...themeColors.content)
		this.positionBody.forEach(e => {p.circle(...e,50)})
		p.fill(100)
		p.circle(...this.posLeft, 20)
		p.circle(...this.posRight, 20)
		p.fill(0)
		p.circle(...this.posLeft, 10)
		p.circle(...this.posRight, 10)
	
	}


}


