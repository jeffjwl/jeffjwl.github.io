class DriveThruBot {
	constructor() {
		this.grammar = tracery.createGrammar(dtgrammar)
		this.grammar.addModifiers(baseEngModifiers)
		this.menuCount = 9;

		this.rejectionCount = 0;
		this.anythingElseState = false;
		this.boughtBool = false
		this.done = false
		this.chosen = Math.floor(Math.random() * this.menuCount)
		//Adjectives aren't all generated with one Tracery call so that they can be referenced later if necessary
		this.menuGood = new Map()
		this.menuBad = new Map()
		this.menuFood = dtgrammar.meals //Originally supposed to generate random meals, but would get repeats which made ordering difficult
		this.menu = []
		this.order = []
		this.amounts = new Map()


		for(let i = 0; i < this.menuCount; i++) {
			this.menuGood[this.menuFood[i]] = this.grammar.flatten("#adjGood#")
			this.menuBad[this.menuFood[i]] = this.grammar.flatten("#adjSus#")
			this.menu.push(`${this.menuBad[this.menuFood[i]]}, ${this.menuGood[this.menuFood[i]]} ${this.menuFood[i]}`)
			this.amounts[this.menuFood[i]] = 0;
		}
		this.menu.forEach(e => console.log(e))
		console.log(this.menu[this.chosen])
	}

	respondTo(s) {
		console.log("User said", s)

		//If you ordered what the dude wants you to order he closes
		if(this.done) {
			return `${s} machine broke we closed for the night`
		}

		//Show order command
		if((s.toLowerCase().includes("my") || s.toLowerCase().includes("show")) && s.toLowerCase().includes("order")) {
			let orderList = "ORDER<br>"
			this.order.forEach(item => orderList += `${this.makePlural(item)} ----- ${this.amounts[item]} <br>`)
			if(orderList === "ORDER<br>") {
				return "Nothing ordered."
			} 
			else {
				return orderList
			}
		}

		if(s.toLowerCase().includes("that's all") || s.toLowerCase().includes("finish order") || s.toLowerCase().includes("thats all")) {
			if(this.order.length === 0) {
				return "bruh you didn't even order anything"
			}
			else if(!this.boughtBool){
				return this.rejectionResponse()
			}
			else {
				//console.log("yow")
				this.done = true;
				return this.sayOrder() + ". My pleasure."
			}
		}
		//Deny getting anything more
		if(this.anythingElseState) {
			if(s.toLowerCase().includes("no")) {
				//this.anythingElseState = !this.anythingElseState
				if(this.boughtBool) {
					this.done = true;
					return this.sayOrder() + ". My pleasure."
				}
				else {
					return this.rejectionResponse()
				}
			}
			else if(s.toLowerCase().includes("yes")) {
				return "What else would you like?"
			}
		}

		//Check if food is in the text, then order
		if (this.menuFood.filter(e => s.toLowerCase().includes(e)).length > 0) {
			let currOrder = this.menuFood.filter(e => s.toLowerCase().includes(e))
			//console.log(currOrder)
			if(currOrder.includes(this.menuFood[this.chosen])) {
				if(s.toLowerCase().includes("don't want") || s.toLowerCase().includes("dont want")) {
					if(!this.boughtBool) {					
						return this.rejectionResponse()
					}
					else
						return this.grammar.flatten("Aww that's too bad, you already bought it... #insults#.")
				} 
				else {
					if(!this.boughtBool) {
						this.boughtBool = true;
						this.post(this.grammar.flatten("haha you <i>#insults#</i>! I can't believe you actually bought it, #insults#!").toUpperCase())
					}
					else {
						this.post(`Ah yes, consume more <i>${this.menu[this.chosen]}s</i>`)
					}
				}
				this.addToOrder(s,currOrder)
				this.anythingElseState = true;
			}
			else {
				if(!this.boughtBool) {
					this.post(this.grammar.flatten(`I'll let you in on a secret, the ${currOrder[0]} is also #adjSus#, I think you're gonna want something else... A #adjGood#, ${this.menuGood[this.menuFood[this.chosen]]} ${this.menuFood[this.chosen]}, perhaps?`))
					//this.post(this.grammar.flatten(``))
				}
				this.addToOrder(s,currOrder)
				this.anythingElseState = true
			}	
		}
		if(this.anythingElseState) {
			return "Anything else?"
		}

		
		return `We don't got ${s} on the menu.`
	}

	rejectionResponse() {
		let rejectionThresh = 4
		let retString = this.rejectionCount < rejectionThresh ? this.grammar.flatten(`#rejectionStarter#. Just buy the ${this.menuFood[this.chosen]}. I have #responsibilities#, please.`) : this.grammar.flatten(`#rejectionStarter#. Just buy the ${this.menu[this.chosen]}. I have #responsibilities# and I got #responsibilities#!!`).toUpperCase()
		this.rejectionCount++;
		if(this.rejectionCount < rejectionThresh+1) {
			return retString
		}
		else {
			this.post(retString)
			return this.grammar.flatten(`ehem... uh so you want the ${this.menuFood[this.chosen]}, did I mention it's also #adjGood#?`)		
		}
		
	}

	getAmountOrdered(s, food) {
		let input = s.split(" ")
		let foodAnalyze = (food.includes(" ")) ? food.split(" ")[0] : food
		let ind = input.indexOf(foodAnalyze) - 1
		if(ind < 0) {
			if(input.indexOf(this.makePlural(food)) - 1 >= 0){
				ind = input.indexOf(this.makePlural(food)) - 1
			}
			else
				return 1;
		}
		let amount = input[ind]
		if(amount === "a" || amount === "an") {
			return 1;
		}
		else if(text2num(amount) !== 0){
			return text2num(amount)
		}
		else if(isNumeric(amount)){
			return parseInt(amount)
		} 
		else {
			return 1;
		}
	}
	addToOrder(s, orderedFood) {
		let orderConf = "Added "
		let firstIter = true;
		orderedFood.forEach(food => {
			let amt = this.getAmountOrdered(s, food)
			this.amounts[food] = this.amounts[food] + amt;
			if(!this.order.includes(food)){
				this.order.push(food)
			}
			orderConf += firstIter ? `${amt} ${amt === 1 ? food : this.makePlural(food)}` : `, ${amt} ${amt === 1 ? food : this.makePlural(food)}`
			firstIter = false;
		})
		this.post(orderConf)
	}

	makePlural(str) {
		if(str[str.length-1] === "h") {
			return str += "es"
		}
		return (str[str.length-1] === "s") ? str : str + "s";
	}

	sayOrder() {
		let str = "Your order is "
		let firstIter = true;
		for(let i = 0; i < this.order.length; i++) {
			let food = this.order[i]
			let amt = this.amounts[food]
			str += firstIter ? `${amt} ${amt === 1 ? food : this.makePlural(food)}` : `, ${amt} ${amt === 1 ? food : this.makePlural(food)}`
			firstIter = false;
		}
		return str
	}

	generateChainName() {
		return this.grammar.flatten("#nameStart##nameEnd#")
	}
}