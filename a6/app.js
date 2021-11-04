	
let simCount = 0

let noise = (new p5()).noise

document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el : "#app",
		template: `<div id="app">
			<p class= "sim-paragraph">
			Ever wonder why traffic jams occur seemingly out of nowhere? Even when there aren't any accidents, roadwork, or anything at all? 
			Chances are, the reason for that is  simply just human error. Even when you're trying to maintain your distance and keep a constant speed and acceleration 
			as everyone else on the road, you're bound to slow down or speed up a just little bit more than you intended. These variations in speed from one
			car to another will inevitably cause a car to brake, even if it's just a little bit, making each successive car behind it brake 
			more strongly than the last. This creates a wave of braking that creates sections of stop and go traffic. In this simulation, we'll explore how the 
			minute changes in speed drivers make can create a large impact in the overall flow of traffic. 
			<br><br>
			Before we get into the first simulation, here's a small guide on it: <br>
			</p>
			<ul class = "sim-rules-list">
				<li class= "sim-paragraph sim-list">Cars will accelerate until they can move forward one grid space per step.</li> 
				<li class= "sim-paragraph sim-list">If a car detects a slower car that is up four grid spaces in front if it, it will attempt to decelerate. 
				<li class= "sim-paragraph sim-list">If there is a car directly in front of another car, the car in back will brake. Braked cars will be indicated with a red light behind them</li>
				<li class= "sim-paragraph sim-list">If a car detects that the traffic to the lane right or left of it has better flow, it has a chance to decide to merge lanes in that direction.
											  		It might also attempt to merge lanes if it detects if it's in the back of a traffic jam (this is a little buggy though).
											  		Cars that are attempting to merge will be indicated by a red light on the side mirror and headlight of their corresponding direction.</li>
				<li class= "sim-paragraph sim-list">Cars that have decided to merge will only merge if there are no cars too close to them in the direction they're trying to merge.</li> 							  
			</ul>
			<p class= "sim-paragraph">
			<br><br>
				In this first simulation, there are 35 cars spaced equally apart from each other spanning 5 lanes. They all start out with the same initial velocity
				and acceleration, but there is a very small random variation in the drivers' accelerations. Due to these minute variations, you'll
				see that some braking will occur, causing a shockwave of braking in some lanes. Cars will also attempt to merge because of the variable speeds,
				which has the effect of improving flow for the lane that it was just in, but may cause problems in the lane they merged into due to higher car density and the chance that it
				merges right in front a vehicle.   
			</p>
			<simulation type="TrafficJamSimulation" mode="speed variation" :dimensions="[35,5]" :tileSize="40" speed="100"/>
			<p class= "sim-paragraph">
			<br><br>
				Now what would in a perfect world where everyone maintained the same distance, acceleration and speed? This simulation is built on the exact same conditions as the last one,
				but now there's no variance/"human error" in the drivers' speeds. This results in all the cars accelerating to their peak speeds without any need for braking, a state
				known as "synchronized flow." In the real world, this could feasably happen with self driving cars that can communicate speeds and accelerations with the cars around them.
			</p>
			<simulation type="TrafficJamSimulation" mode="synchronized flow" :dimensions="[35,5]" :tileSize="40" speed="100"/>	
			<p class= "sim-paragraph">
			<br><br>
				Another way to drastically improve traffic flow is to decrease the density of cars, this can most easily be done by adding more lanes. However, even with more lanes, small
				hiccups are still bound to exist. The first simulation below has 35 cars and three lanes. The high density of traffic creates an almost perpetual traffic jam. The second simulation
				below has the same amount of cars, but with eight lanes. You'll notice that less traffic jams occur, but due to people merging and other small variations, braking still occurs.
				To see a middle ground of these two simulations, refer back to the very first simulation. 
			</p>			
			<simulation type="TrafficJamSimulation" mode="less lanes" :dimensions="[35,3]" :tileSize="40" speed="100"/>		
			<simulation type="TrafficJamSimulation" mode="more lanes" :dimensions="[35,8]" :tileSize="40" speed="100"/>	
			<p class= "sim-paragraph">
			<br><br>
				Here's a normal road with a random amount of cars to see the simulation in a less controlled environment. Click randomize to change the car layout!
			</p>	
			<simulation type="TrafficJamSimulation" mode="normal road" :dimensions="[35,5]" :tileSize="40" speed="100"/>
		</div>`,
		
	}) 
})



//==================================
// Grid utilities

// Create a grid of columns
function createGrid(w, h) {
	const grid = Array.from(new Array(w),()=>Array.from(new Array(h),()=>"-"));
	return grid
}

// Set a grid equal to a function
function setGrid(grid, fxn) {
	if (grid === undefined)
		console.warn("no grid!")
	if (fxn === undefined)
		console.warn("no function for setting the grid!")
	for (var i = grid.length-1; i >= 0; i--) {
		for (var j = 0; j < grid[i].length; j++) {
			grid[i][j] = fxn(i,j)
		}
	}

	// for (var j = 0; j < grid[0].length; j++) {
	// 	for (var i = 0; i < grid.length; i++) {
	// 		grid[i][j] = fxn(i,j)
	// 	}
	// }
}

// Copy a grid
function copyGrid(dest, src) {
	for (var i = 0; i < src.length; i++) {
		for (var j = 0; j < src[i].length; j++) {
			dest[i][j] = src[i][j]
		}
	}
}
