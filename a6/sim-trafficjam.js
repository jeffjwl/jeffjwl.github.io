

class TrafficJamSimulation {
	// Some number of grids
	constructor(mode, dimensions, tileSize) {
		this.idNumber = simCount++
		// Mode can control various factors about the simulation
		this.dimensions = dimensions
		this.mode = mode
		this.tileSize = tileSize
		this.speedLimit = 10
		this.variance = 3
		this.selectedCell = [3, 4]
		this.stepCount = 0
		
		this.cars = createGrid(...dimensions)

		// Set up the grid with its initial values
		this.initialize()
	}


	initialize() {
		console.log("init!")
		setGrid(this.cars, (x,y) => {
			if (Math.random() < .1)
				return new Car(Math.floor(Math.random() * 4) + 1, 0.1, 5, this.speedLimit)
		})
		if(this.mode === "synchronized flow") {
			setGrid(this.cars, (x,y) => {
				if((x+y) % 5 === 0 ) {
					return new Car(5, 0, 0, this.speedLimit)
				}
			})
		}
		if(this.mode === "speed variation") {
			setGrid(this.cars, (x,y) => {
				if((x+y) % 5  === 0  ) {
					return new Car(5, 0.1, 10, this.speedLimit)
				}
			})
		}
		if(this.mode === "less lanes") {
			setGrid(this.cars, (x,y) => {
				if((x+y) % 3  === 0  ) {
					return new Car(5, 0.1, 10, this.speedLimit)
				}
			})
		}
		if(this.mode === "more lanes") {
			setGrid(this.cars, (x,y) => {
				if((x+y) % 8  === 0  ) {
					return new Car(5, 0.1, 10, this.speedLimit)
				}
			})
		}
	}



	// When we update the simulation, 
	// we want write our next moves into a temporary "next-step" grid
	// And then once all the updates are done, 
	// copy that back into the original grid 

	step() {
		this.stepCount++;

		let tempGrid = createGrid(...this.dimensions)
		let wraparounds = []
		let save = []
		let mergers = []
		let forwards = []
		setGrid(tempGrid, (x, y) => {
			let car = this.cars[x][y]
			if (car !== undefined) {

				//Check the flows of surrounding car lanes
				let currFlow = this.getFlow(y).toPrecision(3)
				let leftFlow = this.getFlow(this.wrapCheckY(y-1)).toPrecision(3)
				let rightFlow = this.getFlow(this.wrapCheckY(y+1)).toPrecision(3)
				//If conditions are met, then merge 
				if(car.getVelocity() > this.speedLimit*1/3) {	
					if(!(car.isMergeL() || car.isMergeR())) {
						if(Math.random() > 0.95) {
							
							if((leftFlow > rightFlow && leftFlow > currFlow) || leftFlow === 100) {
								car.setMerge("L")
							}
							else if((rightFlow > leftFlow && rightFlow > currFlow) || rightFlow === 100) {
								car.setMerge("R")
							}
							else if(rightFlow === leftFlow && rightFlow > currFlow) {
								car.setMerge("L")
							}
						}
					}
				}
				//Car braking and slow down conditions
				let slowDown = this.isACarForwards(x,y)
				if(slowDown) {
					let frontCar = this.cars[slowDown[1]][y]
					let frontVel = frontCar.getVelocity()
					let carVel = car.getVelocity()				
					if(slowDown[0] === 1) {
						car.isBraked = true;
					}
					else if(slowDown[0] === 2 && carVel <= frontVel) {
						car.setVelocity(carVel/4)
		
					}
					else if(slowDown[0] === 3 && carVel <= frontVel) {
						car.setVelocity(carVel/2)
					}
					else if(slowDown[0] === 4 && carVel <= frontVel) {
						car.setVelocity(carVel*2/3)
					}
				}
				
				//A little buggy, but check if car is at the back of a jam and try to merge else where
				if(this.isAtBackJam(x,y)) {	
					car.stepProg = -1
					car.isBraked = false
					if(Math.random() > 0.5) {
						if(this.checkRight(x,y)) {
							car.setMerge("R")
						}
						else if(this.checkLeft(x,y)) {
							car.setMerge("L")
						}
					}
				}
				
				//Car movement can be either a merge, forwards, or no movement per step
				if(car.stepProg <= 0) {											
					//console.log("YO")
					if(x === this.dimensions[0]-1) {
						wraparounds.push([x,y,car])
					}
					else if(car.isMergeL() && this.checkLeft(x,y)) {
						mergers.push([this.wrapCheckX(x+1),this.wrapCheckY(y-1),car])
						car.setMergeFalse()
					}
					else if(car.isMergeR() && this.checkRight(x,y)) {
						mergers.push([this.wrapCheckX(x+1),this.wrapCheckY(y+1),car])
						car.setMergeFalse()
					}
					else {
						forwards.push([x+1,y,car])
						car.setMergeFalse()
					}
				}
				else {
					//car.stepSpd()
					save.push([x,y,car])
				}
				
				car.stepSpdAlt()				
			}

		})
		// Swap all the buffers: copy the nextGrid into the current grid
		copyGrid(this.cars, tempGrid)

		//HOLY SHIT IT TOOK ME FOREVER TO FIGURE THIS OUT
		//OH MY GOD 
		//This allows the cars to wrap around the board. setGrid is written in row-major order, so you can't update 
		//things that are after it on the board, I had to change the setGrid function to go in row-reverse and keep these
		//values 
		wraparounds.forEach(e => {
			//console.log(e)
			this.cars[0][e[1]] = e[2]
		})

		save.forEach(e => {
			//console.log(e)
			this.cars[e[0]][e[1]] = e[2]
		})

		mergers.forEach(e => {
			//console.log(e)
			this.cars[e[0]][e[1]] = e[2]
		})

		forwards.forEach(e => {
			//console.log(e)
			if(this.cars[e[0]][e[1]]) {
				this.cars[e[0]-1][e[1]] = e[2]
			}
			else {
				this.cars[e[0]][e[1]] = e[2]
			}
		})
		

		

	}



	draw(p) {
		// Draw each cell
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let themeColors = getThemeHSL()
		p.background(...themeColors.content)

		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				this.drawCell(p, i, j)
				if(this.debugMode) {
					this.drawDebugCell(p,i,j)
				}
			}
			
		}
		if(this.debugMode) {
			for(let j = 0; j < h; j++) {
				p.textSize(10)
				p.text(this.getFlow(j),10,j*this.tileSize)
			}
			this.drawSquare(p, ...this.selectedCell)
			let dbgcar = this.cars[this.selectedCell[0]][this.selectedCell[1]]
			let ts = this.tileSize
			let px = this.selectedCell[0] * ts
			let py = this.selectedCell[1] * ts
			let x = this.selectedCell[0]
			let y = this.selectedCell[1]
			let currFlow = this.getFlow(y).toPrecision(3)
			let leftFlow = this.getFlow(this.wrapCheckY(y-1)).toPrecision(3)
			let rightFlow = this.getFlow(this.wrapCheckY(y+1)).toPrecision(3)
			if(dbgcar) {
				p.push()
				p.textSize(13)
				p.fill(0,100,50)
				p.text(dbgcar.getVelocity().toPrecision(3),px,py+ts/2)
				p.text(dbgcar.getAcceleration().toPrecision(3),px,py+ts/2+13)
				p.text(dbgcar.stepProg.toPrecision(3),px,py+ts/2-13)
				p.text("leftFlow: " + leftFlow,px+2*ts,py)
				p.text("currFlow: " + currFlow,px+2*ts,py+13)
				p.text("rightFlow: " + rightFlow,px+2*ts,py+26)
				p.text(this.isAtBackJam(x,y),px+ts,py+39)
				p.pop()
			}		
		}
	
	}

	

	// Draw a cell.  Add emoji or color it
	drawCell(p, x, y) {
		let themeColors = getThemeHSL()
		let w = this.tileSize
		let px = (x)*w
		let py = (y)*w
		let yOff = this.tileSize/2
		let xOff = this.tileSize/5
		let car = this.cars[x][y]
		
		p.fill(themeColors.secondary[0],themeColors.secondary[1],themeColors.secondary[2]-10)
		
		p.noStroke()
		if(x % 2 === 0 && y % 2 === 0) {
			p.rect(px,py,w-xOff,2)
		}
		else if(x % 2 === 0){
			p.rect(px+w,py,w-xOff,2)
		}
		if(car) {
			p.push()
			let acc = Math.floor(((car.stepProg-car.stepTimer)/car.stepTimer) * w)
			p.noStroke()
			p.translate(px,py)
			p.rotate(0)
			//p.rect(-acc+xOff+2,w/5,xOff,w-w/2.5,5,5)
			///p.rect(-acc+w-w/2.5+2,w/5,xOff,w-w/2.5,5,5)
			p.fill(themeColors.main[0],themeColors.main[1]+20,themeColors.main[2]-10)
			p.rect(-acc+xOff,yOff/2,w-xOff,w-yOff,2,4,4,2)
			p.fill(...themeColors.secondary)
			p.rect(-acc+w/1.8,yOff/1.9,8,yOff-2,2,5,5,2)
			
			p.fill(54,70,70)
			p.rect(-acc+xOff+w/1.38,w/2-w/5,w/12,w/10,3,2,2,3)
			p.rect(-acc+xOff+w/1.38,w/2+w/12,w/12,w/10,3,2,2,3)
			if(car.isBraked) {
				p.fill(0,50,50)
				p.rect(-acc+xOff,w/2-w/4.8,4,5,3,2,2,3)
				p.rect(-acc+xOff,w/2+w/12,4,5,3,2,2,3)
				p.fill(0,50,50,0.3)
				p.rect(-acc+xOff-w/6,w/4,10,w/2,3,2,2,3)
				
			}
			else {
				p.fill(54,80,70)
				p.rect(-acc+xOff,w/2-w/4.8,4,5,3,2,2,3)
				p.rect(-acc+xOff,w/2+w/12,4,5,3,2,2,3)
				// p.fill(54,80,70,0.3)
				//p.rect(-acc+xOff-w/6,w/4,10,w/2,3,2,2,3)
				
			}
			if(car.isMergeL()) {
				p.fill(0,50,50)
				p.rect(-acc+xOff+w/2.2,w/6,3,4,1,1,0,0)
				p.rect(-acc+xOff+w/1.38,w/2-w/5,w/12,w/10,3,2,2,3)
				p.fill(themeColors.main[0],themeColors.main[1]+20,themeColors.main[2]-10)				
				p.rect(-acc+xOff+w/2.2,w-w/4,3,4,0,0,1,1)
				p.fill(0,50,50,0.3)
				p.rect(-acc+xOff+w/2,w/2/12,20,15,3,2,2,3)
			}
			else if(car.isMergeR()) {
				p.fill(0,50,50)
				p.rect(-acc+xOff+w/2.2,w-w/4,3,4,0,0,1,1)
				p.rect(-acc+xOff+w/1.38,w/2+w/12,w/12,w/10,3,2,2,3)
				p.fill(themeColors.main[0],themeColors.main[1]+20,themeColors.main[2]-10)
				p.rect(-acc+xOff+w/2.2,w/6,3,4,1,1,0,0)
				p.fill(0,50,50,0.3)
				p.rect(-acc+xOff+w/2,w/2+w/12,20,15,3,2,2,3)
				
			}
			else {
				p.fill(themeColors.main[0],themeColors.main[1]+20,themeColors.main[2]-10)
				p.rect(-acc+xOff+w/2.2,w/6,3,4,1,1,0,0)
				p.rect(-acc+xOff+w/2.2,w-w/4,3,4,0,0,1,1)		
			}
			
			
			p.pop()
		}

	}

	drawDebugCell(p,x,y) {
		let w = this.tileSize
		let px = (x)*w
		let py = (y)*w
		
		let car = this.cars[x][y]
		p.textSize(10)
		if(car) {
			let coeff = Math.floor(this.speedLimit + this.variance - Math.max(0, car.getVelocity()))
			let acc = (this.stepCount % coeff) / coeff * this.tileSize
			p.text(car.getVelocity().toPrecision(3),px+acc,py)
			p.text(`${car.isMergeL() ? "left: " + this.checkLeft(x,y): ""}`,px, py-30)
			p.text(`${car.isMergeR() ? "right: " + this.checkRight(x,y): ""}`,px, py-30)
		}
	}

	//=====================================================
	// Mouse interactions

	select(x, y) {
		// console.log("Select", x, y)
		this.selectedCell = [x, y]
	}

	click(x, y) {
		console.log("Click", x, y)
		// if(this.debugMode)
		// 	this.cars[this.selectedCell[0]][this.selectedCell[1]] = new Car(5, 0.1, 10, this.speedLimit)
	}

	drag(x, y) {
		//this.values[x][y] = 1
	}



	//=====================================================
	// Utility functions

	toggleDebugInfo() {
		this.debugMode = !this.debugMode
	}

	// Handy utility to draw a single grid 
	drawSquare(p, col, row) {
		let w = this.tileSize
		let x = (col + .5)*w
		let y = (row + .5)*w
		p.rect(x - w/2, y - w/2, w, w)
	}

	// Handy utility to draw text 
	drawText(p, col, row, text) {
		let w = this.tileSize
		let x = (col + .5)*w
		let y = (row + .5)*w
		p.text(text, x - w/2, y - w*.1)
	}

	// Is this cell selected?
	isSelected(x, y) {
		return (this.selectedCell && this.selectedCell[0] == x && this.selectedCell[1] === y)
	}


	//Definitely a lot better way to do this but I am not capable of thought atm
	isACarForwards(x,y) {
		let w = this.dimensions[0]		
		for(let i = 1; i < 5; i++) {
			let currX = (x+i+w) % w
			let currcar = this.cars[currX][y]
			if(currcar) {
				return [i, currX]
			}
		}
		return false
	}

	wrapCheckY(y) {
		if(y <= -1) {
			return this.dimensions[1]-1
		}
		if(y >= this.dimensions[1]) {
			return 0
		}
		else {
			return y
		}
	}
	

	wrapCheckX(x) {
		if(x <= -1) {
			return this.dimensions[0]-1
		}
		else if(x >= this.dimensions[0]) {
			return 0
		}
		else {
			return x
		}
	}


	getFlow(y) {
		let count = 0;
		let sumVel = 0;
		//console.log(this.dimensions[0])
		for(let i = 0; i < this.dimensions[0]; i++) {
			let car = this.cars[i][y]
			if(car) {
				count++;
				sumVel += car.getVelocity()
			}
		}

		return (count === 0 ? 100 : sumVel/count) - (count * this.speedLimit/4)
	}

	checkLeft(x,y) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let xB = x - 1
		let xB2 = x - 2
		let xF = x + 1
		let yL = y-1
		xB = (xB + w)%w
		xB2 = (xB2 + w)%w
		xF = (xF + w)%w
		yL = (yL + h)%h
		return (this.cars[xB][yL] === undefined) && (this.cars[xF][yL] === undefined) && (this.cars[x][yL] === undefined) && (this.cars[xB2][yL] === undefined) 
	}

	checkRight(x,y) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let xB = x - 1
		let xB2 = x - 2 
		let xF = x + 1
		let yR = y+1
		xB = (xB + w)%w
		xB2 = (xB2 + w)%w
		xF = (xF + w)%w
		yR = (yR + h)%h
		return (this.cars[xB][yR] === undefined) && (this.cars[xF][yR] === undefined) && (this.cars[x][yR] === undefined) && (this.cars[xB2][yR] === undefined) 
	}

	isAtBackJam(x,y){
		let w = this.dimensions[0]
		
		for(let i = 1; i < 4; i++) {
			let currX = (x+i+w) % w
			let currcar = this.cars[currX][y]
			if(currcar) {
				if(!(currcar.stepProg+10 >= currcar.stepTimer)) {
					return false
				}
			}
			else {
				return false;
			}
		}
		for(let i = 2; i > 0; i--) {
			let currX = (x-i+w) % w
			let currcar = this.cars[currX][y]
			if(currcar) {
				return false
			}
		}
		//console.log("atback")
		return true
	}

}