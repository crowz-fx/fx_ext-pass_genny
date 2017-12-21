/**
	author: Lui Crowie 
	site: crowzfx.co.uk
**/

var lowerAlpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var upperAlpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var allowedSymbols = ["!", "#", "@", "%", "&", "_", ";", "+"];

// adds ability for user to copy the password to their clipboard
//     without having to ctrl+c it
function copyToClipboard() {
	var copyArea = document.querySelector('#generatedPass');
 	copyArea.select();

	try {
		var boolReturn = document.execCommand('copy');
		var value = boolReturn ? 'successful' : 'unsuccessful';
		console.log('Copy state return was [' + value + ']');
	} catch (err) {
		console.log('FX - Pass Genny was unable to copy the value!');
	}

	window.getSelection().removeAllRanges();
}

// pulls in all of the options from the html and passes them into the
//     generate password function
function getOptions() {
	var options = [];
	options.push(document.getElementById("includeSymbols").checked);
	options.push(document.getElementById("lengthRange").value);
	options.push(document.getElementById("mixedCase").checked);

	return options;
}

// function to randomly generate a password using the options 
//     selected by the user
function generatePassword() {
	// 1 = useSymbols, 2 = length, 3 = useMixedCase
	var options = getOptions();
	var finalStr = "";

	// depending if the user chose to include symbols then create an
	//     array of arrays to use Math.random() twice
	if(options[0] && options[2]) {
		var arraysCon = [lowerAlpha, upperAlpha, numbers, allowedSymbols];
	} else if(options[0] && !options[2]) {
		var arraysCon = [lowerAlpha, allowedSymbols, numbers];
	} else if(options[2] && !options[0]) {
		var arraysCon = [lowerAlpha, upperAlpha, numbers];
	} else {
		// default back to just lowerAlpha and numbers
		var arraysCon = [lowerAlpha, numbers];
	}
	
	// loop through the length for what the user supplied
	for(var i = 0; i < options[1]; i++) {
		// first random is to choose between alphaUpper, alphaLower, number 
		//     or symbols (if used selected it)
		var firstNum = Math.floor(Math.random() * arraysCon.length);
		finalStr = finalStr + (arraysCon[firstNum][Math.floor(Math.random() * arraysCon[firstNum].length)]);
	}

	document.getElementById("generatedPass").innerHTML = finalStr;
}

// access the Chrome tabs api to open link in new tab
function openCrowzFX() {
	var newURL = "http://www.crowzfx.co.uk/";
	chrome.tabs.create({ url: newURL });
}

// used to update the length value of what the slider is currently on
function updateLenghtValue() {
	console.log(document.getElementById("lengthRange").value);
	document.getElementById("lengthValue").innerHTML = document.getElementById("lengthRange").value;
}

// add event listeners after the DOM has loaded and all resources are in place
window.onload=function(){
	document.getElementById("link").addEventListener("click", openCrowzFX);
	document.getElementById("copyToClip").addEventListener("click", copyToClipboard);
	document.getElementById("generatePassword").addEventListener("click", generatePassword);
	document.getElementById("lengthRange").addEventListener("change", updateLenghtValue);
}