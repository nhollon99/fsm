function setHighlight(set) {
    // Take in a set, and then highlight them on
    // the board. 
    let c = canvas.getContext('2d')
    console.log(c)
    c.clearRect(0, 0, canvas.width, canvas.height);
	
    c.save()
	//c.translate(0.5, 0.5);

    let col = 'black';

	for(var i = 0; i < nodes.length; i++) {
		c.lineWidth = 1;
        if (set.has(i)) {
            col = 'purple';
        } else {
            col = 'black';
        }
		c.fillStyle = c.strokeStyle = col;
		nodes[i].draw(c);
	}

    for(var i = 0; i < links.length; i++) {
        console.log()
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = (links[i] == selectedObject) ? 'blue' : 'black';
		links[i].draw(c);
	}

    if(currentLink != null) {
		c.lineWidth = 1;
		c.fillStyle = c.strokeStyle = 'blue';
		currentLink.draw(c);
	}
}