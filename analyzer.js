export class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
    this.constants = {};
  }

  analyze() {
    this._checkNode(this.ast);
  }

  _checkNode(node) {
    if (node.type === "Program") {
      node.children.forEach((child) => this._checkNode(child));
    } else if (node.type === "ConstantDeclaration") {
      this._defineConstant(node.value.identifier, node.value.expression);
    } else if (node.type === "Expression") {
      // Example check: ensure identifiers are defined
      if (!this._isDefined(node.value)) {
        throw new Error(`Undefined identifier: ${node.value}`);
      }
      node.children.forEach((child) => this._checkNode(child));
    }
  }

  _defineConstant(identifier, expression) {
    if (this.constants.hasOwnProperty(identifier)) {
      throw new Error(`Constant already defined: ${identifier}`);
    }
    return true;
  }

  _isDefined(identifier) {
    return (
      this.constants.hasOwnProperty(identifier) ||
      this.variables.hasOwnProperty(identifier)
    );
  }
}
