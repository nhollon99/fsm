function runQReduce(node) {
    //click record script automatically
    let record = document.getElementById('record')
    if (!record.checked) {
        record.click()
    } else {
        resetScript()
    }

    debtToQ(buildDistanceArray(node));
    draw();
    qReduce(node);
}

function buildDistanceArray(node) {
    const graph = makeAdjList()

    let q = []
    q.push([node.label - 1, 0])
    let distanceArray = []
    let visited = new Set()
    visited.add(node.label - 1)

    while (q.length) {
        let n = q.shift()
        let neighbors = graph[n[0]]
        let distance = n[1]

        let distanceSet = new Set()

        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                distanceSet.add(nodes[neighbor])
                q.push([neighbor, distance + 1])
                visited.add(neighbor)
            }
        })
        if (distanceSet.size) {
            if (distance < distanceArray.length) {
                let curr = distanceArray[distance]
                distanceArray[distance] = new Set([...curr, ...distanceSet])
            } else {
                distanceArray.push(distanceSet)
            }
        }
    }
    return distanceArray
}

/* 
 * Takes in a distance array (an array of sets where the index
 * corresponds to the distance of nodes in the set from a unique vertex 
 * q), and sends all the debt of the graph to q. Returns nothing. 
 */
function debtToQ(distArr) {
    // Iterate backwards borrowing until each set of nodes
    // a distance *index* from Q is 
    let index = distArr.length - 1;
    let curNode = 0;
    while (index >= 0) {
        for (node of distArr[index]) {
            curNode = node;
            while (eval(curNode['text'].valueOf()) < 0) {
                for (j = index; j < distArr.length; j++) {
                    shift = true
                    fireSet(distArr[j]);
                    shift = false
                }
            }
        }
        index--;
    }
}

function wait(ms) {
    curSec = Date.now();

    while (Date.now() < (curSec + ms)) {

    }
}

async function qReduce(node) {
    let nodeLabel = node.label - 1;
    let legalFiringSet = new Set()
    legalFiringSet = dhars(nodeLabel);
    let visualize = true

    if (visualize) {
        while (legalFiringSet.size > 0) {
            draw();
            await wait(1000);
            fireSet(legalFiringSet);
            legalFiringSet = dhars(nodeLabel);
        }
    } else {
        while (legalFiringSet.size > 0) {
            fireSet(legalFiringSet);
            legalFiringSet = dhars(nodeLabel);
        }
    }
    
}
