export class Interpreter {
  constructor() {
    this.variables = {};
    this.constants = {};
  }

  interpret(ast) {
    this._executeBlock(ast.value.children);
  }

  _executeBlock(statements) {
    for (const statement of statements) {
      this._execute(statement);
    }
  }

  _execute(node) {
    switch (node.type) {
      case "Program":
        this._executeBlock(node.value.children);
        break;
      case "VariableDeclaration":
        this._executeVariableDeclaration(node);
        break;
      case "PrintStatement":
        this._executePrintStatement(node);
        break;
      case "ComparisonExpression":
        return this._evaluateComparison(node);
      case "ExpressionStatement":
        this._evaluate(node.value.expression);
        break;
      case "ConstantDeclaration":
        this._executeConstantDeclaration(node);
        break;
      case "IfStatement":
        this._executeIfStatement(node);
        break;
      case "ForEachLoop":
        this._executeForEachLoop(node);
        break;
      case "FunctionDeclaration":
        this._executeFunctionDeclaration(node);
        break;
      case "ConcurrencyBlock":
        this._executeBlock(node.value.children); // Simplified for single-thread execution
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  _executeVariableDeclaration(node) {
    const identifier = node.value.identifier;
    const value = this._evaluate(node.value.expression);
    this.variables[identifier] = value; // Store the variable in the interpreter's variable storage
  }

  _executePrintStatement(node) {
    const value = this._evaluate(node.value.expression);
    console.log(value);
  }

  _executeIfStatement(node) {
    const condition = this._evaluate(node.value.condition);
    if (condition) {
      this._executeBlock(node.value.thenBranch.children);
    } else if (node.value.elseBranch) {
      this._executeBlock(node.value.elseBranch.children);
    }
  }

  _executeConstantDeclaration(node) {
    const identifier = node.value.identifier;
    const value = this._evaluate(node.value.expression);

    if (this.constants.hasOwnProperty(identifier)) {
      throw new Error(`Cannot reassign constant: ${identifier}`);
    }

    this.constants[identifier] = value; // Store the constant in a separate storage
  }

  _executeForEachLoop(node) {
    const list = this.variables[node.value.list];
    for (const item of list) {
      this.variables[node.value.element] = item;
      this._executeBlock(node.value.body.children);
    }
  }

  _evaluateIdentifier(node) {
    const identifier = node.value;
    if (this.constants.hasOwnProperty(identifier)) {
      return this.constants[identifier];
    } else if (this.variables.hasOwnProperty(identifier)) {
      return this.variables[identifier];
    } else {
      throw new Error(`Undefined variable: ${identifier}`);
    }
  }

  _evaluateComparison(node) {
    const left = this._evaluate(node.value.left);
    const right = this._evaluate(node.value.right);

    switch (node.value.operator) {
      case "GREATER_THAN":
        return left > right;
      case "LESS_THAN":
        return left < right;
      case "EQUALS":
        return left === right;
      case "NOT_EQUALS":
        return left !== right;
      case "GREATER_THAN_EQUAL":
        return left >= right;
      case "LESS_THAN_EQUAL":
        return left <= right;
      default:
        throw new Error(`Unknown comparison operator: ${node.value.operator}`);
    }
  }

  _executeFunctionDeclaration(node) {
    // Store function in variables for later invocation
    this.variables[node.value.name] = node;
  }

  _evaluate(node) {
    if (!node) {
      throw new Error("Attempted to evaluate a null or undefined node");
    }
    switch (node.type) {
      case "Literal":
        return this._parseLiteral(node.value);
      case "BinaryExpression":
        return this._evaluateBinaryExpression(node);
      case "Identifier":
        return this._evaluateIdentifier(node);
      case "ComparisonExpression":
        return this._evaluateComparison(node);
      default:
        throw new Error(`Unknown node type in evaluation: ${node.type}`);
    }
  }

  _parseLiteral(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string" && !isNaN(value) && value.trim() !== "") {
      return Number(value);
    }
    return value;
  }

  _evaluateBinaryExpression(node) {
    const left = this._evaluate(node.value.left);
    const right = this._evaluate(node.value.right);
    switch (node.value.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
      default:
        throw new Error(`Unknown operator: ${node.value.operator}`);
    }
  }
}