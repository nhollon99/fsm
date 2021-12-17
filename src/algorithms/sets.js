function getRandomColor() {
	// We can just generate a random hex number
	do {
		ret = '#';
		for (i = 0; i < 3; i++) {
			ret += Math.ceil(Math.random()*256).toString(16);
		}
	} while (colorDistance(ret) <= 1);
	return ret;
}

function hexStrToNum(color) {
	let colorArr = [];
	let val = '';
	for (i = 1; i < 7; i+=2) {
		val = '';
		val += color.charAt(i);
		val += color.charAt(i+1);
		colorArr.push(Number(val));
	}
	return colorArr;
}

function colorDistance(color) {
	// Color is in hex, so we convert
	let minDist = Infinity;
	let dist = 0;
	let colorArr = hexStrToNum(color);

	// Now we need to go through all colors and check distance
	let compColor = [];
	for (j = 2; j < (colors.length - 1); j+= 1) {
		compColor = hexStrToNum(colors[j]);
		dist = Math.sqrt((colorArr[0] - compColor[0]) ^ 2 + (colorArr[1] - compColor[1]) ^ 2 + (colorArr[1] - compColor[1]) ^ 2);
		if (minDist > dist) {
			minDist = dist;
		}
	}
	return minDist;

	
}

/*
 * Takes in a node, and checks if it is 
 * in any set current stored. If it is, 
 * then we return the number of the set it is in.
 * If the node is in multiple sets, 
 * returns the total number of sets, indicating 
 * Overlap. 
 */
function isInSet(node) {
	let ret = -1;
    if (chipBags.length == 0 || typeof(chipBags[0]) != "object") {
        return
    }
	for (set in chipBags) {
		if (chipBags[set].has(node)) {
			if (ret < chipBags.length) {
				ret = set;
			} else {
				ret = chipBags.length;
			}
		}
	}

	return ret;
}

function findAllSets(node) {
	let ret = [];
	for (set in chipBags) {
		if (chipBags[set].has(node)) {
			ret.push(chipBags[set]);
		}
	}
	return ret;
}

function emptyChipBags() {
    chipBags = [];
    chipBags.push(new Set());
}

function fireSet(firingSet) {
	let isRecording = document.getElementById('record').checked
	for (node of firingSet) {
		fireNode(node, isRecording)
	}
}

function linkInSet(link) {
	let ret = -1;
	for (let set in chipBags) {
		if ((chipBags[set].has(link['nodeA'])) && (chipBags[set].has(link['nodeB']))) {
			if (ret < chipBags.length) {
				ret = set;
			} else {
				ret = chipBags.length;
			}
		}
	}
	return ret;
}

function makeBag(set) {
	chipBags = [];
	chipBags.push(set);
}

function setsToBags(setArr) {
    chipBags = [];
    for (set of setArr) {
        chipBags.push(set);
        colors.push(getRandomColor());
    }
    return chipBags
}