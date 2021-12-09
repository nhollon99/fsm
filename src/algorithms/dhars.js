function dhars(node) {
    const graph = makeAdjList(); //calls array that pairs edges and vertices
    
    let component = buildDistanceArray(nodes[node])

    let chips = new Map();
    let legalFire = new Set();

    for (set of component) {
        for (nodeIt of set) {
            chips.set(nodeIt.label - 1, parseInt(nodeIt.text))
            legalFire.add(nodeIt.label - 1)
        }
    }

    let q = [];

    q.push(node); //add chosen node to q
    legalFire.delete(node); //remove chosen node from legal firing set

    //while there is a node in q, decrement chips at each neighbor by 1
    // if neighbor's chips are less than 0, add to q and remove from legal firing set
    while (q.length) {
        let n = q.shift();
        let neighbors = graph[n];
        neighbors.forEach(neighbor => {
            chips.set(neighbor, chips.get(neighbor) - 1);
            if (chips.get(neighbor) < 0 && legalFire.has(neighbor)) {
                q.push(neighbor);
                legalFire.delete(neighbor);
            }
        })
    }

    let ret = new Set();
    for (num of legalFire) {
        ret.add(nodes[num]);
    }

    if(ret.size == 0){
        alert("So sorry, no legal firing set was found :(")
    }
    
    return ret; //returning legal firing set
}