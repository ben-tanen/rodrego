var boxVal = new Array(10);
var cmds = [ ];
var max_limit = 15;

function initalize() {
	for (i=0;i<10;i++){
		boxVal[i] = i;
	}
	updateScreen();
}

function updateScreen() {
	for (i=0;i<10;i++){
		$('#boxes li:nth-child(' + (i+1) + ') p#value').text(boxVal[i]);
	}
}

function cmdLineParse(str) {
	var cmd_array = str.trim().replace(/\s{2,}/g, ' ').split(' ');
	cmd = {'cmd': cmd_array[1], 'cmd_num': parseInt(cmd_array[0]), 'fail': false}

	if ((cmd['cmd'] == 'inc' && cmd_array.length != 4) || 
	    (cmd['cmd'] == 'deb' && cmd_array.length != 5) ||
	    (cmd['cmd'] == 'end' && cmd_array.length != 2)) {
		cmd['fail'] = true;
		return cmd;
	}

	if (cmd['cmd'] == 'inc' || cmd['cmd'] == 'deb') {
		cmd['box'] = parseInt(cmd_array[2]);
		cmd['nxt_cmd'] = parseInt(cmd_array[3]);
		if (cmd['cmd'] == 'deb') {
			cmd['fail_cmd'] = parseInt(cmd_array[4]);
		}
	}

	if (cmdFail(cmd)) {
		cmd['fail'] = true;
	}

	return cmd;
}

function cmdFail(cmd) {
	if (cmd['cmd'] == 'end') {
		if (isNaN(cmd['cmd_num'])) {
			return true;
		}
	} else if (cmd['cmd'] == 'inc' || cmd['cmd'] == 'deb') {
		if (cmd['box'] < 0 || cmd['box'] > 9) {
			return true;
		} else if (isNaN(cmd['box']) || isNaN(cmd['nxt_cmd']) || isNaN(cmd['cmd_num'])) {
			return true;
		} else if (cmd['cmd'] == 'deb' && isNaN(cmd['fail_cmd'])) {
			return true;
		}
	} else {
		return true;
	}

	return false;
}

function readCommands() {
	cmds = [ ];
	var cmd_lines = $('#cmd_input').val().split('\n');
	for (i=0;i<cmd_lines.length;i++){
		cmd = cmdLineParse(cmd_lines[i]);
		if (cmd['fail'] == false){
			cmds.push(cmd);
		} else {
			cmds = 'Line ' + (i+1) + ' Failed: Check for Proper Syntax';
			return cmds;
		}	
	}

	cmds = checkCmdStream(cmds);
	return cmds;
}

function checkCmdStream(cmds) {
	var cmd_numbers = [ ];

	cmds = cmds.sort(function(a, b) {
	        var x = a['cmd_num']; var y = b['cmd_num'];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});

	

	for (i=0;i<cmds.length;i++) {
		cmd_numbers.push(cmds[i]['cmd_num']);
	}

	for (i=0;i<cmds.length;i++) {
		// check for end
		// check if nxt_cmd is valid
		// check for deb and if fail_cmd is valid

		if (cmds[i]['cmd'] == 'end') {
			// 
		} else if (cmds[i]['cmd'] == 'inc') {
			var next_cmd = cmds[i]['nxt_cmd'];
			var found = false;
			
			for (j=0;j<cmd_numbers.length;j++){
				if (next_cmd == cmd_numbers[j]) {
					found = true;
				}
			}

			if (!found) {
				cmds = 'Command #' + (i+1) + ' Failed: Improper Next Command'
			}
		} else if (cmds[i]['cmd'] == 'deb') {
			var next_cmd = cmds[i]['nxt_cmd'];
			var fail_cmd = cmds[i]['fail_cmd'];
			var cmds_found = [false, false];

			for (j=0;j<cmds.length;j++){
				if (next_cmd == cmds[j]['cmd_num']) {
					cmds_found[0] = true;
				}
				if (fail_cmd == cmds[j]['cmd_num']) {
					cmds_found[1] = true;
				}
			}

			if (cmds_found[0] != true || cmds_found[1] != true) {
				cmds = 'Command #' + (i+1) + ' Failed: Improper Next Command(s)'
			}
		}
	}

	return cmds;
}

$(document).ready(function() {
	initalize();

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
		cmds = readCommands();
		console.log(cmds);
	});

	$('#reset_btn').click(function() {
		$('#cmd_input').val('');
	});
})