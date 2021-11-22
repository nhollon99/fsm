/* 
Idea:
- user chooses a vertex to be q to run q-reducing on
- within a loop: 
    - call dhars on that vertex to see if there's a legal firing set
    - if not, you're done
    - if so, fire that firing set and run through loop again

Questions:
- syntax for calling a function from within a functioin?
- need to set up the graph again or don't have to worry about it because dhars will take care of that
- how we want to check if there isn't a legal subset firing so you should do nothing
- does dhars return nothing if there's no legal firing set?
- how to fire dhars' set not manually?
    - for loop to fire each vertex in set? call existing method? 
    - where in the code does the actual firing happen?
*/


function qreduce(node) {
    



}