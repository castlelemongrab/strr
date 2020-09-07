// ✊🏿

/**
  A static class for string utility functions. This functionality
  is likely available in other modules, but is reimplemented here
  to reduce external dependencies and complexity of maintainership.
  Do not use this any of this along performance-critical paths.
**/
Strr = {

  /**
     Return an array containing elements of `_str` that were delimited
     by `_delimeter`, while respecting the escape `character `_escape`.
     Javacript me: "use a regex". Actual programmer: "implement the DFA".
     Programmer me: "look, you can write C in any language you want".
     @arg _str {string} - The string to parse
     @arg _delimiter {string} - A single-character delimiter string
     @arg _escape {string} - A single escape character for delimiters
     @arg _is_strict {boolean} - Don't ignore trailing escape sequences
     @arg _limit {number} - Return the Nth and subsequent components as-is
     @returns {Array}
  */
  split_delimited: (_str, _delimiter, _escape, _is_strict, _limit) => {

    let rv = [];
    let state = 0;
    var i = 0, j = 0, len = 0;
    let limit = (_limit || NaN);

    let esc = (_escape == null ? '\\' : _escape);
    let delim = (_delimiter == null ? '=' : _delimiter);

    for (j = 0, len = _str.length; j < len; ++j) {
      switch (state) {
        case 0: /* New string */
          if (i + 1 >= limit) {
            rv[i] = _str.slice(j); state = 3; /* Terminal */
            break;
          }
          rv[i] = ''; state = 1;
          /* Fallthrough */
        case 1: /* In string */
          switch (_str[j]) {
            case esc: { state = 2; break; }
            case delim: { state = 0; ++i; break; }
            default: { Strr._emit(rv, i, _str[j]); break; }
          }
          break;
        case 2: /* Escaped literal */
          Strr._emit(rv, i, _str[j]);
          state = 1;
          break;
      }
    }

    if (state === 0 && len !== 0) {
      rv.push('');
    } else if (state === 2 && _is_strict) {
      throw new Error('Trailing delimiter found in strict mode');
    }

    for (var i = 0, len = rv.length; i < len; ++i) {
      rv[i] = rv[i].trim();
    }

    return rv;
  },

  /**
    Append _chr to string array _rv element _i. For most runtimes,
    `concat` is fast due to non-linear preallocation of string space.
  */
  _emit: (_rv, _i, _chr) => {

    return (_rv[_i] += _chr);
  }
};

/* Export */
module.exports = Strr;

