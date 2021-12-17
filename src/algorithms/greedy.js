function greedy(quiet = true){
    //borrowing
    shift = true

    //click record script automatically
    let record = document.getElementById('record')
    if (!record.checked) {
        record.click()
    } else {
        resetScript()
    }
    const borrowed = []; //to keep track of the nodes we've borrowed at
    let winning = false; 

    
    //keep looping through until your divisor is out of debt or you've borrowed at every vertex
    while(borrowed.length !== nodes.length && winning === false){ 
        nodes.forEach(node => {
            let chip = parseInt(node['text']);
            if (chip < 0)   {
                fireNode(node, true);
                if(borrowed.indexOf(node) == -1) { //checking to see if the node you're borrowing at is already in the array
                    borrowed.push(node); //if its not, add it
                }
            }
        });
        winning = checkWinning(); //checks to see if the divisor is out of debt
    }

    //Greedy algorithm has finished so checking if winnable or unwinnable 
    if(borrowed.length == nodes.length && quiet){
        alert("So sorry, your graph is unwinnable :(")
    }

    //stop borrowing
    shift = false
    return winning
}

async function drawGreedy() {
    shift = true;
    //click record script automatically
    const graph = makeAdjList()

    let record = document.getElementById('record')
    if (!record.checked) {
        record.click()
    } else {
        resetScript()
    }

    let borrowed = new Set(); //to keep track of the nodes we've borrowed at
    let winning = false; 

    
    //keep looping through until your divisor is out of debt or you've borrowed at every vertex
    while(borrowed.size !== nodes.length && winning === false){ 
        for (node in nodes) {
            if (borrowed.size === nodes.length) {
                break
            }

            let chip = parseInt(nodes[node]['text']);
            if (chip < 0)   {
                // We want the node we're borrowing at to be its own set

                // Runs greey while drawing
                chipBags = [];
                chipBags.push(new Set());
                for (neighbor of graph[node]) {
                    chipBags[0].add(nodes[neighbor]);
                }
                chipBags.push(new Set());
                chipBags[0].add(nodes[node]);
                chipBags[1].add(nodes[node]);
                colors[0] = "gold";
                colors[1] = "purple";
                await waitDraw(500);
                fireNode(nodes[node], true);
                await waitDraw(500);


                // Helps with ending conditions
                if(borrowed.has(nodes[node]) === false) { //checking to see if the node you're borrowing at is already in the array
                    borrowed.add(nodes[node]); //if its not, add it
                }
            }
        };
        winning = checkWinning(); //checks to see if the divisor is out of debt
    }

    colors[0] = "purple"
    colors[1] = "gold"

    
    shift = false;
    chipBags = [];

    if(borrowed.size == nodes.length){
        alert("So sorry, your divisor is unwinnable :(")
    }

    //return new Promise((resolve, reject) => {
    //    resolve(winning);
    //})
}

//returns true if a given divisor is winning, otherwise returns false
function checkWinning(){
    let winning = true; 

    nodes.forEach(node => {
        let chip = parseInt(node['text']);
        if(chip < 0){
            winning = false;
        }
    });

    return winning; //if you iterate through each node and none are in debt, this is a winning divisor
}



