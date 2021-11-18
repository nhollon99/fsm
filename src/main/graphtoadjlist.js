
function makeAdjList() { 
    let fsmJSONObj = JSON.parse(localStorage['fsm']); // stored as a JSON string in local browser

    // Take the fsm, get the nodes and edges
    // Build adj list, 
    let links = fsmJSONObj['links'];
    let nodes = fsmJSONObj['nodes'];
    
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
        ret[link['nodeA']].push(link['nodeB']);

        // Undirected, add edge from both verts
        ret[link['nodeB']].push(link['nodeA']);
    })

    return ret;
};