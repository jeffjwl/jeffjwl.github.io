function randomMessage() {
	let count = (Math.random()**3) *10
	let text = Math.random().toString(36).substring(7);
	for (var i = 0; i < count; i++) {
		text += " " + Math.random().toString(36).substring(Math.random()*15);
	}
	return text
}

Vue.component("chat-message", {
	template:`<div class="chat-row"  :class="rowClasses">
		<div class="chat-owner" v-if="owner" v-html = "chatFace">{{chatFace}}</div>
		<div class="chat-message" :class = "message.owner" v-html="message.text"></div>
	</div>`,

	mounted() {

		// console.log("I'm a message")
		this.$el.scrollIntoView({behavior: 'smooth'});
	},
	computed: {
		owner() {
			return this.message.owner
		},
		rowClasses() {
			
			let c = {
				"self": this.owner && this.message.isSelf
			}
			if (this.message.type) {
				c["chat-msg-" + this.message.type] = true
			}
			return c
		},
		chatFace() {
			if(this.message.owner === "bot") {
				return `<svg class = "bot-face" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M25.5 12.5C25.5 19.4036 19.4498 25 11.9865 25C7.13696 25 2.88407 22.6371 0.500002 19.088L11.9865 12.5L0.500002 5.91197C2.88407 2.36291 7.13696 0 11.9865 0C19.4498 0 25.5 5.59644 25.5 12.5Z" fill="#C4C4C4"/>
				<ellipse rx="1.35135" ry="1.25" transform="matrix(-1 0 0 1 15.3513 5.25)" fill="#E5E5E5"/>
				</svg>`
			}
			else if(this.message.owner === "customer") {
				return `<svg class = "customer-face" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0.5 12.5C0.5 19.4036 6.55021 25 14.0135 25C18.863 25 23.1159 22.6371 25.5 19.088L14.0135 12.5L25.5 5.91197C23.1159 2.36291 18.863 0 14.0135 0C6.55021 0 0.5 5.59644 0.5 12.5Z" fill="#C4C4C4"/>
				<ellipse cx="10.6487" cy="5.25" rx="1.35135" ry="1.25" fill="#E5E5E5"/>
				</svg>`
			}
		}
	},

	props: {
		message: {
			required: true
		}
	}
})

Vue.component("chat-widget", {
	template: `
		<div class="chat-widget">
			<div class="messages">
				<chat-message 
					v-for="(msg,msgIndex) in messages" 
					:key="msgIndex" 
					:id="'msgrow'+msgIndex"
					:message="msg" />
			</div>

		</div>
	`,
	
	props: {
		messages: {
			required: true,
			type: Array
		}
	},

})

Vue.component("menu-list", {
	template: `
		<div class="menu">
			<h2 class = "header" id = "menu-header">Menu</h2>
			<ul>
				<li class = "menu-item text" v-for="(item, ind) in bot.menu" @click="clickMenu(bot.menuFood[ind])">{{ind+1}}. {{item}}</li>
			</ul>
		</div>
	`,
	props: {
		bot: {
			required: true
		}
	},
	methods: {
		clickMenu(item) {
			this.$parent.handleInput(`Order ${item}`)
		}	
	}

})