//Offsets point given a z,x,y value
const offsetPoint = (point,oz,ox=0,oy=0,si=1) => {
	let newVec = point.clone()
	//console.log(newVec)
	newVec = new Vector(newVec[0]+(ox*-si),newVec[1]-oy)
	return newVec.mult(1 + (oz*0.05)) 
} 

//Creates a 3D extrusion given a z offset 
const extrude = (p,contourL,oz,color=0) => {
	p.push()
	p.fill(color[0],color[1]-100,color[2]-10)
	p.stroke(color[0],color[1]-100,color[2]-10)
	p.strokeWeight(1)
	
	
	for(let i = 0; i < contourL.length; i++) {
		if(i == contourL.length-1) {
			drawContour(p,[contourL[i],offsetPoint(contourL[i],oz),offsetPoint(contourL[0],oz),contourL[0]],true)
		}
		else {
			drawContour(p,[contourL[i],offsetPoint(contourL[i],oz),offsetPoint(contourL[i+1],oz),contourL[i+1]],true)
		}
	}
	p.fill(...color)
	drawSmoothContour(p,contourL.map(e=> offsetPoint(e,oz)),true)
	p.pop()
}


masks.blueSpirit = function(p) {
	// Get colors from CSS
	let themeColors = getThemeHSL()
	p.background(...themeColors.main)

	//Sorry if you're actually reading this, it's super messy here onwards 
	
	let hue = 232 - (SLIDER.maskHue*360) % 360
	hue = themeColors.content[0] - (SLIDER.maskHue*360) % 360
	let sat = themeColors.content[1]
	let bri = themeColors.content[2]
	let ornamentH = SLIDER.ornamentSize * 30
	face.sideOrder.forEach(side => {
		
		p.fill(hue,sat,bri)

		side.faceRings.forEach(ring => drawContour(p, ring, false))
		p.fill(0,0,90)
		drawContour(p,side.nose[0].slice(8),true)
		drawContour(p,side.nose[1].slice(8),true)

		p.fill(0)

		//Create outer eyelid
		let outE = [side.eyeRings[4][8],side.eyeRings[4][4],side.eyeRings[4][15],side.eyeRings[4][12]]
		outE[0] = offsetPoint(outE[0],0,5,5,side.index)
		outE[1] = offsetPoint(outE[1],0,-10,0,side.index)
		outE[2] = offsetPoint(outE[2],0,-5,-10,side.index)
		outE[3] = offsetPoint(outE[3],0,5,-10,side.index)
		extrude(p,outE,2,[0,0,90])
	
		//Create inner eyelid
		let inE = [side.eyeRings[4][8],side.eyeRings[4][4],side.eyeRings[4][15],side.eyeRings[4][12]]
		inE[0] = offsetPoint(inE[0],0,-5,5,side.index)
		inE[1] = offsetPoint(inE[1],0,-10,0,side.index)
		inE[2] = offsetPoint(inE[2],0,0,-10,side.index)
		inE[3] = offsetPoint(inE[3],0,10,0,side.index)
		drawSmoothContour(p,inE,true)

		
		//Create outer mask ornaments on bottom
		let outerB = side.faceRings[0].slice(9,15).map(e => e = offsetPoint(e,0,10+ornamentH,0,side.index))
		outerB[0] = offsetPoint(outerB[0],0,10,0,side.index)
		outerB[4] = offsetPoint(outerB[4],0,15,0,side.index)
		extrude(p,outerB.reverse().concat(side.faceRings[0].slice(8,15)),1,[0,0,95])

		//Create outer mask ornaments on top
		let outerT = side.faceRings[0].slice(3,8)
		outerT[0] = offsetPoint(outerT[0],0,20+ornamentH,30+ornamentH,side.index)
		outerT[1] = offsetPoint(outerT[1],0,20+ornamentH,35+ornamentH,side.index)
		outerT[2] = offsetPoint(outerT[2],1,10+ornamentH,0,side.index)
		outerT[3] = offsetPoint(outerT[3],1,10+ornamentH,0,side.index)


		extrude(p,outerT.reverse().concat(side.faceRings[0].slice(3,8)),-1,[0,0,95])

		//Crown looking shape on top ornament
		
		let upperT = side.faceRings[0].slice(0,3)
		upperT[2] = offsetPoint(upperT[2],0,10,30+ornamentH,side.index)
		upperT[1] = offsetPoint(upperT[1],0,0,15+ornamentH,side.index)
		upperT[0] = offsetPoint(upperT[0],0,0,30+ornamentH,side.index)
		extrude(p,upperT.reverse().concat(side.faceRings[0].slice(0,3)),-0.5,[0,0,95])

	})
	
	p.fill(0,0,75)
	//face.mouth.forEach(ring => drawContour(p,ring,false))
	p.noFill()  
	p.stroke(0) 
	p.noStroke()
	//Construct mouth and teeth
	let mTopInd = [376,411,0,187,147]
	let mRightInd = [214,211]
	let mBotInd = [83,18,313]
	let mLeftInd = [431, 434]
	mouthInd = mTopInd.concat(mRightInd,mBotInd,mLeftInd)
	let mouthShape = []
	let tBotInd = [424,406,17,182,204].concat([mRightInd[mRightInd.length-1]] , mBotInd, [mLeftInd[0]])
	let tTopInd = mTopInd.concat([186,185,12,409,410])
	let teethB = []
	let teethT = []
	tBotInd.forEach((e,ind) => {if(ind < 5) 
									teethB.push(offsetPoint(face.points[e],0,0,5))
								else 
									teethB.push(face.points[e])})
	tTopInd.forEach((e,ind) => {
		if(ind >= mTopInd.length) 
			teethT.push(offsetPoint(face.points[e],0,0,-3))
		else 
			teethT.push(face.points[e])})
	mouthInd.forEach(e => mouthShape.push(face.points[e]))
	p.fill(0)
	drawSmoothContour(p,mouthShape,true)
	p.fill(0,0,95)
	drawSmoothContour(p,teethB,true)

	drawSmoothContour(p,teethT,true)

	let tester = [109,67,69,108]

	//Make eyebrow
	let eBrow = [6,193,55,65,223,224,225,124,46,53,66,107,168,336,296,283,276,353,445,444,443,295,285,417]

	//Make Nose
	let nBottom = [419,399,456,363,360,279,278,438,309,459,458,250,461,462,370,141,242,241,20,238,239,79,218,48,49,131,134,236,174,196].map(e=>face.points[e])
	let nostril = [278,438,309,459,458,250,461,462,370,94,141,242,241,20,238,239,79,218,48].reverse().concat([294,439,392,289,305,290,328,326,2,97,99,60,75,59,166,219,64]).map(e=>face.points[e])
	
	//Make nose ornament
	let ornament = [454,447,345,346,347,330,329,277,399,419,197,196,174,47,100,101,118,117,116,227,234].reverse().concat([323,366,352,280,425,358,429,420,456,248,195,3,236,198,209,129,205,50,123,137,93 ]).map(e => face.points[e])
	//p.noStroke()
	drawSmoothContour(p,nBottom,true)
	p.fill(0,0,75)
	drawSmoothContour(p,nostril,true)
	//console.log(nostril)
	//extrude(p,nBottom,1)
	p.fill(0,0,95)

	//Account for side shadowing
	if(face.sideOrder[0].index === -1) {
		extrude(p,eBrow.map(e=>offsetPoint(face.points[e],0,0,0)),0.5,[0,0,95])
		extrude(p,ornament,1.5,[0,0,95])
	}
	else {
		extrude(p,eBrow.map(e=>offsetPoint(face.points[e],0,0,0)).reverse(),0.5,[0,0,95])
		extrude(p,ornament.reverse(),1.5,[0,0,95])
	}
	
	//Create nose bridge for 3D effect
	let noseBridgeL =[440,344,279,371,355,343,419,197,195,5,4,1,275].map(e=>face.points[e])
	let noseBridgeR = [196,114,126,142,49,115,220,45,1,4,5,195,197].map(e=>face.points[e])
	drawSmoothContour(p,noseBridgeL,true)
	drawSmoothContour(p,noseBridgeR,true)
	// drawContour(p, face.mouth[4], true)

	//Create fangs 
	let fangL = [376,411,433].map(e=> face.points[e])
	fangL.push(offsetPoint(fangL[fangL.length-1],4+(SLIDER.fangLength*10),5,-10))
	let fangR = [187,147,213].map(e=> face.points[e])
	fangR.push(offsetPoint(fangR[fangR.length-1],4+(SLIDER.fangLength*10),-5,-10))
	//p.circle(...fangR[3],5)
	for(let i = 0; i < fangL.length; i++) {
		drawSmoothContour(p,[fangL[i%fangL.length],fangL[(i+1)%fangL.length],fangL[(i+2)%fangL.length]],true)
		drawSmoothContour(p,[fangR[i%fangR.length],fangR[(i+1)%fangR.length],fangR[(i+2)%fangR.length]],true)
	}

	//Create hands
	hand.forEach(handS => {
		let palm = []
		handS.fingers.forEach(finger => {
			extrude(p,finger,2,[hue,sat,bri])
			drawRibbon(p,finger,(pct,ind)=> {return 3*(1-pct)})
			palm.push(finger[0])
		})
		palm.push(offsetPoint(handS.fingers[0][0],0,50,0,handS.index))
		extrude(p,palm,2,[hue,sat,bri])
	})
	//drawTestFacePoints(p)
	// drawContour(p, face.points, true)
}
