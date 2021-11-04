// Setup and Vue things

//Gets all the average attributes for a year
const getAttrs = (yr) => {
  let yrdata = getAllByYear(yr);
  let ret = {
    bpm: 0,
    nrgy: 0,
    dnce: 0,
    val: 0,
    dur: 0,
    acous: 0,
    spch: 0,
  };
  for (let i = 0; i < yrdata.length; i++) {
    for (let j in ret) {
      ret[j] += parseInt(yrdata[i][j]);
    }
  }
  for (let j in ret) {
    ret[j] /= yrdata.length;
  }
  return ret;
};

//Gets all songs that are from a specified year
const getAllByYear = (yr) => {
  return alldata.filter((e) => e.year === `${yr}`);
};


//Ranks the songs of a year based on popularity stat
const getPopSong = (yr) => {
  let data = getAllByYear(yr)
  return data.sort((a,b) => {return b.pop - a.pop})
}

//Filters a song so that it can be used for the radar chart
const filterAttrs = (el) => {
  let ret = {
    bpm: 0,
    nrgy: 0,
    dnce: 0,
    val: 0,
    dur: 0,
    acous: 0,
    spch: 0,
  };
  for (let j in ret) {
    ret[j] = parseInt(el[j]);
  }
  return ret;
}

//Get all avg data from available years
const computeOverTimeData = () => {
  let ret = []
  for(let i = 1957; i <= 2019; i++) {
    ret.push(getAttrs(i))
  }
  return ret
}

//Counts year songs genres then ranks them
const getTopGenre = (yr) => {
  let genres = new Map()
  let data = getAllByYear(yr)
  let ret = []
  for(i of data) {
    if(i.topGenre !== "") {
      if(genres.has(i.topGenre)) {
        genres.set(i.topGenre, genres.get(i.topGenre)+1)
      }
      else {
        genres.set(i.topGenre,1)
      }
    }
  }
  for(let [key,val] of genres) {
    ret.push([key,val])
  }
  return ret.sort((a,b) => b[1] - a[1])
}


//Component to make checkboxes
Vue.component("graphCheckbox", {
	template: `
  <div class = "checkbox-wrapper">
    <p class = checkbox-label>{{str}}</p>
    <div class = "checkbox">
      <input checked :id ="attr" type="checkbox" @input = "e => setRender(e.target.checked, attr)">
      <label :for = "attr"></label>
    </div>
  </div>
	`,

	methods: {
		setRender(e,attr) {
      if(attr === "scaleG") {
        this.$parent.setScale(e)
      }
      else
        this.$parent.setRender(e,attr)
    }
	},

	// What data does this get from its parent?
	props: ["attr","str"]
})

//Small guide on the attributes
Vue.component("GuideModal", {
	template: `
  <div class = "guide-modal" v-bind:class ="{guideActive: active}">
  <div class = "guide-text-wrapper">
   <div class = "guide-header">
      <h1>What do these attributes mean?</h1>
      <span class = "xbut" @click = "toggleModal">&#10005;</span>
   </div>
   <ul>
    <li class = "guide-item"><b>Beats per Minute (bpm)</b>: The overall estimated tempo of a track. In musical terminology, tempo is the speed or pace of a given piece, and derives directly from the average beat duration.</li>
    <li class = "guide-item"><b>Energy (nrgy)</b>: Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.</li>
    <li class = "guide-item"><b>Danceability (dnce)</b>: Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.</li>
    <li class = "guide-item"><b>Valence (val)</b>: Describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).</li>
    <li class = "guide-item"><b>Duration (dur)</b>: The duration of the track in seconds.</li>
    <li class = "guide-item"><b>Acousticness (acous)</b>: A confidence measure of whether the track is acoustic.</li>
    <li class = "guide-item"><b>Speechiness (spch)</b>: This detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the higher the attribute value.</li>
   </ul>
   </div>
  </div>
	`,

	methods: {
    toggleModal() {
      this.$parent.toggleModal();
    }
		
	},

	// What data does this get from its parent?
	props: ["active"]
})

const canvasW = 350;
const canvasH = 350;

document.addEventListener("DOMContentLoaded", function () {
  // Create a new Vue
  
  new Vue({
    template: 
    `<div class="columns">
    <h1 class ="chosenyr header">{{year}}</h1>
			<div class="column">
        <input id = "main-slider" type="range" min="1957" max="2019" :value="this.year" @input="e => setYr(e.target.value)">	  
			</div>
      <div class="statstext">
      <h1 class = "textlabel">Top Song of {{year}}:</h1>
      <h1 class = "datatext">{{yearPops[0].title}} - {{yearPops[0].artist}}</h1>
      <h1 class = "textlabel marg">Top Genre of {{year}}:</h1>
      <h1 class = "datatext">{{this.yearGen[0][0]}}</h1>
      </div>
      <button class="guide-btn" @click="toggleModal">What do these attributes mean?</button>
      <div class = "row">
        <div class="column" id="p5">		
        </div>
        <div class="column" id="p51">		
			  </div>
        <div class = "controls">
          <h1 class = "header text secondary-color">Graph Controls</h1>
          <graphCheckbox attr="scaleG" str="Scale the Graph" />
          <graphCheckbox attr="nrgy" str="Show Energy" />
          <graphCheckbox attr="dnce" str="Show Danceability" />
          <graphCheckbox attr="val" str="Show Valence" />
          <graphCheckbox attr="dur" str="Show Duration" />
          <graphCheckbox attr="acous" str="Show Acousticness" />
          <graphCheckbox attr="spch" str="Show Speechiness" />
          <graphCheckbox attr="bpm" str="Show Beats per Min" />
      </div>
      </div>

      <GuideModal :active ="modalActive" />
		</div>`,
    el: "#app",

    methods: {
      //Updating the slider updates other vars
      toggleModal() {
        console.log("yo")
        this.modalActive = !this.modalActive
      },
      setYr(yr) {
        //console.log(yr)
        this.year = yr;
        this.yearAttrs = getAttrs(this.year)
        this.yearPops = getPopSong(this.year)
        this.yearGen = getTopGenre(this.year)
      },
      setScale(e) {
        this.scaleG = e
      },
      setRender(e,attr) {
        this.renderTraits[attr] = e
      },
      //Draws a radar chart
      drawRadar(p,attrs,color) {
        let rotation = Math.PI/2
        let w = p.width;
        let h = p.height-50;
        p.push()
        
          p.beginShape();
          for (let i in attrs) {
            //p.translate(w/2, h/2);
            let strength = attrs[i]
            let scalings = {
              bpm: 200,
              nrgy: 95,
              dnce: 90,
              val: 100,
              dur: 300,
              acous: 100,
              spch: 40,
            }
            strength *= w/(2*scalings[i])
            let px = strength * Math.cos(rotation) + w/2
            let py = strength * Math.sin(rotation) + h/2
            //console.log(`${i}: ${px},${py}`)
            //p.line(w/2,h/2,px,py)
            p.vertex(px, py);
            p.circle(px,py,3)
            p.fill(...color,0.2)
            p.textSize(15)
            p.fill(color[0],color[1]-40,color[2])
            p.strokeWeight(1)
            p.stroke(color[0],color[1]-40,color[2])
            p.text(attrs[i].toPrecision(4),px,py)
            rotation += Math.PI * 2/7;
          }
            p.fill(...color,0.2)
            p.strokeWeight(1)
            p.stroke(...color)
            p.vertex(attrs["bpm"]/200*w/2* Math.cos(rotation) + w/2, attrs["bpm"]/200*w/2*Math.sin(rotation) + h/2);
            p.endShape();
            p.pop()
      },
      //draws line graph
      drawGraph(p,ofs,yr,attr,color) {
        let themeColors = getThemeHSL()
        let w = p.width;
        let h = p.height-50;
        let scalings = {
          bpm: 200,
          nrgy: 80,
          dnce: 85,
          val: 100,
          dur: 300,
          acous: 100,
          spch: 20,
        }
        let incr = (w-ofs)/this.overTimeData.length
        let scaling = this.scaleG ? (1/scalings[attr]) * (h-ofs) : 1
        for(let i = 0; i < this.overTimeData.length; i++) {
          p.push()
          p.translate(ofs,h-ofs)
          p.fill(color)
          p.stroke(color)
          p.strokeWeight(2)
          if(i !== this.overTimeData.length-1) {
            p.line(i*incr,-this.overTimeData[i][attr]*scaling,(i+1)*incr,-this.overTimeData[i+1][attr]*scaling)
          }
          p.circle(i*incr,-this.overTimeData[i][attr]*scaling,1)
          p.pop()
        }
        p.push()
        p.translate(ofs,h-ofs)
        p.fill(...themeColors.secondary)
        p.circle((yr-1957)*incr,-this.overTimeData[yr-1957][attr]*scaling,4)
        p.fill(color)
        p.textSize(15)
        p.text(attr,incr*(this.overTimeData.length-3)-10,-this.overTimeData[this.overTimeData.length-3][attr]*scaling-10)
        p.pop()
      }
    },
    computed: {  

    },
    data() {
      return {
        //All data is computed here so it doesnt get computed over and over in p5
        year: 1985,
        yearAttrs: getAttrs(1985),
        yearPops: getPopSong(1985),
        yearGen: getTopGenre(1985),
        overTimeData: computeOverTimeData(),
        renderTraits: {
          bpm: true,
          nrgy: true,
          dnce: true,
          val: true,
          dur: true,
          acous: true,
          spch: true,
        },
        scaleG: true,
        modalActive: false,
      };
    },

    mounted() {
      // When this compentent is mounted, also create a processing instance
      let p = new p5((p) => {
        // Save the noise fxn
        noise = p.noise;

        let mousePos = [];
        // Basic P5 setup
        p.setup = () => {
          p.createCanvas(canvasW, canvasH+50);
          p.colorMode(p.HSL);
          p.ellipseMode(p.RADIUS);
        };

        //-------------------------------------------
        // Mouse things

        p.mouseClicked = () => {
          if (
            p.mouseX > 0 &&
            p.mouseX < canvasW &&
            p.mouseY > 0 &&
            p.mouseY < canvasH
          ) {
          }
          // figure out where we clicked
        };
        //-------------------------------------------
        // Draw

        p.draw = () => {
          let themeColors = getThemeHSL()
          p.background(...themeColors.main);
          let attrs = this.yearAttrs;
          let rotation = Math.PI/2;
          let w = p.width;
          let h = p.height-50;
          //p.circle(w / 2, h / 2, w / 2);
          let imax = 3
          let scalings = {
            bpm: 200,
            nrgy: 95,
            dnce: 90,
            val: 100,
            dur: 300,
            acous: 100,
            spch: 40,
          }
          p.textSize(30)
          p.textFont('Work Sans')
          p.fill(...themeColors.content)
          p.text(this.year,2,30)
          for(let i = 1; i <= imax; i++) {
            p.push()
            p.stroke(...themeColors.content)
            p.fill(50,90,100, 0)
            //Draw radar graph axis
            p.beginShape()
            for(let j = 0; j < 7; j++) {
              let pox = (i/imax) * w/2 * Math.cos(rotation + (2*Math.PI * j/7)) + w/2
              let poy = (i/imax) * w/2 * Math.sin(rotation + (2*Math.PI* j/7)) + h/2
              p.line(w/2,h/2,pox,poy)
              p.vertex(pox,poy)
              if(i === imax) {
                p.push()
                p.textSize(20)
                p.fill(...themeColors.content)
                switch(j){
                  case 0:
                    p.text("bpm",pox,poy-10)
                    break;
                  case 1:
                    p.text("energy",pox,poy+15)
                    break;
                  case 2:
                    p.text("danceability",pox,poy)
                    break;
                  case 3:
                    p.text("valence",pox,poy)
                    break;
                  case 4:
                    p.text("duration",pox,poy)
                    break;
                  case 5:
                    p.text("acousticness",pox-120,poy)
                    break;
                  case 6:
                    p.text("speechiness",pox-115,poy)
                    break;
                
                }
                p.pop()
              }
              
            }
            p.vertex((i/imax) * w/2 * Math.cos(rotation) + w/2, (i/imax) * w/2 * Math.sin(rotation) + h/2)
            p.endShape()
            p.pop()
          }
          //Draw the radar graphs for yr avg and top song 
            this.drawRadar(p,attrs,themeColors.content)
            this.drawRadar(p,filterAttrs(this.yearPops[0]),themeColors.secondary)
            //Make the key
            p.push()
            p.textSize(13)
            p.fill(...themeColors.content)
            p.stroke(...themeColors.content)
            p.text(`- Average Song Profile for ${this.year}`,w/15+3,p.height-35)
            p.fill(...themeColors.content,0.2)
            p.square(w/15-18,p.height-48,15)
            p.pop()
            p.push()
            p.textSize(13)
            p.fill(...themeColors.secondary)
            p.stroke(...themeColors.secondary)
            p.text(`- Song Profile for ${this.year}'s top song`,w/15+3,p.height-8)
            p.fill(...themeColors.secondary,0.2)
            p.square(w/15-18,p.height-20,15)
            p.pop()
          };
        }, document.getElementById("p5"));

        let p2 = new p5((p) => {
          // Save the noise fxn
          noise = p.noise;
  
          let mousePos = [];
          // Basic P5 setup
          p.setup = () => {
            p.createCanvas(canvasW*2, canvasH+50);
            p.colorMode(p.HSL);
            p.ellipseMode(p.RADIUS);
          };
  
          //-------------------------------------------
          // Mouse things
  
          p.mouseClicked = () => {
            if (
              p.mouseX > 0 &&
              p.mouseX < canvasW &&
              p.mouseY > 0 &&
              p.mouseY < canvasH
            ) {
            }
            // figure out where we clicked
          };
          //-------------------------------------------
          // Draw
  
          p.draw = () => {
            let themeColors = getThemeHSL()
            p.background(...themeColors.main);
            let w = p.width;
            let h = p.height-50;
            let ofs = 20
            let lngth = this.overTimeData.length
            let incr = (w-ofs)/this.overTimeData.length
            let satshift = {
                bpm: 2,
                nrgy: 3,
                dnce: 4,
                val: 5,
                dur: 6,
                acous: 7,
                spch: 8,
            }
            p.stroke(...themeColors.content)
            p.fill(...themeColors.content)
            p.line(ofs,h-ofs,ofs,0)
            p.line(w-ofs,h-ofs,ofs,h-ofs)
            p.textFont('Work Sans')
            let yr = this.year
            for(tr in this.renderTraits) {
              if(this.renderTraits[tr]) {
                //draw all the graphs for checked attributes
                this.drawGraph(p,ofs,yr,tr,[themeColors.main[0],themeColors.main[1],(themeColors.main[2]+satshift[tr]*10)%100])
                //Make the key
                p.push()
                p.textSize(15)
                p.fill(...[themeColors.main[0],themeColors.main[1],(themeColors.main[2]+satshift[tr]*10)%100])
                p.stroke(...[themeColors.main[0],themeColors.main[1],(themeColors.main[2]+satshift[tr]*10)%100])
                p.square(incr*satshift[tr]*9-172,p.height-40,18)               
                p.strokeWeight(2)
                p.text(`- ${tr}`,incr*satshift[tr]*9-150,p.height-25)
                p.pop()
              }
            }
            //draw axis
            for(let i = 0; i < lngth; i++) {
              if((i+1957) % 5 === 0) {
                p.textSize(12)
                p.text(i+1957,i*incr+8,h-ofs/3)
                
              }
              p.line(i*incr+ofs,h-ofs+2,i*incr+ofs,h-ofs-2)
            }

            for(let i = 0; i < h-ofs;i+=10) {
              p.line(ofs-2,i,ofs+2,i)
              p.textSize(9)
              if(i % 20 === 0)
              p.text(h-ofs-i,0,i+3)
            }
            };
          }, document.getElementById("p51"));
    },
  });
});

function compareDates(d0, d1) {
  // Convert dates from strings into UTF dates(number of millisecodnds since 1970)
  let d0Val = Date.parse(d0);
  let d1Val = Date.parse(d1);

  return d0Val - d1Val;
}


