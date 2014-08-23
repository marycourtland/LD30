var keyboard = {
  pressed_keys: [],
  game: null,

  init: function (game) {
    this.game = game;

    window.addEventListener("keydown", function(event) {
      key = keyboard.getKey(event);
      if (keyboard.pressed_keys.indexOf(key) === -1) {
        keyboard.pressed_keys.push(key);
      }
    });
    
    window.addEventListener("keyup", function(event) {
      key = keyboard.getKey(event);
      if (keyboard.pressed_keys.indexOf(key) !== -1) {
        _.filter(keyboard.pressed_keys, function(k) { key !== key })
      }
    });
  },

  isKeyPressed: function(key) {
    return this.pressed_keys.indexOf(key) != -1;
  },

  getKey: function(event) {
    return this.codes[(event.fake || window.event ? event.keyCode: event.which)];
  },

  // Commonly used sets of keys
  adws: {
    "A": "left",
    "D": "right",
    "W": "up",
    "S": "down"
  },

  lrud: { 
    "LEFT": "left",
    "RIGHT": "right",
    "UP": "up",
    "DOWN": "down"
  },

  // Commonly used keycodes
  codes: {}
}

keyboard.codes[16] = "SHIFT";
keyboard.codes[17] = "CTRL";
keyboard.codes[18] = "ALT";
keyboard.codes[37] = "LEFT";
keyboard.codes[39] = "RIGHT";
keyboard.codes[38] = "UP";
keyboard.codes[40] = "DOWN";
keyboard.codes[32] = "SPACE";
keyboard.codes[13] = "ENTER";
keyboard.codes[189] = "DASH";
keyboard.codes[187] = "EQUALS";
keyboard.codes[107] = "PLUS";
keyboard.codes[109] = "MINUS";
keyboard.codes[65] = "A";
keyboard.codes[66] = "B";
keyboard.codes[67] = "C";
keyboard.codes[68] = "D";
keyboard.codes[69] = "E";
keyboard.codes[70] = "F";
keyboard.codes[71] = "G";
keyboard.codes[72] = "H";
keyboard.codes[73] = "I";
keyboard.codes[74] = "J";
keyboard.codes[75] = "K";
keyboard.codes[76] = "L";
keyboard.codes[77] = "M";
keyboard.codes[78] = "N";
keyboard.codes[79] = "O";
keyboard.codes[80] = "P";
keyboard.codes[81] = "Q";
keyboard.codes[82] = "R";
keyboard.codes[83] = "S";
keyboard.codes[84] = "T";
keyboard.codes[85] = "U";
keyboard.codes[86] = "V";
keyboard.codes[87] = "W";
keyboard.codes[88] = "X";
keyboard.codes[89] = "Y";
keyboard.codes[90] = "Z";
keyboard.codes[188] = "COMMA";
keyboard.codes[190] = "PERIOD";
keyboard.codes[191] = "SLASH";
keyboard.codes[220] = "BSLASH";
keyboard.codes[219] = "RBRACK";
keyboard.codes[221] = "LBRACK";
keyboard.codes[222] = "APOSTOPHE";
keyboard.codes[186] = "SEMICOLON";