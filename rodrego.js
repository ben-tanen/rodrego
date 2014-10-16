var boxVal = new Array(10);
var cmds = [ ];
var max_limit = 5;

function updateScreen() {
	for (i=0;i<10;i++){
		$('#boxes li:nth-child(' + (i+1) + ') p#value').text(boxVal[i]);
	}
}

function readCommands() {
	// must check for duplicate lines
	// must check for inaccurate input
	// - double commands (end, inc, deb)
	// - inaccurate commands
	// - proper jumping from 1 to 2 to 3 to ...
	// - deb has enough inputs
	// - too many inputs

	cmds = [ ];
	var cmd_lines = $('#cmd_input').val().split('\n');
	for (i=0;i<cmd_lines.length;i++){
		var cmd_str = cmd_lines[i].trim();
		var cmd = {'cmd': '', 'cmd_num': 0, 'nxt_num': 0, 'fail_num': 0};

		cmd['cmd_num'] = cmd_str.substr(0,cmd_str.search(' '));

		console.log(cmd);
	}
	return cmds

}

for (i=0;i<10;i++){
	boxVal[i] = 0;
}

$(document).ready(function() {
	$('.inc').click(function() {
		readCommands();
		box_num = $(this).parent().index();
		if (boxVal[box_num] < max_limit) {
			boxVal[box_num]++;
			updateScreen();
		}
	});

	$('.deb').click(function() {
		box_num = $(this).parent().index();
		if (boxVal[box_num] > 0) {
			boxVal[box_num]--;
			updateScreen();
		}
	});
})