function drawNodes(n, m) {
    let labelStart = nodes.length

    if (m) {
        let nSpacing = (600 / n) + 1
        for (let i = 0; i < n; i++) {
            node = new Node(100 + i*nSpacing, 200)
            node.label = labelStart + i+1
            nodes.push(node)

        }
        let mSpacing = (600 / m) + 1 
        for (let j = 0; j < m; j++){
            node = new Node(100 + j*mSpacing, 400)
            node.label = labelStart + j+1+n
            nodes.push(node)
        }
    } else {
        for (let i = 0; i < n; i++) {
            node = new Node(Math.floor(400 + (200*Math.cos(2*Math.PI*(i/n)))), Math.floor(300 + (200*Math.sin(2*Math.PI*i/n))))
            node.label = labelStart + i + 1
            console.log(Math.floor(400 + (200*Math.cos(2*Math.PI*(i/n)))), Math.floor(300 + (200*Math.sin(2*Math.PI*i/n))))
            nodes.push(node)
        }
    }
}

function drawPath(n) {
    drawNodes(n, 0)
    for (let i = nodes.length - n; i < nodes.length - 1; i++) {
        links.push(new Link(nodes[i], nodes[i+1], false, 1))
    }
    draw()
}

function drawCycle(n) {
    drawNodes(n,0)
    for (let i = nodes.length - n; i < nodes.length - 1; i++){
        links.push(new Link(nodes[i], nodes[i+1], false, 1))
    }
    links.push(new Link(nodes[nodes.length - 1], nodes[nodes.length - n], false, getLinkNumber(nodes[nodes.length - 1], nodes[nodes.length - n])))
    draw()
}

function drawComplete(n){
    drawNodes(n, 0)
    for (let i = nodes.length - n; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            links.push(new Link(nodes[i], nodes[j], false, 1))
        }
    }
    draw()
}

function drawCompleteBipartite(n, m) {
    drawNodes(n,m)
    for (let i = nodes.length-n-m; i < nodes.length - m; i++){
        for(let j = nodes.length - m; j < nodes.length; j++)
            links.push(new Link(nodes[i], nodes[j], false, 1))
    }
    draw()
}