function restoreBackup() {
	if(!localStorage || !JSON) {
		return;
	}

	try {
		var backup = JSON.parse(localStorage['fsm']);

		while (graphNodes.length != backup.length) {
			graphNodes.push([])
			graphLinks.push([])
		}

		for (var j = 0; j < backup.length; j++) {
			for(var i = 0; i < backup[j].nodes.length; i++) {
				var backupNode = backup[j].nodes[i];
				var node = new Node(backupNode.x, backupNode.y);
				node.isAcceptState = backupNode.isAcceptState;
				node.text = backupNode.text;
				node.label = backupNode.label;
				if (j == 0) {
					nodes.push(node);
				}
				graphNodes[j].push(node)
				script.push(0);
			}
			for(var i = 0; i < backup[j].links.length; i++) {
				var backupLink = backup[j].links[i];
				var link = null;
				var directed = backupLink.directed;
				if(backupLink.type == 'SelfLink') {
					link = new SelfLink(graphNodes[j][backupLink.node], undefined, directed);
					link.anchorAngle = backupLink.anchorAngle;
					link.text = backupLink.text;
				} else if(backupLink.type == 'StartLink') {
					link = new StartLink(graphNodes[j][backupLink.node], undefined, directed);
					link.deltaX = backupLink.deltaX;
					link.deltaY = backupLink.deltaY;
					link.text = backupLink.text;
				} else if(backupLink.type == 'Link') {
					link = new Link(graphNodes[j][backupLink.nodeA], graphNodes[j][backupLink.nodeB], directed);
					link.parallelPart = backupLink.parallelPart;
					link.perpendicularPart = backupLink.perpendicularPart;
					link.text = backupLink.text;
					link.lineAngleAdjust = backupLink.lineAngleAdjust;
				}
				if(link != null) {
					if (j == 0) {
						links.push(link);
					}
					graphLinks[j].push(link)
				}
			}
		}
	} catch(e) {
		localStorage['fsm'] = '';
	}
}

function nodeToJSON(node) {
	return {
		'x': node.x,
		'y': node.y,
		'text': node.text,
		'isAcceptState': node.isAcceptState,
		'label': node.label,
	}
}

function linkToJSON(link, graph) {
	if(link instanceof SelfLink) {
		return {
			'type': 'SelfLink',
			'node': graphNodes[graph].indexOf(link.node),
			'text': link.text,
			'anchorAngle': link.anchorAngle,
			'directed': link.directed,
		};
	} else if(link instanceof StartLink) {
		return {
			'type': 'StartLink',
			'node': graphNodes[graph].indexOf(link.node),
			'text': link.text,
			'deltaX': link.deltaX,
			'deltaY': link.deltaY,
			'directed': link.directed,
		};
	} else if(link instanceof Link) {
		return {
			'type': 'Link',
			'nodeA': graphNodes[graph].indexOf(link.nodeA),
			'nodeB': graphNodes[graph].indexOf(link.nodeB),
			'text': link.text,
			'lineAngleAdjust': link.lineAngleAdjust,
			'parallelPart': link.parallelPart,
			'perpendicularPart': link.perpendicularPart,
			'directed': link.directed,
		};
	}
}

function backupData() {
	var backup = []

	for (let j = 0; j < graphNodes.length; j++) {
		var backupGraph = {
			'nodes': [],
			'links': [],
		}

		let nodesI = graphNodes[j]
		let linksI = graphLinks[j]

		for(let i = 0; i < nodesI.length; i++) {
			var node = nodesI[i];
			var backupNode = nodeToJSON(node)
			backupGraph.nodes.push(backupNode);
		}

		for(let i = 0; i < linksI.length; i++) {
			var link = linksI[i];
			var backupLink = linkToJSON(link, j)
			backupGraph.links.push(backupLink);
		}
		backup.push(backupGraph)
	}
	return backup;
}

function saveBackup() {
	if(!localStorage || !JSON) {
		return;
	}

	var backup = backupData();

	localStorage['fsm'] = JSON.stringify(backup);
}
