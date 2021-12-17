/* 
 * Lets work through the steps that gon(G)
 * needs, we'll need to place all permutations
 * On divisors. 
 */

function gonality(curNode) {
    // Upper Bound of the number of nodes
    let divisor = [];
    let gonDegree = 1;

    for (node in nodes) {
        divisor.push(0);
    }

    let eval = false
    
    while (gonDegree < nodes.length) {
        divisor = zeroAfter(divisor, 0);
        console.log(`Clean Divisor ${divisor}`)
        
        eval = recurseDivisor(divisor, gonDegree, 0, playGonalityGame)
        if (eval) {
            console.log(gonDegree);
            alert(`Gonality of this graph: ${gonDegree}`)
            resetScript()
            draw();

            return gonDegree;
        }
        gonDegree++;
    }

    // Should never get here

    alert(`Gonality of this graph: ${gonDegree}`)
    resetScript()
    draw();
    return gonDegree;

}

function zeroAfter(arr, pos) {
    for (let i = pos; i < arr.length; i++) {
        arr[i] = 0
    }
    return arr
}


function playGonalityGame(divisor) {

    // console.log(`Playing with ${divisor}`)
    // Remove a chip from each node, and run greedy. 
    // Update chip values
    for (node in nodes) {
        nodes[node]['text'] = `${divisor[node]}`;
    }


    for (let node of nodes) {
        if (eval(node['text']) == 0) {
            node['text'] = `-1`;

            // if any are false, we need 
            // to continue somehow
            let g = greedy(quiet = false)
            if (g == false) {
                return false;
            }

            // Reset the divisor. 
            for (let nodeRes in nodes) {
                nodes[nodeRes]['text'] = `${divisor[nodeRes]}`;
            }

        }
    }
    console.log(`Winning divisor: ${divisor}`);
    // Redraw the divisor
    for (node in nodes) {
        nodes[node]['text'] = `${divisor[node]}`;
    }
    
    return true;
    
}


function recurseDivisor(divisor, chips_left, position, fnc) {
    let ret = false
    if (chips_left == 0) {
        //console.log(`Pre ${divisor}`)
        if (position < divisor.length) {
            divisor[position] = 0
        }
        //console.log(`Post ${divisor}`)
        //divisor[position-1] = 0
        if (fnc(divisor)) {
            return true
        }
    } else {
        let start = 0
        if (position == divisor.length - 1) {
            start = chips_left
        }

        for (let i = start; i < chips_left + 1; i++) {
            divisor[position] = i
            ret = recurseDivisor(divisor, chips_left-i, position + 1, fnc)
            if (ret) {
                return true
            }
        }
    }
    return false
}