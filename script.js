// Defining a Setting class to store the configurations, and vetting logic for settings
class Setting {
  // Configure static properties for defaults for dynamic logic (say if we ever decided to up the limit to 256)
  static default = {
    minLength: 8,
    maxLength: 128,
    toggle: false
  }
  static minLength = Setting.default.minLength;
  static maxLength = Setting.default.maxLength;

  // Initialise the instance properties
  constructor() {
    this.init();
  }

  init() {
    this._length = Setting.default.minLength;
    this._useUpperCase = Setting.default.toggle;
    this._useNumbers = Setting.default.toggle;
    this._useSymbols = Setting.default.toggle;
  }

  // Getters
  get length() {
    return this._length;
  }

  get useUpperCase() {
    return this._useUpperCase;
  }

  get useNumbers() {
    return this._useNumbers;
  }

  get useSymbols() {
    return this._useSymbols;
  }

  // Setters
  set length(value) {
    // Vet any values that are below minimum length, aren't numbers, or evaluate to Not a Number (NaN), which is - ironically - of type number
    if ( (value < Setting.minLength) || (typeof value !== 'number') || (value === NaN) ) {
      this._length = Setting.minLength;
      return;
    }

    // Catch all for cases where it's too large
    if ( value > Setting.maxLength ) {
      this._length = Setting.maxLength;
      return;
    }

    // By this point all invalidating criteria should be accounted for
    this._length = value;
    return;
  }

  set useUpperCase(value) {
    if (Setting.checkBool(value) !== null) {
      this._useUpperCase = value;
    }
  }

  set useNumbers(value) {
    if (Setting.checkBool(value) !== null) {
      this._useNumbers = value;
    }
  }

  set useSymbols(value) {
    if (Setting.checkBool(value) !== null) {
      this._useSymbols = value;
    }
  }

  static checkBool(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    // Returns null if it isn't a boolean so we know to toss it
    return null;
  }

  static isEnabled(parameter) {
    // Drop an undefined if the value isn't a boolean
    if (typeof parameter !== 'boolean') {
      return undefined;
    }
    // Return a 'yes/no' response for use in the configure method.
    if (parameter) {
      return 'yes';
    }
    return 'no';
  }

  configure() {
    // Show defaults and ask if they would like to change them - Asks mmore questions if they opt in
    if (window.confirm(`These are your current settings:\n
    Password Length: ${this.length}
    Use Uppercase: ${Setting.isEnabled(this.useUpperCase)}
    Use Numbers: ${Setting.isEnabled(this.useNumbers)}
    Use Symbols: ${Setting.isEnabled(this.useSymbols)}\n
    Do you want to change these settings?
    [Cancel (No) | OK (Yes)]`)) {

      // Ask for the number of characters they want
      this.length = Number.parseInt(window.prompt(`How long do you want your password to be?\n
      Shortest length (Default): ${Setting.minLength}
      Longest Length: ${Setting.maxLength}`, Setting.minLength));

      // Ask if they want uppercase characters
      this.useUpperCase = window.confirm(`Do you want to include upper-case characters? (ABC)\n
      [Cancel (No) | OK (Yes)]`);

      // Ask if they want numbers
      this.useNumbers = window.confirm(`Do you want to include numbers? (123)\n
      [Cancel (No) | OK (Yes)]`);

      // Ask if they want special characters
      this.useSymbols = window.confirm(`Do you want to include symbols? (!@#$%^&*)\n
      [Cancel (No) | OK (Yes)]`);
    }

  }
}

function generatePassword(settings) {
  const rollLetter = (useCaps = false, forceUpper = false) => {
    // Roll an ASCII hex value between 0x0061 (a) and 0x007A (z)
    const keyCode = Math.ceil(Math.random() * (0x007A - 0x0061) + 0x0061);

    // Gate the generation of an uppercase character through a one-off random gate
    // Will either return a falsy (0) or truthy (1) value, so 50-50 chance of it executing
    // forceUpper overrides this behaviour to guarantee an uppercase letter
    if ((useCaps && Math.floor(Math.random() * 2)) || forceUpper) {
      // Return the keycode from within its corresponding uppercase range (0x0041 - 0x005A)
      return String.fromCodePoint(keyCode - 0x0020);
    }
    // Return the keycode from what was originally rolled
    return String.fromCodePoint(keyCode);
  }

  // Generates a number from 0 to 9
  const rollNumber = () => {
    return Math.floor(Math.random() * 10);
  }

  // Generates a symbol from a limited selection
  const rollSymbol = () => {
    // Opting to use a limited character set for higher chances of being accepted by sites
    const specialChars = ['!', '@',  '#', '$', '%', '^', '&', '*'];
    return specialChars[Math.floor(Math.random() * specialChars.length)];
  }

  const output = []; // The array that will store our fully generated password

  // These flags will help us determine if any opt-in settings weren't generated at all
  const charFlags = {
    upperCase: false,
    numbers: false,
    symbols: false
  };

  for (let i = 0; i < settings.length; i++) {
    let char; // Create an empty vessel for character setting

    // Iterate until we have a character to work with
    while (!char) {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          // Choose a letter
          if (settings.useUpperCase) {
            charFlags.upperCase = true;
          }
          char = rollLetter(settings.useUpperCase);
          break;
        case 1:
          if (settings.useNumbers) {
            // Choose a number
            char = rollNumber();
            charFlags.numbers = true;
          }
          break;
        case 2:
          if (settings.useSymbols) {
            // Choose a symbol
            char = rollSymbol(); 
            charFlags.symbols = true;
          }
          break;
      }
    }

    // Add the value we've obtained to the array
    output.push(char);
  }

  // If any of the required options weren't generated, then we'll randomly substitute one of the characters with it
  if (settings.useUpperCase && !charFlags.upperCase) {
    output[Math.floor(Math.random() * output.length)] = rollLetter(true, true);
  }

  if (settings.useNumber && !charFlags.numbers) {
    output[Math.floor(Math.random() * output.length)] = rollNumber();
  }

  if (settings.useSymbols && !charFlags.symbols) {
    output[Math.floor(Math.random() * output.length)] = rollSymbol();
  }

  // Return the full array joined together
  return output.join('');
}

  // Initialise an settings object with properties representing the options selected
  const settings = new Setting;

// Assignment Code
var generateBtn = document.querySelector("#generate"); // Assigning the button in form to variable

// Write password to the #password input
function writePassword() {
  settings.configure(); // Invoke config method before running the generator
  var password = generatePassword(settings); // Calling non-existent function called generatePassword()
  var passwordText = document.querySelector("#password"); // Assigning output area to the variable

  passwordText.value = password; // Writing the password to the output area using said variable.

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword); // Establishing event listener to trigger main code block