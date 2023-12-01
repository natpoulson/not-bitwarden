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
    this.useUpperCase = Setting.default.toggle;
    this.useNumbers = Setting.default.toggle;
    this.useSymbols = Setting.default.toggle;
  }

  // Getter and Setter for the length property
  get length() {
    return this._length;
  }

  set length( value ) {
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
}

// Assignment Code
var generateBtn = document.querySelector("#generate"); // Assigning the button in form to variable

// Initialise an settings object with properties representing the options selected
const settings = {
  length: 8,
  useUpperCase: false,
  useNumbers: false,
  useSymbols: false
};

// Write password to the #password input
function writePassword() {
  var password = generatePassword(); // Calling non-existent function called generatePassword()
  var passwordText = document.querySelector("#password"); // Assigning output area to the variable

  passwordText.value = password; // Writing the password to the output area using said variable.

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword); // Establishing event listener to trigger main code block

// Planning
// Add a function to prompt the user for input and then write the config to the settings object
// Add validator functions/methods to ensure parameters are valid
// Add generatePassword using params fed from the settings object (maybe we should use class syntax?)