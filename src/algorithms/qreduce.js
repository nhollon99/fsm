async function runQReduce(node) {
    //click record script automatically
    let record = document.getElementById('record')
    if (!record.checked) {
        record.click()
    } else {
        resetScript()
    }

    colors = ["purple", "gold", "blue"];

    await debtToQ(buildDistanceArray(node));
    
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
async function debtToQ(distArr) {
    // Iterate backwards borrowing until each set of nodes
    // a distance *index* from Q is 
    if (document.getElementById('visualize').checked) {
        chipBags = setsToBags(distArr);
        await waitDraw(1000);
    }
    let index = distArr.length - 1;
    let curNode = 0;
    while (index >= 0) {
        for (node of distArr[index]) {
            curNode = node;
            if (document.getElementById('visualize').checked) {
                while (eval(curNode['text'].valueOf()) < 0) {
                    for (j = index; j < distArr.length; j++) {
                        shift = true
                        fireSet(distArr[j]);
                        shift = false
                    }
                    await waitDraw(750);
                    
                }
            } else {
                while (eval(curNode['text'].valueOf()) < 0) {
                    for (j = index; j < distArr.length; j++) {
                        shift = true
                        fireSet(distArr[j]);
                        shift = false
                    }
                    
                }
            }
        }
        index--;
    }
    
    if (document.getElementById('visualize').checked) {
        await waitDraw(1000);
    }

    emptyChipBags();
}

/* Will draw, then wait @ms milliseconds, 
 */
function waitDraw(ms) {
    draw();
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(ms);
        }, ms);
    });
}

/* Will wait for 'ms' milliseconds but not draw
 */
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(ms);
        }, ms);
    });
}


async function qReduce(node) {
    if (document.getElementById('visualize').checked) {
        await waitDraw();
    }
    let nodeLabel = node.label - 1;
    let legalFiringSet = new Set()
    legalFiringSet = dhars(nodeLabel, 1);
    if (document.getElementById('visualize').checked) {
        while (legalFiringSet.size > 0) {
            await waitDraw(1000);
            fireSet(legalFiringSet);
            legalFiringSet = dhars(nodeLabel, 1);
        }
    } else {
        while (legalFiringSet.size > 0) {
            fireSet(legalFiringSet);
            legalFiringSet = dhars(nodeLabel, 1);
        }
    }
    emptyChipBags();
    draw();
    
}
