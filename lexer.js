export class Lexer {
    constructor(input) {
      this.input = input;
      this.position = 0;
      this.tokens = [];
    }
  
    tokenize() {
      while (this.position < this.input.length) {
        let char = this.input[this.position];
  
        if (/\s/.test(char)) {
          this.position++;
          continue;
        }
  
        switch (char) {
          case ';':
            this._addToken('SEMICOLON', char);
            break;
          case '+':
            this._addToken('PLUS', char);
            break;
          default:
            if (/[a-zA-Z]/.test(char)) {
              this.tokens.push(this._readIdentifier());
            } else if (/\d/.test(char)) {
              this.tokens.push(this._readNumber());
            } else {
              throw new Error(`Unexpected character: ${char}`);
            }
        }
      }
      return this.tokens;
    }
  
    _addToken(type, value) {
      this.tokens.push({ type, value });
      this.position++;
    }
  
    _readIdentifier() {
      let start = this.position;
      while (/[a-zA-Z]/.test(this.input[this.position])) {
        this.position++;
      }
      let value = this.input.slice(start, this.position);
      return { type: 'IDENTIFIER', value };
    }
  
    _readNumber() {
      let start = this.position;
      while (/\d/.test(this.input[this.position])) {
        this.position++;
      }
      let value = this.input.slice(start, this.position);
      return { type: 'NUMBER', value };
    }
  }
  