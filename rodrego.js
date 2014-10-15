var boxVal = new Array(10);
for (i=0;i<10;i++){
	boxVal[i] = 0;
}

// alert(boxes[0]["object"].innerHTML);

function inc(box_num) {
	boxVal[box_num]++;
	updateScreen();
}

function deb(box_num) {
	// must include if value is already 0
	boxVal[box_num]--;
	updateScreen();
}

function updateScreen() {
	console.log(boxVal);
	for (i=0;i<10;i++){
		$('#boxes li:nth-child(' + i+1 + ') p#value').text(boxVal[i]);
	}
}

$(document).ready(function() {

})