import { Parser } from "./ast";
import { Lexer } from "./lexer";
import { SemanticAnalyzer } from "./analyzer";

const sourceCode = `yo a = 5; yo b = a + 10;`;
const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const ast = parser.parse();
const semanticAnalyzer = new SemanticAnalyzer(ast);
semanticAnalyzer.analyze();
