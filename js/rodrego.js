var boxVal = new Array(10);
var cmds = [ ];
var max_limit = 1000;
var cmdSpeed = 500;
var stepCmd = -1;
var soundOff = false;
var showNum = false;
var reset = false;

// initalize boxValues / adjust for beginning of program
function initalize() {
	$("#reset_btn").prop("disabled",true);
	for (i=0;i<10;i++){
		boxVal[i] = i;	
	}
	updateScreen();
}

// option to turn on / off showing box numbers vs. box dots
function toggleShowNum() {
	if (showNum) {
		// hide numbers, show boxes
		// change text, change showNum
		$('.value_num').css({'visibility': 'hidden'});
		$('.value table').css({'visibility': 'visible'});
		$('#showNum').text('Show Box Count');
		showNum = false;
	} else {
		// show numbers, hide boxes
		// change text, change showNum
		$('.value_num').css({'visibility': 'visible'});
		$('.value table').css({'visibility': 'hidden'});
		$('#showNum').text('Show Box Dots');
		showNum = true;
	}

	// automatically sets it to box numbers if over the limit of dots
	for (var i=0;i<10;i++) {
		if (boxVal[i] > 15) {
			$('#boxes li:nth-child('+(i+1)+') .value_num').css({'visibility': 'visible'});
			$('#boxes li:nth-child('+(i+1)+') table').css({'visibility': 'hidden'});
		}
	}
}

function updateScreen() {
	for (var i=0;i<10;i++){
		$('#boxes li:nth-child('+(i+1)+') .value_num').text(boxVal[i]);
		if (boxVal[i] > 15) {
			$('#boxes li:nth-child('+(i+1)+') .value_num').css({'visibility': 'visible'});
			$('#boxes li:nth-child('+(i+1)+') table').css({'visibility': 'hidden'});
		} else if (!showNum && boxVal[i] <= 15) {
			$('#boxes li:nth-child('+(i+1)+') .value_num').css({'visibility': 'hidden'});
			$('#boxes li:nth-child('+(i+1)+') table').css({'visibility': 'visible'});
		}
		updateDots(i);
	}
}

function updateDots(box_num) {
	for (var i=15;i>0;i--){
		var row = (Math.ceil(i/5));
		var col = (i - 5*(Math.ceil(i/5) - 1));
		var dot = $('#boxes li:nth-child('+(box_num+1)+') tr:nth-child('+row+') td:nth-child('+col+') .dot');
		if (boxVal[box_num] >= 16 - i) {
			dot.css('background-color', 'red');
		} else {
			dot.css('background-color', '#711111');
		}
	}
}

// change the speed of running commands (to faster or slower)
function changeSpeed() {
	var result = prompt("Enter a new speed (in ms between 100 and 100,000)",  cmdSpeed);
 
	if (result != null && !isNaN(result) && result >= 100 && result <= 100000) {
        	cmdSpeed = parseInt(result);
    	}
}

// turn off or on sound
function changeSound() {
	if (soundOff) {
		soundOff = false;
		$('.options p:nth-child(3)').text('Sound Off');
	} else {
		soundOff = true;
		$('.options p:nth-child(3)').text('Sound On');
	}

}

// used for inputting custom scripts into command input
// scripts originally give from RodRego original
// depending on script type that is pass, edit the string & edit input box
function customScript(script_type) {
	if (script_type == 'simple') {
		cmd_string = '### This is a Simple Script ###\n\n# MiXED CaSE\n1  iNc    2 2\n2 end\n\n#The next line is\n#commented out\n#3 inc 2 2';
	} else if (script_type == 'add') {
		cmd_string = '1 deb 4 1 2\n2 deb 2 3 4\n3 inc 4 2\n4 deb 3 5 6\n5 inc 4 4\n6 end\n';
	} else if (script_type == 'sub') {
		cmd_string = '1 deb 4 1 2\n2 deb 2 3 7\n3 deb 3 2 4\n4 inc 2 5\n5 deb 2 6 9\n6 inc 4 5\n7 deb 3 8 9\n8 inc 4 7\n9 end';
	} else if (script_type == 'mul') {
		cmd_string = '1 deb 6 1 2\n2 deb 4 2 3\n3 deb 2 4 9\n4 deb 3 5 6\n5 inc 6 4\n6 deb 6 7 3\n7 inc 4 8\n8 inc 3 6\n9 end';
	} else if (script_type == 'extended') {
		cmd_string = '1 deb 4 1 2\n2 deb 2 3 7\n3 deb 3 2 4\n4 inc 2 5\n5 deb 2 6 9\n6 inc 4 5\n7 deb 3 8 9\n8 inc 4 7\n9 end\n10 inc 2 2\n11 deb 1 1 1\n12 inc 2 2\n13 deb 1 1 1\n14 inc 2 2\n15 deb 1 1 1\n16 inc 2 2';
	} else {
		cmd_string = '# custom script here';
	}
	$('#cmd_input').val(cmd_string);
}

// function to parse command lines, returning command / arguments as object
function cmdLineParse(str) {
	// replaces multiple spaces with just one space
	// replaces all comments, denoted with either []s or #s
	// trims before / after spaces
	// splits string up into array based on spaces
	var cmd_array = str.replace(/#.*/g, ' ').replace(/\[.*\]/g, '').trim().toLowerCase().replace(/\s{2,}/g, ' ').split(' ');

	// from spliced string, take cmd type (inc,deb,end) and cmd number
	cmd = {'cmd': cmd_array[1], 'cmd_num': parseInt(cmd_array[0]), 'fail': false}

	// depending on type of command, make sure correct number of arguments
	// if not, report failure
	if ((cmd['cmd'] == 'inc' && cmd_array.length != 4) || 
	    (cmd['cmd'] == 'deb' && cmd_array.length != 5) ||
	    (cmd['cmd'] == 'end' && cmd_array.length != 2)) {
		cmd['fail'] = true;
		return cmd;
	}

	// if cmd is inc or deb, pull information from cmd_array
	// both commands need box number and next command
	// only deb commands need fail command number
	if (cmd['cmd'] == 'inc' || cmd['cmd'] == 'deb') {
		cmd['box'] = parseInt(cmd_array[2]);
		cmd['nxt_cmd'] = parseInt(cmd_array[3]);
		if (cmd['cmd'] == 'deb') {
			cmd['fail_cmd'] = parseInt(cmd_array[4]);
		}
	}

	// check command for failure
	if (cmdFail(cmd)) {
		cmd['fail'] = true;
	}

	return cmd;
}

// checks if a command (in obj-form) fails any particular tests
function cmdFail(cmd) {
	// if cmd is 'end' and 1 arg isn't number -> fail
	if (cmd['cmd'] == 'end') {
		if (isNaN(cmd['cmd_num'])) {
			return true;
		}

	// if cmd is either 'inc' or 'deb'
	} else if (cmd['cmd'] == 'inc' || cmd['cmd'] == 'deb') {
		// if command attempts to edit box outside of correct range -> fail
		if (cmd['box'] < 0 || cmd['box'] > 9) {
			return true;

		// if cmd's box, next command, command number are not numbers -> fail
		} else if (isNaN(cmd['box']) || isNaN(cmd['nxt_cmd']) || isNaN(cmd['cmd_num'])) {
			return true;

		// if cmd is 'deb' and fail command is NaN -> fail
		} else if (cmd['cmd'] == 'deb' && isNaN(cmd['fail_cmd'])) {
			return true;
		}
	// if command is anything other than 'inc','deb','end' -> fail
	} else {
		return true;
	}

	// all other commands must be correct
	return false;
}

function readCommands() {
	cmds = [ ];

	// split up commands based on new-line characters
	var cmd_lines = $('#cmd_input').val().split('\n');

	// for each command line
	for (i=0;i<cmd_lines.length;i++){
		// if command is of length zero or starts with comment (denoted by #)
		// skip line / don't parse
		if (cmd_lines[i].trim().length == 0 || cmd_lines[i].indexOf('#') == 0) continue;

		// parse command string, returned as object
		cmd = cmdLineParse(cmd_lines[i]);

		// if command doesn't fail, push it onto commands array
		if (cmd['fail'] == false){
			cmds.push(cmd);

		// if command failed for somer eason, report which line failed
		} else {
			cmds = 'Line ' + (i+1) + ' Failed: Check for Proper Syntax';
			return cmds;
		}	
	}

	// once all commands are read in, check that there is a correct stream
	// can go from 1 to next command to next command to ... until end
	// if stream is invalid, will return error string
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

function runCommands(cmds,i,step) {
	document.getElementById('beep').pause();
	document.getElementById('beep').currentTime = 0;
	document.getElementById('bleep').pause();
	document.getElementById('bleep').currentTime = 0;

	if (cmds[i]['cmd'] != 'end') {
		$('.cmd_output_line').css('color', 'white');
		$('.cmd_output_line:nth-child('+(i+1)+')').css('color', 'yellow');

		// highlights box number of currently updating box
		$('#boxes li #box_num').css('color', 'red');
		$('#boxes li:nth-of-type(' + (cmds[i]['box'] + 1) + ') #box_num').css('color', 'yellow');
		next_command = 0;

		if (cmds[i]['cmd'] == 'inc') {
			boxVal[cmds[i]['box']]++;
			if (!soundOff) {
				document.getElementById('beep').play();
			}
			next_command = cmds[i]['nxt_cmd'];
			
		} else if (cmds[i]['cmd'] == 'deb') {
			if (boxVal[cmds[i]['box']] > 0) {
				boxVal[cmds[i]['box']]--;
				next_command = cmds[i]['nxt_cmd'];
				if (!soundOff) {
					document.getElementById('bleep').play();
				}
			} else {
				if (!soundOff) {
					document.getElementById('fail').play();
				}
				next_command = cmds[i]['fail_cmd'];
			}
		}

		updateScreen();

		for (j=0;j<cmds.length;j++){
			if (cmds[j]['cmd_num'] == next_command) {
				i = j;
				break;
			}
		}

		if (!step && !reset) {
			setTimeout(function() {
				runCommands(cmds,i,false);
			}, cmdSpeed);
		} else if (step) {
			stepCmd = i;
		} else if (reset) {
			reset = false;
			$("#play_btn").prop("disabled",false);
			$("#reset_btn").prop("disabled",true);
		}
        
	} else {
		if (!soundOff) {
			document.getElementById('success').play();
		}
		$("#play_btn").prop("disabled",false);
		$("#reset_btn").prop("disabled",true);
		$('.cmd_output_line').css('color', 'white');
		$('.cmd_output_line:nth-child('+(i+1)+')').css('color', 'yellow');
		stepCmd = -1;
	}
}

$(document).ready(function() {
	initalize();

	// map guide and options pop-up to correct buttons, set settings
	user_guide_popup = new jBox('Modal',{
		attach: $('#guide_button'),
		width: 600 ,
		height: 500,
		title: "<b>Welcome to RodRego!</b>",
		content: $('.user_guide')
	});

	options_popup = new jBox('Modal',{
		attach: $('#options_button'),
		width: 230 ,
		height: 250,
		title: "Options",
		content: $('.options')
	});

	// map tooltips to guide / options button, set settings
	userguide_tooltip = new jBox('Tooltip',{
		attach: $('#guide_button'),
		content: "View User Guide",
		position: {
			x: 'right',
			y: 'center'
		},
		outside: 'x'
	});

	tooltip_test = new jBox('Tooltip',{
		attach: $('#options_button'),
		content: "Edit Options",
		position: {
			x: 'right',
			y: 'center'
		},
		outside: 'x'
	});

	// map 'inc' & 'deb' buttons to edit their particular box
	// finding the box number and just incrementing / decrementing
	$('.inc').click(function() {
		box_num = $(this).parent().index();
		if (boxVal[box_num] < max_limit) {
			boxVal[box_num]++;
			updateScreen();
			if (!soundOff) {
				document.getElementById('beep').play();
			}
		}
	});

	$('.deb').click(function() {
		box_num = $(this).parent().index();
		if (boxVal[box_num] > 0) {
			boxVal[box_num]--;
			updateScreen();
			if (!soundOff) {
				document.getElementById('bleep').play();
			}
		} else {
			if (!soundOff) {
				document.getElementById('fail').play();
			}
		}
	});

	// attempt to run through commands
	$('#play_btn').click(function() {
		// read commands
		cmds = readCommands();

		// if no commands read or cmds is an error string
		if (typeof cmds == 'string' || cmds.length == 0) {
			// report error message & play fail sound
			var error_str = '<p id="fail_msg">' + cmds + '</p>'
			$('.cmd_display').html(error_str);
			document.getElementById('fail').play();

		// commands are valid
		} else {
			// while running commands, disable play btn, enable reset btn
			$("#play_btn").prop("disabled",true);
			$("#reset_btn").prop("disabled",false);

			// print commands to output
			printCommands(cmds);

			// delay 300ms, run commands
			setTimeout(function (){
        		runCommands(cmds,0,false);
        	}, 300);
		}
	});

	// enable resetting (for when it is next checked)
	$('#reset_btn').click(function() {
		reset = true;
	});

	// attempt to run through the commands one-by-one
	$('#step_btn').click(function() {
		// read the commands
		cmds = readCommands();

		// stepCmd = -1 when commandstream hasn't started yet
		if (stepCmd == -1) {
			// makes sure commands are valid (not error message)
			if (typeof cmds == 'string') {
				// report error message / play sound
				var error_str = '<p id="fail_msg">' + cmds + '</p>'
				$('.cmd_display').html(error_str);
				document.getElementById('fail').play();

			} else {
				// print commands to output & run commands from start
				printCommands(cmds);
				setTimeout(function (){
	        		runCommands(cmds,0,true);
	        	}, 200);
			}

		// otherwise, run next command
		} else {
			runCommands(cmds,stepCmd,true);
		}
	});
});
