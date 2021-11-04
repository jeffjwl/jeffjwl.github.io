// Create a particle system with an initialize, update, and draw function

// let mySystem = new BasicParticleSystem()
// mySystem.update()
// mySystem.draw()

class FoodParticleSystem {
	constructor() {
		this.food = []
		for (var i = 0; i < 5; i++) {
			this.food.push(new Food())
		}
	}

	update(p) {
		this.food.forEach(b => b.update(p))
	}

	// Draw INTO the heatmap
	drawHeatmap(p, heatmapScale) {
		this.food.forEach(food => {
            let t = p.millis() * 0.001
            p.push()
			p.noStroke()
            p.scale(1/heatmapScale)
            p.fill(255- food.stench*50*t%(100*food.stench), 0, 0)
            p.circle(...food.position, food.stench*50*t%(100*food.stench))
			p.fill(255,0,0)
			p.circle(...food.position, food.stench)
            p.pop()
        } ) 
	}

	getClosest(point, range) {
		let closestDist = range
		let closest = undefined

		this.food.forEach(b => {
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
			debugDrawHeatmap(p)
		}
		

		p.push()
		p.noStroke()
		// p.fill(0, 0, .2, .5)
		// // p.translate(p.width/2, p.height/2)
		// p.circle(0, 0, 100)
		this.food.forEach(b => b.draw(p))
		if (debugDraw) {
			this.food.forEach(b => b.drawDebug(p))
		}
		p.pop()
	}
}



class Food {
	constructor() {
		this.position = new Vector(Math.random()*400,Math.random()*300)
		this.stench = (Math.random() + 2) * 3;
        this.size = this.stench
		this.movementForce = new Vector(0,0)
		this.velocity = Vector.polar(0.7, Math.random()*200)
	}

	update(p) {
		let dt = p.deltaTime*.001
		// Don't update more than a tenth of a second at a time, even if we get out of sync
		dt = Math.min(.1, dt)
        this.stench = (SLIDER.foodAttraction/3) * this.size
		// this.position.addMultiples(30,p.deltaTime)
		// this.velocity.addMultiples(pt.borderForce, dt)
		// this.velocity.addMultiples(pt.wanderForce, dt)
		// this.velocity.addMultiples(pt.mouseAttractorForce, dt)
		let movementStrength = 3000 * SLIDER.foodDisplacement
		let wanderDirection = 15*(Math.random()-0.5)
		this.movementForce.setToPolar(movementStrength, wanderDirection)
		if(readHeatmapAt2(this.position)[1] >= 240 || readHeatmapAt2(this.position)[2] >= 240) {
			//console.log("tyo")
			this.velocity.addMultiples(this.movementForce,dt)
		}
		this.velocity.mult(1 - .01*SLIDER.friction)
		this.position.addMultiples(this.velocity,dt)
		
		// Wraparound
		this.position[0] = (this.position[0]+p.width)%p.width
		this.position[1] = (this.position[1]+p.height)%p.height
		
	}

	drawDebug(p) {
		// p.circle(...this.position, 100)
		let t = p.millis() * .001
		p.stroke(0, 0, 100)
		p.strokeWeight(3)
		p.fill(0)
		p.text(this.stench, ...this.position)
		p.text(255-this.stench*50*t%(100*this.stench), this.position[0]+(this.stench*50*t%(100*this.stench)/2) + 5, this.position[1]+this.size)
		this.velocity.drawArrow({p, 
				multiple:.4,
				center:this.position, 
				color:[0,0,0]}) 
	}
 
	draw(p) {
		// console.log(this.value)
        p.fill(255,10,0)
		p.push()
        p.circle(...this.position, 10*this.stench)
	}


}

