// Components for exploring an array of floats

//====================================================================================
// Breeding multiple arrays of floats

Vue.component("aof-population", {
	template: `<div class="aof-population section">

		<div class = "number-gen">
			Pop:<select v-model="controls.count" @change="reroll">
				<option>1</option><option>3</option><option>7</option><option>15</option>
			</select>
			<button class="emoji-button" @click="reroll">New Batch</button>
		</div>


	</div>`,

	mounted() {
		population.nextGeneration()
	},
	methods: {
		reroll() {
			population.nextGeneration({count:controls.count})
		}
	},

	data() {
		return {
			controls:controls,
			
		
		}
	},
})

//====================================================================================
// Looking at landmarks

Vue.component("aof-landmarks", {
	template: `<div class="aof-population section">
	

		<div v-if="false">
			<select v-model="app.xaxis">
				<option v-for="label in controls.selectedClass.labels">{{label}}</option>
			</select>
			<select v-model="app.yaxis">
				<option v-for="label in controls.selectedClass.labels">{{label}}</option>
			</select>
			<button class="emoji-button" @click="randomAxes">🎲</button>
		</div>

		<div>
			<div class = "title">Landmarks</div>
			<button class = "landmark-btn" v-for="(landmarkAOF,landmarkName) in controls.selectedClass.landmarks" @click="controls.selectedAOF.setValues(landmarkAOF, landmarkName)">{{landmarkName}}</button>
		</div>


		

	</div>`,
	data() {
		return {
			controls:controls,
			
		
		}
	},
	// props: ["app"]
})

//====================================================================================
// A set of sliders for a single AOF

Vue.component("aof-sliders", {
	template: `<div class="aof-view section" v-if="aof">
		<div class="contrast title">Rorschach AOF:{{aof.idNumber}}</div>
		<div class="controls-randomize">
			<button class="emoji-button" @click="aof.randomize()">randomize</button>
		</div>
		<div class = "controls">
			<div class = "sliders" v-for="(value,valIndex in aof.values">				
					<div class="label">{{aof.labels[valIndex]}}</div>
					<div class="slider-cell">
						<div class="slider-val">{{value.toFixed(3)}}</div>
						<input type="range" min="0" max="1" :step=".001" class="slider" :value="value" @input="ev => change(ev, valIndex)" />
					</div>
			</div>
		</div>
		<input class = "aofactual" v-model="aofinput" @keyup.enter='setFromInput'>
	</div>
	<div v-else>
	((no aof))
	</div>
	`,

	
	mounted() {
		this.updateValues()
	},
	watch: {
		"aof.values"() {
			this.updateValues()
		}
	},
	methods: {
		updateValues() {
			if (this.aof)
				this.aofinput = this.aof.valuesToString()
		},
		setFromInput() {
			let val = JSON.parse(this.aofinput)
			this.aof.setValues(val)
		},
		change(ev,  valIndex) {
			let val = parseFloat(ev.target.value)
			this.aof.set(valIndex, val)


		}
	},
	data() {
		return {
			animationMode: undefined,
			aofinput: ""
		}
	},
	props: ["aof"]
})
