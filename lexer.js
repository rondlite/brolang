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
        case ";":
          this._addToken("SEMICOLON", char);
          break;
        case "+":
          this._addToken("PLUS", char);
          break;
        case "-":
          this._addToken("MINUS", char);
          break;
        case "*":
          this._addToken("MULTIPLY", char);
          break;
        case "/":
          this._addToken("DIVIDE", char);
          break;
        case "%":
          this._addToken("MODULO", char);
          break;
        case "=":
          this._addToken("EQUALS", char);
          break;
        case ">":
          this._addToken("GREATER_THAN", char);
          break;
        case "<":
          this._addToken("LESS_THAN", char);
          break;
        case "{":
          this._addToken("LBRACE", char);
          break;
        case "}":
          this._addToken("RBRACE", char);
          break;
        case "(":
          this._addToken("LPAREN", char);
          break;
        case ")":
          this._addToken("RPAREN", char);
          break;
        case "[":
          this._addToken("LBRACKET", char);
          break;
        case "]":
          this._addToken("RBRACKET", char);
          break;
        case ",":
          this._addToken("COMMA", char);
          break;
        case '"':
          this.tokens.push(this._readString());
          break;
        default:
          if (/[a-zA-Z]/.test(char)) {
            this.tokens.push(this._readIdentifierOrKeyword());
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

  _readIdentifierOrKeyword() {
    let start = this.position;
    while (/[a-zA-Z]/.test(this.input[this.position])) {
      this.position++;
    }

    let value = this.input.slice(start, this.position);

    // Check specifically for boolean literals
    if (value === "dope") {
      return { type: "BOOLEAN", value: true };
    } else if (value === "nope") {
      return { type: "BOOLEAN", value: false };
    }

    const keywords = [
      "yo",
      "brofunc",
      "bounce",
      "spill",
      "if",
      "else",
      "forEvery",
      "squadGoals",
      "nocap"
    ];
    const type = keywords.includes(value) ? "KEYWORD" : "IDENTIFIER";
    return { type, value };
  }

  _readNumber() {
    let start = this.position;
    while (/\d/.test(this.input[this.position])) {
      this.position++;
    }
    let value = this.input.slice(start, this.position);
    return { type: "NUMBER", value };
  }

  _readString() {
    let start = ++this.position; // Skip the opening quote
    while (this.input[this.position] !== '"') {
      this.position++;
    }
    let value = this.input.slice(start, this.position);
    this.position++; // Skip the closing quote
    return { type: "STRING", value };
  }
}
