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
    console.log(
      `Parsing statement at position ${this.position}: ${
        token ? token.type : "EOF"
      }`
    );

    switch (token.type) {
      case "KEYWORD":
        return this._parseKeywordStatement();
      case "IDENTIFIER":
        return this._parseExpressionStatement();
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }
  _parseIfStatement() {
    this._consume("KEYWORD", "if"); // Consume 'if'
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
    while (!this._check("RBRACE")) {
      statements.push(this._parseStatement());
    }
    this._consume("RBRACE"); // Consume '}'
    return new ASTNode("Block", statements);
  }

  _parseKeywordStatement() {
    const token = this.tokens[this.position++];
    let statementNode;

    switch (token.value) {
      case "yo":
        statementNode = this._parseVariableDeclaration();
        break;
      case "brofunc":
        statementNode = this._parseFunctionDeclaration();
        break;
      case "spill":
        statementNode = this._parsePrintStatement();
        break;
      case "if":
        statementNode = this._parseIfStatement();
        break;
      case "forEvery":
        statementNode = this._parseForEachLoop();
        break;
      case "squadGoals":
        statementNode = this._parseConcurrencyBlock();
        break;
      default:
        throw new Error(`Unexpected keyword: ${token.value}`);
    }

    this._consume("SEMICOLON");
    return statementNode;
  }

  _parseVariableDeclaration() {
    const identifierToken = this.tokens[this.position++];
    this._consume("EQUALS");
    const expressionNode = this._parseExpression();
    return new ASTNode("VariableDeclaration", {
      identifier: identifierToken.value,
      expression: expressionNode
    });
  }

  _parseFunctionDeclaration() {
    const nameToken = this.tokens[this.position++];
    const params = this._parseParameters();
    const body = this._parseBlock();
    return new ASTNode("FunctionDeclaration", {
      name: nameToken.value,
      parameters: params,
      body: body
    });
  }
  _parsePrintStatement() {
    const expressionNode = this._parseExpression();
    if (!expressionNode) {
      throw new Error("Failed to parse expression for spill statement");
    }
    return new ASTNode("PrintStatement", { expression: expressionNode });
  }

  _parseForEachLoop() {
    const elementToken = this.tokens[this.position++];
    this._consume("KEYWORD", "in");
    const listToken = this.tokens[this.position++];
    const body = this._parseBlock();
    return new ASTNode("ForEachLoop", {
      element: elementToken.value,
      list: listToken.value,
      body: body
    });
  }

  _parseConcurrencyBlock() {
    const body = this._parseBlock();
    return new ASTNode("ConcurrencyBlock", body);
  }

  _parseExpressionStatement() {
    const expressionNode = this._parseExpression();
    this._consume("SEMICOLON");
    return new ASTNode("ExpressionStatement", expressionNode);
  }
  _parseExpression() {
    return this._parseAdditionSubtraction();
  }
  _parsePrimary() {
    const token = this.tokens[this.position];
    switch (token.type) {
      case "LPAREN":
        this.position++;
        const expression = this._parseExpression();
        this._consume("RPAREN");
        return expression;
      case "IDENTIFIER":
        this.position++;
        return new ASTNode("Identifier", token.value);
      case "NUMBER":
      case "STRING":
        this.position++;
        return new ASTNode("Literal", token.value);
      case "BOOLEAN":
        this.position++;
        return new ASTNode("Literal", token.value); // Handle BOOLEAN tokens
      default:
        throw new Error(`Unexpected token in expression: ${token.type}`);
    }
  }

  _parseAdditionSubtraction() {
    let left = this._parsePrimary();

    while (this._match("PLUS") || this._match("MINUS")) {
      const operatorToken = this.tokens[this.position++];
      const right = this._parsePrimary();
      left = new ASTNode("BinaryExpression", {
        operator: operatorToken.value,
        left: left,
        right: right
      });
    }

    return left;
  }

  _parseParameters() {
    const params = [];
    this._consume("LPAREN");
    while (!this._check("RPAREN")) {
      const paramToken = this.tokens[this.position++];
      params.push(paramToken.value);
      if (!this._check("RPAREN")) {
        this._consume("COMMA");
      }
    }
    this._consume("RPAREN");
    return params;
  }

  _parseBlock() {
    this._consume("LBRACE");
    const statements = [];
    while (!this._check("RBRACE")) {
      statements.push(this._parseStatement());
    }
    this._consume("RBRACE");
    return new ASTNode("Block", statements);
  }
  _consume(expectedType, expectedValue = null) {
    if (this.position >= this.tokens.length) {
      throw new Error(
        `Unexpected end of input, expected token type ${expectedType}`
      );
    }

    const token = this.tokens[this.position];
    if (
      token.type !== expectedType ||
      (expectedValue !== null && token.value !== expectedValue)
    ) {
      throw new Error(
        `Expected token type ${expectedType} but found ${token.type}`
      );
    }
    this.position++;
  }

  _check(type) {
    if (this.position >= this.tokens.length) return false;
    return this.tokens[this.position].type === type;
  }

  _match(type, value) {
    if (this._check(type) && this.tokens[this.position].value === value) {
      this.position++;
      return true;
    }
    return false;
  }
}
