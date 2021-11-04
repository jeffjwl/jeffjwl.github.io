


// Do setup
document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el: "#app",
		template: `<div id="app">
		<div id = first-col>
			<chat-widget :messages="messages" />
			
			<div id="controls">
				<div id = "inputs-wrapper">
					<input id = "text-input" ref="input" v-model="currentInput" @keyup="sayKey" @keyup.enter="enterInput">				
					<button id = "submit" @click="enterInput">Submit</button>
				</div>
				<div id = "buttons-wrapper">
					<button @click='deny()'>reject</button>
					<button @click="handleInput('Show me my order')">show order</button>
					<button @click='randomOrder()'>random order</button>
					<button @click="finishOrder()">finish order</button>
				</div>
				
			</div>
		</div>
		<div id = "dividerline"></div>	
		<menu-list :bot = "bot"/>
		</nav>
		</div>`,

		watch: {
			// currentInput() {
			// 	console.log('Input is now', this.currentInput)
			// },

			messages() {
				// console.log("messages", this.messages)
			}
		},

		methods: {
			sayKey() {
				console.log("KEY")
			},

			postToChat(text, owner, isSelf) {
				this.messages.push({
					text: `<p>${text}</p>`,
					isSelf: isSelf,
					owner: owner,
				})
			},

			enterInput() {
				let text = this.currentInput
				this.currentInput = ""

				
				this.handleInput(text)

			},

			handleInput(text) {
				// Does bot things
				this.postToChat(text, "customer", true)

				// Add to the messages in chat
			
				// Bot does something
				let output = this.bot.respondTo(text)

				setTimeout(() => {
					this.postToChat(output, "bot")
					
				}, Math.random()*100 + 400)

			},
			deny() {
				this.handleInput(`I don't want ${this.bot.menuFood[this.bot.chosen]}`)
			},
			randomOrder() {
				this.handleInput(`Order ${Math.floor(Math.random()*20)+1} ${this.bot.makePlural(this.bot.menuFood[Math.floor(Math.random() * this.bot.menuFood.length)])}`)
			},
			finishOrder() {
				this.handleInput(`That's all`)
			},
		},

		mounted() {

			console.log("Vue app is all set up....")
			setInterval(() => {
				// this.currentInput = randomMessage()

			}, 1000)

			this.bot.post = (text) =>  {
				// this is now the vue object
				this.postToChat(text, "bot")
			}
			this.bot.post(`Welcome to ${this.bot.generateChainName()}. Would you like to try our new ${this.bot.menu[this.bot.chosen]}?`)

		},
		

		data() {
			return {
				// Store the bot
				bot: new DriveThruBot(),

				// And the message
				messages: [],

				// And the current thing in the input
				currentInput: ""
			}
		}
	})	
})
