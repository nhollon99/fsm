/* 
 * Lets work through the steps that gon(G)
 * needs, we'll need to place all permutations
 * On divisors. 
 */

function gonality(curNode) {
    // Upper Bound of the number of nodes
    let divisor = [];
    let gonDegree = 2;

    for (node in nodes) {
        divisor.push(0);
    }

    let eval = false
    
    while (gonDegree < nodes.length) {
        divisor = zeroAfter(divisor, 0);
        console.log(`Clean Divisor ${divisor}`)
        
        eval = recurseDivisor(divisor, gonDegree, 0)
        //eval = permuteDivisor(divisor, gonDegree)
        if (eval) {
            console.log(gonDegree);
            alert(`Gonality of this graph is: ${gonDegree}`)
            return gonDegree;
        }
        gonDegree++;
    }

    // Should never get here

    alert(`Gonality of this graph is: ${gonDegree}`)
    return gonDegree;

}

function sumLeft(arr, stop) {
    let ret = 0;
    for (i = 0; i < stop; i++) {
        ret += arr[i]
    }
    return ret;
}

function getLastNonZero(arr) {
    let ret = 0;
    for (ele in arr) {
        if (arr[ele] != 0) {
            ret = ele
        }
    }
    return ret
}

function zeroAfter(arr, pos) {
    //console.log(pos)
    //console.log(arr)
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

    for (node of nodes) {
        if (eval(node['text']) == 0) {
            node['text'] = '-1';
            // if any are false, we need 
            // to continue somehow
            if (greedy(quiet = false) == false) {
                return false;
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

function permuteDivisor(divisor, totDegree) {
    divisor[divisor.length - 1] = totDegree
    console.log(divisor)
    while(divisor[0] != totDegree) {
        if (playGonalityGame(divisor)) {
            return true
        }
        index = getLastNonZero(divisor)
        // Add one to previous
        // send current to 0
        divisor[index - 1] += 1
        divisor[index] = 0

        // Send remainder to end

        divisor[divisor.length - 1] =  totDegree - sumLeft(divisor, index)
        console.log(divisor)
    }
    return playGonalityGame(divisor)
}

/*
 * Recursive version doesn't work for some reason
 * cant even get them all to print
 */

function recurseDivisor(divisor, chips_left, position) {
    let ret = false
    if (chips_left == 0) {
        //console.log(`Pre ${divisor}`)
        //divisor = zeroAfter(divisor, position)
        if (position < divisor.length) {
            divisor[position] = 0
        }
        //console.log(`Post ${divisor}`)
        //divisor[position-1] = 0
        if (playGonalityGame(divisor)) {
            return true
        }
    } else {
        let start = 0
        if (position == divisor.length - 1) {
            start = chips_left
        }

        for (let i = start; i < chips_left + 1; i++) {
            divisor[position] = i
            ret = recurseDivisor(divisor, chips_left-i, position + 1)
            if (ret) {
                return true
            }
        }
    }
    return false
}

/*
 * 0111
 * 0120
 * 0201
 * 0210
 * 0300
 * 1002
 * 1011
 * 1020
 * 1101
 * 1110
 * 1200
 * 2001
 * 2010
 * 2100
 * 3000
 * 3000
 * 2100
 * 2010
 */