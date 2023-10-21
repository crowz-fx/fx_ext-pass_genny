/** 
 * author: Lui Crowie 
 **/

var defaultPasswordValue = "........";
var lowerAlpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var upperAlpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var allowedSymbols = ["!", "#", "@", "%", "_", "+"];

// adds ability for user to copy the password to their clipboard
//   without having to ctrl+c it
const copyToClipboard = () => {
	const value = document.querySelector("#generatedPass").textContent;
	if (value !== "........") {
		navigator.clipboard.writeText(document.querySelector("#generatedPass").textContent);
	}
};

// pulls in all of the options from the html and passes them into the
//     generate password function
const getOptions = () => {
	var options = [];
	options.push(document.getElementById("lengthRange").value);
	options.push(document.getElementById("includeSymbols").checked);
	options.push(document.getElementById("mixedCase").checked);
	options.push(document.getElementById("similarCharacters").checked);

	return options;
}

const getRandom = (length) => {
	return Math.floor(Math.random() * length);
}

// function to randomly generate a password using the options 
//   selected by the user
const generatePassword = () => {
	// 0 = length, 1 = useSymbols, 2 = useMixedCase, 3 = similarCharacters
	let options = getOptions();
	let finalPassword = "";

	// depending if the user chose to include symbols then create an
	//   array of arrays to use Math.random() twice
	let allowedCharacters = [...lowerAlpha, ...numbers];

	if (options[1]) {
		allowedCharacters = [...allowedCharacters, ...allowedSymbols];
	}

	if (options[2]) {
		allowedCharacters = [...allowedCharacters, ...upperAlpha];
	}

	// loop through the length for what the user supplied
	for (var i = 0; i < options[0]; i++) {
		let newCharacter = allowedCharacters[getRandom(allowedCharacters.length)];
		if (options[3]) {
			while (newCharacter == finalPassword[i - 1]) {
				newCharacter = allowedCharacters[getRandom(allowedCharacters.length)];
			}
		}

		finalPassword += newCharacter;
	}

	document.getElementById("generatedPass").innerHTML = finalPassword;
}

// access the Chrome tabs api to open link in new tab
// function openNewTab(url) {
// 	chrome.tabs.create({ url: url });
// }

// used to update the length value of what the slider is currently on
const updateLengthValue = () => {
	document.getElementById("lengthValue").innerHTML = "Length [" + document.getElementById("lengthRange").value + "]";
}

// add event listeners after the DOM has loaded and all resources are in place
document.getElementById("copyToClip").addEventListener("click", copyToClipboard);
document.getElementById("generatePassword").addEventListener("click", generatePassword);
document.getElementById("lengthRange").addEventListener("change", () => {
	updateLengthValue();
	generatePassword();
});

for (const element of ["includeSymbols", "mixedCase", "similarCharacters"]) {
	document.getElementById(element).addEventListener("change", () => {
		generatePassword();
	});
}

document.getElementById("saveDefaults").addEventListener("click", () => {
	const data = {
		includeSymbols: document.getElementById("includeSymbols").checked,
		mixedCase: document.getElementById("mixedCase").checked,
		similarCharacters: document.getElementById("similarCharacters").checked,
	};
	chrome.runtime.sendMessage({ event: 'save', data });
});


document.getElementById("resetDefaults").addEventListener("click", () => {
	chrome.runtime.sendMessage({ event: 'reset' });
	for (const element of ["includeSymbols", "mixedCase", "similarCharacters"]) {
		document.getElementById(element).checked = false;
	}
});

chrome.storage.local.get(["includeSymbols", "mixedCase", "similarCharacters"], (result) => {
	const { includeSymbols, mixedCase, similarCharacters } = result;
	
	if(includeSymbols) {
		document.getElementById("includeSymbols").checked = includeSymbols;
	}
	if(mixedCase) {
		document.getElementById("mixedCase").checked = mixedCase;
	}
	if(similarCharacters) {
		document.getElementById("similarCharacters").checked = similarCharacters;
	}
});

generatePassword()
