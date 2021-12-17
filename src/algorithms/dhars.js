function dhars(node, quiet = 0) {
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

    if (!quiet) {
        if(ret.size == 0){
            alert("So sorry, no legal firing set was found :(")
        }
    }
  
    chipBags = [];
    chipBags.push(ret);

    console.log(legalFire);

    return ret; //returning legal firing set
}

async function drawDhars(node) {
    console.log("inhere")
    const graph = makeAdjList();
    let chips = [];
    let legalFire = new Set();
    let burned = new Set();
    let unburned = new Set();
    burned.add(nodes[node])

    for (nodeIt in nodes) {
        chips.push(parseInt(nodes[nodeIt]['text'])); //adding chip values of each vertex to chips array
        if (nodeIt != node) {
            legalFire.add(parseInt(nodeIt));
        }
    }
    console.log(chips)
    console.log(legalFire)

    let q = [];
    q.push(node);
    while (q.length) {
        makeBag(burned);
        chipBags.push(unburned)
        colors[0] = "red"
        colors[1] = "black"
        await waitDraw(1000);
        colors[0] = "purple"
        colors[1] = "gold"
        let curNodeNum = q.shift();
        let neighbors = graph[curNodeNum];

        for (let neigh of neighbors) {
            burned.add(nodes[neigh]);
            if (chips[neigh] >= 0 && neigh != node) {
                unburned.add(nodes[neigh]);
            }
        }

        makeBag(burned);
        chipBags.push(unburned)
        colors[0] = "red"
        colors[1] = "black"
        await waitDraw(1000);
        colors[0] = "purple"
        colors[1] = "gold"
        
        for (let neighbor of neighbors) {
            chips[neighbor] -= 1;
            if (chips[neighbor] < 0 && legalFire.has(neighbor)) {
                q.push(neighbor);
                legalFire.delete(neighbor);
                unburned.delete(nodes[neighbor]);
            }
        }

    }


    let ret = new Set();
    for (num of legalFire) {
        ret.add(nodes[num]);
    }

    makeBag(ret);
    await waitDraw(1000);
    return ret
}