
//should return the updated graph with the result after the greedy algorithm has run
//also want it to declare whether its winnable or not (particularly if its not)

function greedy(){
    const graph = makeAdjList(); //calls array that pairs edges and vertices
    //let nodes = JSON.parse(localStorage['fsm'])['nodes'];
    console.log(nodes); 
    const borrowed = []; //to keep track of the nodes we've borrowed at
    let winning = false; 

    
    //keep looping through until your divisor is out of debt or you've borrowed at every vertex
    while(borrowed.length !== nodes.length && winning === false){ 
        nodes.forEach(node => {
            let chip = parseInt(node['text']);
            if(chip < 0){
                borrowNode(node);
                if(borrowed.indexOf(node) == -1){ //checking to see if the node you're borrowing at is already in the array
                    borrowed.push(node); //if its not, add it
                }
                console.log(borrowed);
            }
        });
        winning = checkWinning(); //checks to see if the divisor is out of debt
    }

    //Greedy algorithm has finished so checking if winnable or unwinnable 
    if(borrowed.length == nodes.length){
        alert("So sorry, your graph is unwinnable :(")
    }

}

//returns true if a given divisor is winning, otherwise returns false
function checkWinning(){
    //const graph = makeAdjList(); //calls array that pairs edges and vertices
    //let nodes = JSON.parse(localStorage['fsm'])['nodes'];
    let winning = true; 

    nodes.forEach(node => {
        let chip = parseInt(node['text']);
        if(chip < 0){
            winning = false;
        }
    });

    console.log(winning);
    return winning; //if you iterate through each node and none are in debt, this is a winning divisor
}



