class ASTNode {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    const statements = [];
    while (!this._isAtEnd()) {
      statements.push(this._parseStatement());
    }
    return new ASTNode("Program", { children: statements });
  }

  _parseStatement() {
    if (this._match("KEYWORD", "yo")) {
      return this._parseVariableDeclaration();
    } else if (this._match("KEYWORD", "spill")) {
      return this._parsePrintStatement();
    } else if (this._match("KEYWORD", "if")) {
      return this._parseIfStatement();
    } else {
      return this._parseExpressionStatement();
    }
  }

  _parseIfStatement() {
    this._consume("LPAREN"); // Consume '('
    const condition = this._parseExpression(); // Parse the condition expression
    this._consume("RPAREN"); // Consume ')'
    const thenBranch = this._parseBlock(); // Parse the 'then' block

    let elseBranch = null;
    if (this._match("KEYWORD", "else")) {
      elseBranch = this._parseBlock(); // Parse the 'else' block if present
    }

    return new ASTNode("IfStatement", {
      condition: condition,
      thenBranch: thenBranch,
      elseBranch: elseBranch
    });
  }

  _parseBlock() {
    this._consume("LBRACE"); // Consume '{'
    const statements = [];
    while (!this._check("RBRACE") && !this._isAtEnd()) {
      statements.push(this._parseStatement());
    }
    this._consume("RBRACE"); // Consume '}'
    return new ASTNode("Block", { children: statements });
  }

  _parseVariableDeclaration() {
    this._consume("KEYWORD", "yo");
    const identifier = this._consume("IDENTIFIER").value;
    this._consume("EQUALS");
    const expression = this._parseExpression();
    this._consume("SEMICOLON");
    return new ASTNode("VariableDeclaration", { identifier, expression });
  }

  _parsePrintStatement() {
    this._consume("KEYWORD", "spill");
    const expression = this._parseExpression();
    this._consume("SEMICOLON");
    return new ASTNode("PrintStatement", { expression });
  }

  _parseExpressionStatement() {
    const expression = this._parseExpression();
    this._consume("SEMICOLON");
    return new ASTNode("ExpressionStatement", { expression });
  }

  _parseExpression() {
    return this._parseComparison();
  }

  _parseComparison() {
    let left = this._parsePrimary();
    while (this._match("GREATER_THAN") || this._match("LESS_THAN") || this._match("EQUALS") || this._match("NOT_EQUALS") || this._match("GREATER_THAN_EQUAL") || this._match("LESS_THAN_EQUAL")) {
      const operator = this.tokens[this.position - 1].type;
      const right = this._parsePrimary();
      left = new ASTNode("ComparisonExpression", { left, operator, right });
    }
    return left;
  }

  _parsePrimary() {
    if (this._match("NUMBER")) {
      return new ASTNode("Literal", { value: Number(this.tokens[this.position - 1].value) });
    } else if (this._match("STRING")) {
      return new ASTNode("Literal", { value: this.tokens[this.position - 1].value });
    } else if (this._match("IDENTIFIER")) {
      return new ASTNode("Identifier", { value: this.tokens[this.position - 1].value });
    } else {
      throw new Error(`Unexpected token: ${this.tokens[this.position].type}`);
    }
  }

  _consume(type, value) {
    const token = this.tokens[this.position];
    if (token.type === type && (value === undefined || token.value === value)) {
      this.position++;
      return token;
    } else {
      throw new Error(`Expected token type ${type} with value ${value}, but got ${token.type} with value ${token.value}`);
    }
  }

  _match(type, value) {
    const token = this.tokens[this.position];
    if (token.type === type && (value === undefined || token.value === value)) {
      this.position++;
      return true;
    }
    return false;
  }

  _check(type) {
    if (this._isAtEnd()) return false;
    return this.tokens[this.position].type === type;
  }

  _isAtEnd() {
    return this.position >= this.tokens.length;
  }
}