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
  Constructor() {
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

  set length(value) {
    // Vet any values that are below minimum length, aren't numbers, or evaluate to Not a Number (NaN), which is - ironically - of type number
    if ( (value < Setting.minLength) || (typeof value !== 'number') || (value === NaN) ) {
      return Setting.minLength;
    }

    // Catch all for cases where it's too large
    if ( value > Setting.maxLength ) {
      return Setting.maxLength;
    }

    // By this point all invalidating criteria should be accounted for
    return value;
  }

  set useUpperCase(value) {
    if (Setting.checkBool(value) !== null) {
      this._setUpperCase = value;
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
    if (typeof parameter !== 'boolean') {
      return undefined;
    }
    if (parameter) {
      return 'yes';
    }
    return 'no';
  }

  configure() {
    // Show defaults and ask if they would like to use them
    if (window.confirm(`These are your current settings:\n
    Password Length: ${this.length}
    Use Uppercase: ${Setting.isEnabled(this.useUpperCase)}
    Use Numbers: ${Setting.isEnabled(this.useNumbers)}
    Use Symbols: ${Setting.isEnabled(this.useSymbols)}\n
    Do you want to change these settings?`)) {
      // Ask for the number of characters they want
      
      // Ask if they want uppercase characters

      // Ask if they want numbers
    
      // Ask if they want special characters

    }


  }
}

// Assignment Code
var generateBtn = document.querySelector("#generate"); // Assigning the button in form to variable

// Initialise an settings object with properties representing the options selected
const settings = new Setting;

// Write password to the #password input
function writePassword() {
  settings.configure(); // Invoke config method before running the generator
  var password = generatePassword(settings); // Calling non-existent function called generatePassword()
  var passwordText = document.querySelector("#password"); // Assigning output area to the variable

  passwordText.value = password; // Writing the password to the output area using said variable.

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword); // Establishing event listener to trigger main code block

// Planning
// Add a function to prompt the user for input and then write the config to the settings object
// Add validator functions/methods to ensure parameters are valid
// Add generatePassword using params fed from the settings object (maybe we should use class syntax?)h