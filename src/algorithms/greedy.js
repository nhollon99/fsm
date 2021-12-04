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

    const graph = makeAdjList(); //calls array that pairs edges and vertices

    const borrowed = []; //to keep track of the nodes we've borrowed at
    let winning = false; 

    
    //keep looping through until your divisor is out of debt or you've borrowed at every vertex
    while(borrowed.length !== nodes.length && winning === false){ 
        nodes.forEach(node => {
            let chip = parseInt(node['text']);
            if(chip < 0){
                fireNode(node, true);
                if(borrowed.indexOf(node) == -1){ //checking to see if the node you're borrowing at is already in the array
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



