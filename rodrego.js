var boxVal = new Array(10);
var cmds = [ ];
var max_limit = 5;

function updateScreen() {
	for (i=0;i<10;i++){
		$('#boxes li:nth-child(' + (i+1) + ') p#value').text(boxVal[i]);
	}
}

function cmdLineParse(str) {
	

	var cmd_array = str.trim().replace(/\s{2,}/g, ' ').split(' ');
	cmd = {'cmd': cmd_array[1], 'cmd_num': cmd_array[0], 'fail': false}

	if (cmd['cmd'] == 'inc' || cmd['cmd'] == 'deb') {
		cmd['box'] = cmd_array[2];
		cmd['nxt_cmd'] = cmd_array[3];
		if (cmd['cmd'] == 'deb') {
			cmd['fail_cmd'] = cmd_array[4];
		}
	}

	// cmd fail testing
	// - size
	// - invalid input
	

	return cmd;
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
		cmds.push(cmdLineParse(cmd_lines[i]));
	}
	console.log(cmds);
	return cmds;
}

for (i=0;i<10;i++){
	boxVal[i] = 0;
}

$(document).ready(function() {
	$('.inc').click(function() {
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

	$('#play_btn').click(function() {
		readCommands();
	});

	$('#reset_btn').click(function() {
		$('#cmd_input').val('');
	});
})