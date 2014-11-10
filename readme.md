## RodRego
### AT Fellows Project

#### About

RodRego is a simple register machine simulator illustrating the computational capabilities of the INC/DEB language model. The project was launched in 1986 at Tufts University by Prof. Daniel Dennett. The current simulator comes in the form of a desktop application. 

My project is to create a port for the simulator in JavaScript, preserving all the capabilities of the original desktop simulator in a new web application.

The current project can be found [here](http://ben-tanen.github.io/RodRego/).

For more information about the original project, [click here](http://sites.tufts.edu/rodrego/).

#### To Do

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
	- [ ] Pause Button
- [x] Implement printCommands()
	- [x] Basic Version
	- [x] Advanced Version
- [x] Implement readCommands()
	- [x] Command Parsing
	- [x] Check Individual Command (cmdFail)
	- [x] Check Command Stream (progression from 1 to 2 to 3...)
	- [x] In-line Commenting (ex: `1 inc 2 2 # comment`)
- [ ] Additional Features
	- [x] Variable Speed
	- [x] Load Standard Scripts
		- [x] Pre-set input (Addition, Subtraction, etc.)
		- [x] Repeated Script Input
	- [ ] Script Input
		- [ ] File Parsing
	- [ ] Saving Scripts (?)
	- [x] Sound Off Button
