
//should return the updated graph with the result after the greedy algorithm has run
//also want it to declare whether its winnable or not (particularly if its not)

function greedy(){
    const graph = makeAdjList(); //calls array that pairs edges and vertices
    let nodes = JSON.parse(localStorage['fsm'])['nodes'];
    console.log(nodes); 
    const borrowed = []; //to keep track of the nodes we've borrowed at
    let winning = false; 

    
    //keep looping through until your divisor is out of debt or you've borrowed at every vertex
    while(borrowed.length !== nodes.length && winning == false){ //one or two equals signs??
        nodes.forEach(node => {
            let chip = parseInt(node['text']);
            if(chip < 0){
                borrowNode(node); //tried fireNode too but not actually sure how to make it update... -Heidi
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
        console.log("unwinnable"); //eventually want this to tell a message to the user that this is unwinnable
    }
    else{
        //return the updated, "won" graph and write a message that it's winnable
    }
    draw();
    console.log("finished Algo"); //checking that it makes it here

}

//returns true if a given divisor is winning, otherwise returns false
function checkWinning(){
    const graph = makeAdjList(); //calls array that pairs edges and vertices
    let nodes = JSON.parse(localStorage['fsm'])['nodes'];

    nodes.forEach(node => {
        let chip = parseInt(node['text']);
        if(chip < 0){
            return false;
        }
    });

    return true; //if you iterate through each node and none are in debt, this is a winning divisor
}


/*
Summary:
- configured so that clicking "greedy" automatically runs this algorithm (no need to click anywhere else)
- 

Questions:
- how to actually make the borrowing happen and visible on the graph
- do we need to construct the adjacency list thing? What exactly is that for?
- is my checkWinning fxn okay in here? do we already have this somewhere else?
- how to make the screen tell a message to the user?
- what else does it return? return the new divisor or is that something that's just updated and doesn't need to return?
*/

