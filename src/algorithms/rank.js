function rank() {
    // Upper Bound of the number of nodes
    let divisor = [];
    let rank = 0;

    for (node in nodes) {
        if (nodes[node]['text'] == '') {
            nodes[node]['text'] = '0'
        }
        divisor.push(0);
    }

    let eval = false
    
    while (true) {
        divisor = zeroAfter(divisor, 0);
        console.log(`Clean Divisor ${divisor}`)
        
        eval = recurseDivisor(divisor, rank, 0, playRankGame)
        if (eval) {
            console.log(rank - 1);
            alert(`Rank of this graph: ${rank - 1}`)
            resetScript()
            draw();

            return rank - 1;
        }
        rank++;
    }
}


function playRankGame(divisor) {

    // Subtract the given divisor from the 
    // current board, but need to preserve
    // current board. 
    let oldVals = [];
    for (let node in nodes) {
        oldVals.push(nodes[node]['text']);
        nodes[node]['text'] = `${eval(nodes[node]['text'])-divisor[node]}`;
    }


    let ret = greedy(quiet = false);

    // Restore the board

    for (let tex in oldVals) {
        nodes[tex]['text'] = oldVals[tex]
    }


    // Return the opposite. If the divisor wins, return false. 
    // This is for compatability with recurseDvisior()
    return (!ret);

}