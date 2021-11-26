/* 
Idea:
- user chooses a vertex to be q to run q-reducing on 
- make it so only your vertex has debt
    - build spanning tree 
    - breadth first search
    - build a table of distances and number of chips on each node
        - 0th element of tuple/array is distance, 1st element is number of chips 
    - after you set borrow, update numbers of chips
        - keep set borrowing until all vertices in the set out of debt
    - find furthest vertices away, set borrow at all of those until positive chips
    - then move in to next layer and set borrow again (including positive perimeter chips)
- within a loop: 
    - call dhars on that vertex to see if there's a legal firing set
    - if not, you're done
    - if so, fire that firing set and run through loop again

Questions:
- syntax for calling a function from within a functioin?
- need to set up the graph again or don't have to worry about it because dhars will take care of that
- how we want to check if there isn't a legal subset firing so you should do nothing
- does dhars return nothing if there's no legal firing set?
- how to fire dhars' set not manually?
    - for loop to fire each vertex in set? call existing method? 
    - where in the code does the actual firing happen?
*/

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

function debtOnq(node){
    


}

function qReduce(node) {
    let nodeLabel = node.label ;
    let legalFiringSet = newSet()
    legalFiringSet.add(0)
    while (legalFiringSet.size) {
        legalFiringSet = dhars(nodeLabel) ;
        fireSet(legalFiringSet) ;
    }
}

function fireSet(legalFiringset) {
    for (node of nodes){
        if (legalFiringSet.has(node.label)) {
            fireNode(node);
        }
    }
}
