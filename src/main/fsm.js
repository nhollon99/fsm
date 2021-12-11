var greekLetterNames = [ 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega' ];

/*
 Return true if the user has directed edges on, false otherwise.
 */
function checkDirected() {
	var val = document.getElementById('directed').checked;
	return val;
};


function convertLatexShortcuts(text) {
	// html greek characters
	for(var i = 0; i < greekLetterNames.length; i++) {
		var name = greekLetterNames[i];
		text = text.replace(new RegExp('\\\\' + name, 'g'), String.fromCharCode(913 + i + (i > 16)));
		text = text.replace(new RegExp('\\\\' + name.toLowerCase(), 'g'), String.fromCharCode(945 + i + (i > 16)));
	}

	// subscripts
	for(var i = 0; i < 10; i++) {
		text = text.replace(new RegExp('_' + i, 'g'), String.fromCharCode(8320 + i));
	}

	return text;
}

function textToXML(text) {
	text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	var result = '';
	for(var i = 0; i < text.length; i++) {
		var c = text.charCodeAt(i);
		if(c >= 0x20 && c <= 0x7E) {
			result += text[i];
		} else {
			result += '&#' + c + ';';
		}
	}
	return result;
}

function drawArrow(c, x, y, angle) {
	var dx = Math.cos(angle);
	var dy = Math.sin(angle);
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x - 8 * dx + 5 * dy, y - 8 * dy - 5 * dx);
	c.lineTo(x - 8 * dx - 5 * dy, y - 8 * dy + 5 * dx);
	c.fill();
}

function canvasHasFocus() {
	return (document.activeElement || document.body) == document.body;
}

function drawLabel(c, originalText, x, y, angleOrNull, isSelected) {
	text = convertLatexShortcuts(originalText);
	c.font = '20px "Times New Roman", serif';
	var width = c.measureText(text).width;

	// center the text
	x -= width / 2;

	// position the text intelligently if given an angle
	if(angleOrNull != null) {
		var cos = Math.cos(angleOrNull);
		var sin = Math.sin(angleOrNull);
		var cornerPointX = (width / 2 + 5) * (cos > 0 ? 1 : -1);
		var cornerPointY = (10 + 5) * (sin > 0 ? 1 : -1);
		var slide = sin * Math.pow(Math.abs(sin), 40) * cornerPointX - cos * Math.pow(Math.abs(cos), 10) * cornerPointY;
		x += cornerPointX - sin * slide;
		y += cornerPointY + cos * slide;
	}

	// draw text and caret (round the coordinates so the caret falls on a pixel)
	if('advancedFillText' in c) {
		c.advancedFillText(text, originalText, x + width / 2, y, angleOrNull);
	} else {
		x = Math.round(x);
		y = Math.round(y);
		c.fillText(text, x, y + 6);
	}
	
}


function drawText(c, originalText, x, y, angleOrNull, isSelected) {
	text = convertLatexShortcuts(originalText);
	c.font = '20px "Times New Roman", serif';
	var width = c.measureText(text).width;

	// center the text
	x -= width / 2;

	// position the text intelligently if given an angle
	if(angleOrNull != null) {
		var cos = Math.cos(angleOrNull);
		var sin = Math.sin(angleOrNull);
		var cornerPointX = (width / 2 + 5) * (cos > 0 ? 1 : -1);
		var cornerPointY = (10 + 5) * (sin > 0 ? 1 : -1);
		var slide = sin * Math.pow(Math.abs(sin), 40) * cornerPointX - cos * Math.pow(Math.abs(cos), 10) * cornerPointY;
		x += cornerPointX - sin * slide;
		y += cornerPointY + cos * slide;
	}

	// draw text and caret (round the coordinates so the caret falls on a pixel)
	if('advancedFillText' in c) {
		c.advancedFillText(text, originalText, x + width / 2, y, angleOrNull);
	} else {
		x = Math.round(x);
		y = Math.round(y);
		c.fillText(text, x, y + 6);
		if(isSelected && caretVisible && canvasHasFocus() && document.hasFocus()) {
			x += width;
			c.beginPath();
			c.moveTo(x, y - 10);
			c.lineTo(x, y + 10);
			c.stroke();
		}
	}
}

var caretTimer;
var caretVisible = true;

function resetCaret() {
	clearInterval(caretTimer);
	caretTimer = setInterval('caretVisible = !caretVisible; draw()', 500);
	caretVisible = true;
}

var canvas;
var nodeRadius = 30;
var nodes = [];
var links = [];

var cursorVisible = true;
var snapToPadding = 6; // pixels
var hitTargetPadding = 6; // pixels
var gridSnapPadding = 30; // pixels
var selectedObject = null; // either a Link or a Node
var currentLink = null; // a Link
var movingObject = false;
var originalClick;
var firingSet = new Set();
var script = [];
var chipBags = [];
var visualize = false;
var colors = ['purple','gold', 'blue'];
// allowed modes:
// 'drawing'
// 'coinfiring'
var mode = 'drawing';

//allowed modes:
// 'firing'
// 'dhars'
// 'setCreate'
// 'setFire'
// 'setAdd' -- Hidden Mode
// 'setDelete'
// 'qReduce'
// TODO: 'greedy'
// TODO: 'qReduce'
let coinfiringMode = 'fire';


function updateMode() {
	var element = document.getElementById('coinfiring');
	var chipfiringModes = document.getElementById('chipfiringModes');

	if (element.checked) {
		mode = 'coinfiring';
		chipfiringModes.style.display = 'block';
		updateFiringMode();
		selectedObject = null;
	} else {
		chipfiringModes.style.display = 'none';
		mode = 'drawing';
	}
}

function updateFiringMode() {
	let dhars = document.getElementById('dhars');
	let set = document.getElementById('setCreate');
	let setFire = document.getElementById('setFire');
	let setDelete = document.getElementById('setDelete');
	let qReduce = document.getElementById('qReduce');
	let gonality = document.getElementById('gonality');
	if (dhars.checked) {
		coinfiringMode = 'dhars';
		selectedObject = null;
	} else if (set.checked) {
		coinfiringMode = 'setCreate';
		selectedObject = null;
	} else if (setFire.checked) {
		coinfiringMode = 'setFire';
		selectedObject = null;
	} else if (setDelete.checked) {
		coinfiringMode = 'setDelete';
		selectedObject = null;
	} else if (qReduce.checked) {
		coinfiringMode = 'qReduce';
		selectedObject = null;
	} else if (gonality.checked) {
		coinfiringMode = 'gonality';
		selectedObject = null;
	} else {
		coinfiringMode = 'firing';
		document.getElementById('firing').checked = true;
		selectedObject = null;
	}
	displayRecord();
}

//display recording box
function displayRecord() {
	let record = document.getElementById('record');
	let firingscript = document.getElementById('firingscript');
	firingscript.value = script.toString();
	if (record.checked) {
		firingscript.style.display = 'block';
	}
	else{
		firingscript.style.display = 'none';
	}
}

function updateScript(node, isFire) {
	let firingscript = document.getElementById('firingscript');
	if (isFire){
		script[node.label - 1] += 1;
	}
	else {
		script[node.label - 1] -= 1;
	}
	firingscript.value = script.toString();
}

function resetScript() {
	script.fill(0)
}

// Get an array of edges that are outgoing from this node
// Used in coin firing
function leavingEdges(node) {
	var edges = [];
	for(var i = 0; i < links.length; i++) {
		var nodeACheck = links[i].nodeA == node;
		var nodeBCheck = (!links[i].directed) && links[i].nodeB == node;
		if(nodeACheck || nodeBCheck) {
			edges.push(links[i]);
		}
	}
	return edges;
}

// Change the value of the node by a given amount
// Used in coin firing
function incrementNode(node, amount) {
	var nodeText = node.text;
	var resultText = '';
	if (nodeText === '') {
		nodeText = '0';
	}
	// strings that are not valid numbers are NaN
	if (!isNaN(nodeText)) {
		var nodeValue = parseInt(nodeText);
		var newValue = nodeValue + amount;
		resultText = newValue.toString();
	}
	else {
		var lastIndexOf = function(str, substr) {
			// Reverse string
			var rev = str.split("").reverse().join("");
			var revIndex = rev.indexOf(substr);
			if (revIndex < 0) {
				return revIndex;
			}
			else {
				return str.length - revIndex - 1;
			}
		};
		var added = false;
		// Look for plus sign
		var plusIndex = nodeText.lastIndexOf('+');
		var minusIndex = nodeText.lastIndexOf('-');
		var beforeSign = nodeText;
		var startValue = 0;
		// If plus exists see if everything after plus is number
		if (plusIndex >= 0) {
			var afterPlus = nodeText.substring(plusIndex + 1);
			if (afterPlus === '') {
				afterPlus = '0';
			}
			if (!isNaN(afterPlus)) {
				added = true;
				beforeSign = nodeText.substring(0, plusIndex);
				startValue = parseInt(afterPlus);
			}
		}
		// Look for minus sign
		if (!added && minusIndex >= 0) {
			var afterMinus = nodeText.substring(minusIndex + 1);
			if (afterMinus === '') {
				afterMinus = '0';
			}
			if (!isNaN(afterMinus)) {
				added = true;
				beforeSign = nodeText.substring(0, minusIndex);
				startValue = -parseInt(afterMinus);
			}
		}
		var newValue = startValue + amount;
		if (newValue > 0) {
			resultText = beforeSign + '+' + newValue;
		}
		else if (newValue < 0) {
			resultText = beforeSign + '-' + (-newValue);
		}
		else {
			resultText = beforeSign;
		}
	}
	node.text = resultText;
}

function drawUsing(c) {
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.save();
	c.translate(0.5, 0.5);
	let col = 0;

	for(var i = 0; i < nodes.length; i++) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = (nodes[i] == selectedObject) ? 'blue' : 'black';
		col = isInSet(nodes[i])
		if ((chipBags.length > 0) && col > -1) {
			c.fillStyle = c.strokeStyle = colors[col];
			if (colors[col] == "black") {
				c.lineWidth = 1;
			} else {
				c.lineWidth = 5;
			}
		}

		if (nodes[i]['label'] == undefined) {
			nodes[i]['label'] = i + 1;
		}

		nodes[i].draw(c);
	}

	for(var i = 0; i < links.length; i++) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = (links[i] == selectedObject) ? 'blue' : 'black';
		col = linkInSet(links[i])
		if ((chipBags.length > 0) && (col > -1)) {
			c.fillStyle = c.strokeStyle = colors[col];
			if (colors[col] == "black") {
				c.lineWidth = 1;
			} else {
				c.lineWidth = 3;
			}
		}
		links[i].draw(c);
	}
	if(currentLink != null) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = 'black';
		currentLink.draw(c);
	}

	c.restore();
}

function draw() {
	drawUsing(canvas.getContext('2d'));
	saveBackup();
}

function selectObject(x, y) {
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].containsPoint(x, y)) {
			return nodes[i];
		}
	}
	for(var i = 0; i < links.length; i++) {
		if(links[i].containsPoint(x, y)) {
			return links[i];
		}
	}
	return null;
}

function snapNode(node) {
	var element = document.getElementById('gridsnap');
	var gridSnap = element.checked;
	if (gridSnap) {
		var xTemp = (node.x + Math.floor(gridSnapPadding / 2));
		var yTemp = (node.y + Math.floor(gridSnapPadding / 2));
		node.x = xTemp - (xTemp % gridSnapPadding);
		node.y = yTemp - (yTemp % gridSnapPadding);
	}
	else {
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i] == node) continue;

			if(Math.abs(node.x - nodes[i].x) < snapToPadding) {
				node.x = nodes[i].x;
			}

			if(Math.abs(node.y - nodes[i].y) < snapToPadding) {
				node.y = nodes[i].y;
			}
		}
	}
}



function getNodeNum(node) {
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i] === node) {
			return i;
		}
	}
}

function getNodeLabel(num) {
	let ret = 'v';
	strng = String(num);
	len = strng.length;
	for (i = 0; i < len; i++) {
		ret += `_${strng.charAt(i)}`;
	}
	return ret;
}

// Turns off all chipFiringModes except the current Mode
// I couldnt decide if we should just make an 
// array of allowed modes or not, easily changeable
function turnOffChipFiringModes(curMode) {
	if (curMode !== 'firing') {
		document.getElementById('firing').checked = false;
	}

	if (curMode !== 'setCreate') {
		document.getElementById('setCreate').checked = false;
	}

	if (curMode !== 'dhars') {
		document.getElementById('dhars').checked = false;
	}

	if (curMode !== 'setFire') {
		document.getElementById('setFire').checked = false;
	}

	if (curMode !== 'setDelete') {
		document.getElementById('setDelete').checked = false;
	}

	if (curMode !== 'qReduce') {
		document.getElementById('qReduce').checked = false;
	}
}

function fireNode(node, isRecording) {
	if (document.getElementById('coinAudio').checked === true) {
		audioObj = new Audio("https://www.fesliyanstudios.com/play-mp3/6236");
		audioObj.addEventListener("canplay", event => {
			audioObj.play();
		});
	}
	if (isRecording) {
		updateScript(node, !shift);
	}
	var chipsToFireAway = 0;
	// Look for edges to adjacent nodes
	var modifier = 1;
	if (shift) {
		modifier = -1;
	}
	var edges = leavingEdges(node);
	for (var i = 0; i < edges.length; i++) {
		var edge = edges[i];
		var otherNode = edge.nodeB;
		if (otherNode === node) {
			otherNode = edge.nodeA;
		}
		var edgeWeight = 1;
		if (edge.text !== '' && !isNaN(edge.text)) {
			edgeWeight = parseInt(edge.text);
		}
		chipsToFireAway += edgeWeight;
		incrementNode(otherNode, edgeWeight * modifier);
	}
	incrementNode(node, -chipsToFireAway * modifier)
}

window.onload = function() {

	document.getElementById("clearCanvas").onclick = 
	function(){
		var element = document.getElementById('coinfiring');
		element.checked = false;
		chipBags = [];
		localStorage['fsm'] = '';
		location.reload();
	};

	document.getElementById("clearNodes").onclick = function() {
		for(var i = 0; i < nodes.length; i++) {
			nodes[i].text = '0';
		}
		draw();
	};

	document.getElementById('importButton').onclick = async function() {
		var element = document.getElementById('output');
		console.log(element.value)
		localStorage['fsm'] = element.value;
		// Ok, fsm is now a string
		console.log(localStorage['fsm'])
		location.reload();
	};

	document.getElementById('coinfiring').onclick = function() {
		turnOffChipFiringModes('firing');
		updateMode();
	};

	document.getElementById('dhars').onclick = () => {
		turnOffChipFiringModes('dhars');
		updateFiringMode();
	}

	document.getElementById('greedy').onclick = async function() {
		console.log("inthis function?")
		if (document.getElementById('visualize').checked) {
			drawGreedy();
		} else {
			greedy();
		}

		draw();
	}
	document.getElementById('gonality').onclick = () => {		
		gonality(nodes[0]);
	}

	document.getElementById('rank').onclick = () => {		
		rank();
	}

	document.getElementById('setDelete').onclick = () => {
		turnOffChipFiringModes('setDelete');
		updateFiringMode();
	}
	
	document.getElementById('setCreate').onclick = () => {
		turnOffChipFiringModes('setCreate');
		updateFiringMode();
	}

	document.getElementById('setFire').onclick = () => {
		turnOffChipFiringModes('setFire');
		updateFiringMode();
	}


	document.getElementById('firing').onclick = () => {
		turnOffChipFiringModes('firing');
		updateFiringMode();
	}

	document.getElementById('qReduce').onclick = () => {
		turnOffChipFiringModes('qReduce');
		updateFiringMode();
	}

	document.getElementById('record').onclick = () => {
		resetScript();
		displayRecord();
	}

	updateMode();

	canvas = document.getElementById('canvas');
	restoreBackup();
	draw();

	canvas.onmousedown = async function(e) {
		var mouse = crossBrowserRelativeMousePos(e);

		if (mode === 'drawing') {
			selectedObject = selectObject(mouse.x, mouse.y);
			movingObject = false;
			originalClick = mouse;
			if(selectedObject != null) {
				if(shift && selectedObject instanceof Node) {
					currentLink = new SelfLink(selectedObject, mouse, checkDirected());
				} else {
					movingObject = true;
					deltaMouseX = deltaMouseY = 0;
					if(selectedObject.setMouseStart) {
						selectedObject.setMouseStart(mouse.x, mouse.y);
					}
				}
				resetCaret();
			} else if(shift) {
				currentLink = new TemporaryLink(mouse, mouse, checkDirected());
			}
		}
		else if (mode === 'coinfiring') {
			if (coinfiringMode === 'firing') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						let isRecording = document.getElementById('record').checked;
						if (firingSet.has(currentObject)) {
							firingSet.forEach(node => {
								fireNode(node, isRecording);
							})
							firingSet = new Set();
						} else {
							fireNode(currentObject, isRecording);
						}
					}
				}
			} else if (coinfiringMode === 'dhars') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						// need to find this node in local storage to get it's number
						chipBags = [];
						let dharsStart = 0;
						for (let i = 0; i < nodes.length; i++) {
							if (currentObject.containsPoint(nodes[i].x, nodes[i].y)) {
								dharsStart = i;
							}
						}
						if (document.getElementById('visualize').checked) {
							await drawDhars(dharsStart);
						}
						makeBag(dhars(dharsStart));						
					}
				}
			} else if (coinfiringMode === 'setAdd') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						if (chipBags[0].has(currentObject)) {
							chipBags[0].delete(currentObject);
						} else {
							chipBags[0].add(currentObject);
						}
					}
				}

			} else if (coinfiringMode === 'setFire') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						// So, we need to find all nodes in the same
						// set as this node, and fire all of them.
						let sets = findAllSets(currentObject);
						let isRecording = document.getElementById('record').checked;
						for (set of sets) {
							fireSet(set)
						}

						if (sets.length === 0) {
							fireNode(currentObject, isRecording);
						}
					}
				}

			} else if (coinfiringMode === 'setCreate') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						// We need to either create a new set, or add to a recently
						// created set. Seems pretty straightforward to just 
						// create a mode, setAdd

						chipBags.push(new Set());
						chipBags[0].add(currentObject);

						// Hidden mode;
						coinfiringMode = 'setAdd';
					}
				}
			} else if (coinfiringMode === 'setDelete') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						// Take the current set, and delete the sets:
						let sets = findAllSets(currentObject);
						let index = 0;
						for (set of sets) {
							index = chipBags.indexOf(set);
							chipBags.splice(index);
						}
					}
				}
			} else if (coinfiringMode === 'qReduce') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						// If we have a node, q-reduce it!
						runQReduce(currentObject);
					}
				}
			} else if (coinfiringMode === 'gonality') {
				var currentObject = selectObject(mouse.x, mouse.y);
				if (currentObject != null) {
					if (currentObject instanceof Node) {
						gonality(currentObject)
					}
				}
			}

			
			
		}

		draw();

		if(canvasHasFocus()) {
			// disable drag-and-drop only if the canvas is already focused
			return false;
		} else {
			// otherwise, let the browser switch the focus away from wherever it was
			resetCaret();
			return true;
		}
	};

	canvas.ondblclick = function(e) {
		var mouse = crossBrowserRelativeMousePos(e);

		if (mode === 'drawing') {
			selectedObject = selectObject(mouse.x, mouse.y);
			if(selectedObject == null) {
				selectedObject = new Node(mouse.x, mouse.y);
				nodes.push(selectedObject);
				nodes[nodes.length-1].label = nodes.length;
				nodes[nodes.length-1].text = '0';
				script.push(0);
				resetCaret();
				draw();
			}
		}
	};


	canvas.onmousemove = function(e) {
		var mouse = crossBrowserRelativeMousePos(e);

		if(currentLink != null) {
			var targetNode = selectObject(mouse.x, mouse.y);
			if(!(targetNode instanceof Node)) {
				targetNode = null;
			}

			if(selectedObject == null) {
				if(targetNode != null) {
					currentLink = new StartLink(targetNode, originalClick, checkDirected());
				} else {
					currentLink = new TemporaryLink(originalClick, mouse, checkDirected());
				}
			} else {
				if(targetNode != null) {
					currentLink = new Link(selectedObject, targetNode, checkDirected());
				} else {
					currentLink = new TemporaryLink(selectedObject.closestPointOnCircle(mouse.x, mouse.y), mouse, checkDirected());
				}
			}
			draw();
		}

		if(movingObject) {
			selectedObject.setAnchorPoint(mouse.x, mouse.y);
			if(selectedObject instanceof Node) {
				snapNode(selectedObject);
			}
			draw();
		}
	};

	canvas.onmouseup = function(e) {
		movingObject = false;

		if(currentLink != null) {
			if(!(currentLink instanceof TemporaryLink)) {
				selectedObject = currentLink;
				links.push(currentLink);
				resetCaret();
			}
			currentLink = null;
			draw();
		}
	};
}

var shift = false;

document.onkeydown = function(e) {
	var key = crossBrowserKey(e);

	if(key == 16) {
		shift = true;
	} else if(!canvasHasFocus()) {
		// don't read keystrokes when other things have focus
		return true;
	} else if(key == 8) { // backspace key
		if(selectedObject != null && 'text' in selectedObject) {
			selectedObject.text = selectedObject.text.substr(0, selectedObject.text.length - 1);
			resetCaret();
			draw();
		}

		// backspace is a shortcut for the back button, but do NOT want to change pages
		return false;
	} else if(key == 46) { // delete key
		if(selectedObject != null) {
			for(var i = 0; i < nodes.length; i++) {
				// Relabel nodes:
				nodes[i].label = i+1;
				if(nodes[i] == selectedObject) {
					nodes.splice(i--, 1);
					script.splice(i--, 1);
				}
			}
			for(var i = 0; i < links.length; i++) {
				if(links[i] == selectedObject || links[i].node == selectedObject || links[i].nodeA == selectedObject || links[i].nodeB == selectedObject) {
					links.splice(i--, 1);
				}
			}
			selectedObject = null;
			draw();
		}
	}
};

document.onkeyup = function(e) {
	var key = crossBrowserKey(e);

	if(key == 16) {
		shift = false;
	}
};

document.onkeypress = function(e) {
	// don't read keystrokes when other things have focus
	var key = crossBrowserKey(e);
	if(!canvasHasFocus()) {
		// don't read keystrokes when other things have focus
		return true;
	} else if(key >= 0x20 && key <= 0x7E && !e.metaKey && !e.altKey && !e.ctrlKey && selectedObject != null && 'text' in selectedObject) {
		selectedObject.text += String.fromCharCode(key);
		resetCaret();
		draw();

		// don't let keys do their actions (like space scrolls down the page)
		return false;
	} else if(key == 8) {
		// backspace is a shortcut for the back button, but do NOT want to change pages
		return false;
	}
};

function crossBrowserKey(e) {
	e = e || window.event;
	return e.which || e.keyCode;
}

function crossBrowserElementPos(e) {
	e = e || window.event;
	var obj = e.target || e.srcElement;
	var x = 0, y = 0;
	while(obj.offsetParent) {
		x += obj.offsetLeft;
		y += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return { 'x': x, 'y': y };
}

function crossBrowserMousePos(e) {
	e = e || window.event;
	return {
		'x': e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
		'y': e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop,
	};
}

function crossBrowserRelativeMousePos(e) {
	var element = crossBrowserElementPos(e);
	var mouse = crossBrowserMousePos(e);
	return {
		'x': mouse.x - element.x,
		'y': mouse.y - element.y
	};
}

function output(text, showInput) {
	var element = document.getElementById('output');
	element.style.display = 'block';
	element.value = text;
	setInputButtonHidden(!showInput);
}

function saveAsPNG() {
	var oldSelectedObject = selectedObject;
	selectedObject = null;
	drawUsing(canvas.getContext('2d'));
	selectedObject = oldSelectedObject;
	var pngData = canvas.toDataURL('image/png');
	document.location.href = pngData;
}

function saveAsSVG() {
	var exporter = new ExportAsSVG();
	var oldSelectedObject = selectedObject;
	selectedObject = null;
	drawUsing(exporter);
	selectedObject = oldSelectedObject;
	var svgData = exporter.toSVG();
	output(svgData);
	// Chrome isn't ready for this yet, the 'Save As' menu item is disabled
	// document.location.href = 'data:image/svg+xml;base64,' + btoa(svgData);
}

function saveAsLaTeX() {
	var exporter = new ExportAsLaTeX();
	var oldSelectedObject = selectedObject;
	selectedObject = null;
	drawUsing(exporter);
	selectedObject = oldSelectedObject;
	var texData = exporter.toLaTeX();
	output(texData);
}

function saveAsJSON() {
	if(!JSON) {
		return;
	}
	var backup = backupData();
	output(JSON.stringify(backup));
}

function setInputButtonHidden(isHidden) {
	var importButton = document.getElementById('importButton');
	importButton.hidden = isHidden;
}

function loadFromJSON() {
	output('', true);
}