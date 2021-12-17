function genus() {
    nodeNumber = nodes.length
    edgeNumber = links.length
    genusNum = edgeNumber - nodeNumber + 1
    alert(`Genus of this graph: ${genusNum}`)
}