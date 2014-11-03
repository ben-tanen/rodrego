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
	for (var i=0;i<10;i++){
		updateDots(i);
	}
}

function updateDots(box_num) {
	for (var i=15;i>0;i--){
		if (boxVal[box_num] >= i) {
			var row = (Math.ceil(i/5));
			var col = (i - 5*(Math.ceil(i/5) - 1));
			var dot = $('#boxes li:nth-child('+(box_num+1)+') tr:nth-child('+row+') td:nth-child('+col+') .dot');
			dot.css('background-color', 'red');
		} else {
			var row = (Math.ceil(i/5));
			var col = (i - 5*(Math.ceil(i/5) - 1));
			var dot = $('#boxes li:nth-child('+(box_num+1)+') tr:nth-child('+row+') td:nth-child('+col+') .dot');
			dot.css('background-color', '#711111');
		}
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
		if (cmd_lines[i].trim().length == 0 || cmd_lines[i].indexOf('#') >= 0) {
			continue;
		}

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

		if (cmd_numbers.indexOf(cmds[i]['cmd_num'],cmd_numbers.indexOf(cmds[i]['cmd_num'])+1) > -1) {
			cmds = 'Command #' + (i+1) + ' Failed: Duplicate Command Number';
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

function printCommands(cmds) {
	var cmd_str = '';
	for (i=0;i<cmds.length;i++){
		cmd_str += '<p class="cmd_output_line">' + cmds[i]['cmd_num'] + '<span class="cmd_output_line_b">' + cmds[i]['cmd'].toUpperCase() + '</span>';
		if (cmds[i]['cmd'] == 'inc') {
			cmd_str += ' <span class="cmd_output_line_c">' + cmds[i]['box'] + '</span> <span class="cmd_output_line_d">' + cmds[i]['nxt_cmd'] + '</span>';
		} else if (cmds[i]['cmd'] == 'deb') {
			cmd_str += ' <span class="cmd_output_line_c">' + cmds[i]['box'] + '</span> <span class="cmd_output_line_d">' + cmds[i]['nxt_cmd'] + '</span> <span class="cmd_output_line_e">' + cmds[i]['fail_cmd'] + '</span>';
		}
		cmd_str += '</p>'
	}
	$('.cmd_display').html(cmd_str);
}

function runCommands(cmds,i) {
	document.getElementById('beep').pause();
	document.getElementById('beep').currentTime = 0;
	document.getElementById('bleep').pause();
	document.getElementById('bleep').currentTime = 0;

	if (cmds[i]['cmd'] != 'end') {
		$('.cmd_output_line').css('color', 'white');
		$('.cmd_output_line:nth-child('+(i+1)+')').css('color', 'yellow');
		next_command = 0;

		if (cmds[i]['cmd'] == 'inc') {
			boxVal[cmds[i]['box']]++;
			next_command = cmds[i]['nxt_cmd'];
			document.getElementById('beep').play();
		} else if (cmds[i]['cmd'] == 'deb') {
			if (boxVal[cmds[i]['box']] > 0) {
				boxVal[cmds[i]['box']]--;
				next_command = cmds[i]['nxt_cmd'];
				document.getElementById('bleep').play();
			} else {
				document.getElementById('fail').play();
				next_command = cmds[i]['fail_cmd'];
			}
		}

		for (j=0;j<cmds.length;j++){
			if (cmds[j]['cmd_num'] == next_command) {
				i = j;
				break;
			}
		}


		setTimeout(function() {
			runCommands(cmds,i);
		}, 500);

        updateScreen();
	} else {
		document.getElementById('success').play();
		$('.cmd_output_line').css('color', 'white');
		$('.cmd_output_line:nth-child('+(i+1)+')').css('color', 'yellow');
	}
	
}

function inc(cmd) {
	if (boxVal[cmd['box']] < max_limit) {
		boxVal[cmd['box']]++;
		updateScreen();
	}
}

function deb(cmd) {
	if (boxVal[cmd['box']] > 0) {
		boxVal[cmd['box']]--;
		updateScreen();
	}
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

		if (typeof cmds == 'string') {
			alert(cmds);
		} else {
			printCommands(cmds);
			setTimeout(function (){
        		runCommands(cmds,0);
        	}, 500);
		}
	});

	$('#reset_btn').click(function() {
		$('#cmd_input').val('');
	});

	$('#step_btn').click(function() {
		cmds = readCommands();
	})
})