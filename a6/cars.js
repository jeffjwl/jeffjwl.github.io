class Car {
    constructor(initv, initacc, variance, spdlimit) {
        this.velocity = initv;
        this.acceleration = initacc;
        this.speedlim = spdlimit;
        this.speedvar = variance    
		this.maxSpeed = this.speedlim - Math.floor(Math.random() * variance)
        this.mergeL = false
        this.mergeR = false
        this.wrapped = false;
        this.stepTimer = this.speedlim * 8
        this.stepProg = this.stepTimer
        this.isBraked = false
        this.brakeTimer = 0
    }

    stepSpdAlt() {
        if(this.isBraked && this.brakeTimer < 3) {
            this.brakeTimer++
            this.velocity = 0;
            this.stepProg = this.stepTimer
        }
        else {
            let speedVariance = (Math.random() - 0.5) * this.speedvar / 150
            //console.log(speedVariance)
            if(this.isBraked) {
                this.brakeTimer = 0
                this.isBraked = false;
                this.velocity = 0
            }     
            
            // if(this.velocity >= this.stepTimer) {
            //     this.velocity = this.stepTimer - 1              
            // }
            if(this.velocity >= this.stepTimer) {
                this.acceleration = -3
            }
            else if(this.velocity <= this.stepTimer/5) {
                this.acceleration = 2
            }
            else {
                this.acceleration = 1
            }

            if(this.stepProg <= 0) {
                this.stepProg = this.stepTimer
            }
            this.stepProg -= this.velocity
            this.velocity += this.acceleration + speedVariance
        }
    }

    //Bunch of setter and getter functions that I thought were necessary, still good practice ig tho
    getVelocity() {
        return this.velocity
    }

    setVelocity(num) {
        this.velocity = num;
    }
    
    decAcceleration() {
        this.acceleration = this.acceleration >= 0 ? 0 : this.acceleration--;
    }
    incAcceleration() {
        this.acceleration++;
    }
    setAcceleration(num) {
        this.acceleration = num;
    }
    getAcceleration() {
        return this.acceleration;
    }

    getMaxSpeed() {
        return this.maxSpeed
    }

    isMergeL() {
        return this.mergeL
    }
    isMergeR() {
        return this.mergeR
    }

    setMerge(str) {
        if(str === "L") {
            this.mergeL = true
        }
        else if(str === "R") {
            this.mergeR = true
        }
    }

    setMergeFalse() {
        this.mergeL = false
        this.mergeR = false
    }

}