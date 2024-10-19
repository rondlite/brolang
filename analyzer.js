export class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
  }

  analyze() {
    this._analyzeNode(this.ast);
  }

  _analyzeNode(node) {
    switch (node.type) {
      case "Program":
        node.children.forEach(child => this._analyzeNode(child));
        break;
      case "VariableDeclaration":
        this._analyzeNode(node.value.expression);
        break;
      case "PrintStatement":
        this._analyzeNode(node.value.expression);
        break;
      case "IfStatement":
        this._analyzeNode(node.value.condition);
        this._analyzeNode(node.value.thenBranch);
        if (node.value.elseBranch) {
          this._analyzeNode(node.value.elseBranch);
        }
        break;
      case "ComparisonExpression":
        this._analyzeNode(node.value.left);
        this._analyzeNode(node.value.right);
        break;
      case "ConstantDeclaration":
        this._analyzeNode(node.value.expression);
        break;
      case "ForEachLoop":
        this._analyzeNode(node.value.body);
        break;
      case "FunctionDeclaration":
        this._analyzeNode(node.value.body);
        break;
      case "ConcurrencyBlock":
        node.value.children.forEach(child => this._analyzeNode(child));
        break;
      case "Literal":
        // Literals do not need further analysis
        break;
      case "Block":
        break;
      case "Identifier":
        // Identifiers do not need further analysis
        break;
      // Add other cases for different node types
      default:
        throw new Error(`Unknown node type in analysis: ${node.type}`);
    }
  }
}
