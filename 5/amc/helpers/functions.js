// CONVERTS UNIQUE KEY STRING TO INTEGER REP, CONCATENATES, MULTIPLIES BY N ====
export function get_unique_id(key, n) {

  string_of_ints = [];
  for (let i=0; i < key.length; i++) {
      string_of_ints += key[i].charCodeAt(0).toString();
  }
  return parseInt(string_of_ints) * n;
}

// GIVEN A MOVEMENT KEY, RETURNS ENTIRE JSON OBJECT OF SAID MOVEMENT ===========
export function get_movement_info_from_key(key) {
  for (let i=0; i<global.movementMap.length; i++) {
    if (key === global.movementMap[i].key) {
      return global.movementMap[i];
    }
  }
}

// RETURNS MULTI-LINE STRING REP OF LIST OF WORDS WITH LEFT SPACING = TAB ======
export function print_list(word_list, tab) {
  var string = "\n";
  for (var i=0; i < word_list.length-1; i++) {
    string += tab + word_list[i] + "\n";
  }
  string += tab + word_list[word_list.length-1];

  return string;
}
