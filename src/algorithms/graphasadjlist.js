function makeAdjList() { 
    // Take the fsm, get the nodes and edges    
    let ret = []; //initializing the adjacency list we'll return to represent the graph

    // Make ret save the same length as 
    // Nodes
    nodes.forEach(node => { 
        ret.push([]);
    });

    // For each edge, add it to the adj list
    links.forEach(link => {
        // TODO: Add weighted edges (for loop over text)
        // TODO: Add support for directed edges
        ret[link.nodeA.label - 1].push(link.nodeB.label - 1);

        // Undirected, add edge from both verts
        ret[link.nodeB.label - 1].push(link.nodeA.label - 1);
    })

    return ret;
};
