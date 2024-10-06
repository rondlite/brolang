class ASTNode {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.children = [];
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    const root = new ASTNode("Program", null);
    while (this.position < this.tokens.length) {
      root.children.push(this._parseStatement());
    }
    return root;
  }

  _parseStatement() {
    const token = this.tokens[this.position];
    if (token.type === "IDENTIFIER") {
      return this._parseExpression();
    }
    throw new Error(`Unexpected token: ${token.type}`);
  }

  _parseExpression() {
    const token = this.tokens[this.position++];
    const node = new ASTNode("Expression", token.value);
    if (
      this.tokens[this.position] &&
      this.tokens[this.position].type === "PLUS"
    ) {
      this.position++;
      node.children.push(this._parseExpression());
    }
    return node;
  }
}
