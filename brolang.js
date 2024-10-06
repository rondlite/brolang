import { Lexer } from "./lexer.js";
import { Parser } from "./ast.js";
import { SemanticAnalyzer } from "./analyzer.js";
import { Interpreter } from "./interpreter.js";
export function interpretBroLang(sourceCode) {
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.tokenize();
  console.log("Tokens:", tokens);

  const parser = new Parser(tokens);
  const ast = parser.parse();

  console.log(JSON.stringify(ast, null, 2)); // Debugging: Print the AST structure

  const semanticAnalyzer = new SemanticAnalyzer(ast);
  semanticAnalyzer.analyze();
  console.log("Semantic analysis completed successfully.");
  const interpreter = new Interpreter();
  interpreter.interpret(ast);
}
