## RodRego
### AT Fellows Project

#### About

RodRego is a simple register machine simulator illustrating the computational capabilities of the INC/DEB language model. The project was launched in 1986 at Tufts University by Prof. Daniel Dennett. The current simulator comes in the form of a desktop application. 

My project is to create a port for the simulator in JavaScript, preserving all the capabilities of the original desktop simulator in a new web application.

The current project can be found [here](http://ben-tanen.github.io/RodRego/).

For more information about the original project, [click here](http://sites.tufts.edu/rodrego/).

#### To Do

Round 2:
- [x] Register Highlighting for Active Box
- [x] Add Sound for INC/DEB buttons
- [x] Add Clickable Dots (able for count to jump to corresponding value)
- [ ] Fix Safari Sound Problem
- [ ] Adjust Options Layout to work with jBox Modal view
	- [ ] Improve layout of options (make more clear)
	- [ ] Give options visual queues / icons
	- [ ] Auto close modal if example script selected
- [ ] Add "By Dan Dennett etc." to page

Round 1:
- [x] Improve UI/UX
	- [x] Overall Aesthetics 
	- [x] Update Buttons
	- [x] Improve Command Printing
	- [x] Add Box "lights"
- [x] Implement runCommands()
	- [x] Working Counters
	- [x] Working Sound
	- [x] Working Command Highlighting
	- [x] Infinite Loop Handling
	- [x] Step Button
- [x] Implement printCommands()
	- [x] Basic Version
	- [x] Advanced Version
- [x] Implement readCommands()
	- [x] Command Parsing
	- [x] Check Individual Command (cmdFail)
	- [x] Check Command Stream (progression from 1 to 2 to 3...)
	- [x] In-line Commenting (ex: `1 inc 2 2 # comment`)
- [x] Additional Features
	- [x] Number / Bean Count
		- [x] Add Number Counting
		- [x] Add Automatic Toggle (> 15)
		- [x] Add Toggle Option
	- [x] "How To"/"About" Page
		- [x] Implement Code
		- [x] Fix Styling
		- [x] Finalize Wording
	- [x] Variable Speed
	- [x] Load Standard Scripts
		- [x] Pre-set input (Addition, Subtraction, etc.)
		- [x] Add all scripts 
		- [x] Repeated Script Input
	- [x] Sound Off Button


