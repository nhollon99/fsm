function genus() {
    nodeNumber = nodes.length
    edgeNumber = links.length
    genus = edgeNumber - nodeNumber + 1
    alert(`Genus of this graph: ${genus}`)
}