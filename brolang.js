// interpreter.js

// Function to run the BroLang code
function runBroLang() {
  const code = document.getElementById('codeInput').value;
  const outputArea = document.getElementById('output');
  outputArea.value = ''; // Clear previous output

  try {
    // Tokenize the code
    const tokens = tokenize(code);

    // Parse the tokens into an Abstract Syntax Tree (AST)
    const ast = parse(tokens);

    // Execute the AST
    const context = {};
    execute(ast, context, outputArea);
  } catch (error) {
    outputArea.value = 'Error: ' + error.message;
  }
}

// Event listener for the Run button
document.getElementById('runButton').addEventListener('click', runBroLang);

// Tokenizer function
function tokenize(code) {
  // Simple tokenizer logic
  const tokenSpec = [
    ['WHITESPACE', /^\s+/],
    ['COMMENT', /^\/\/[^\n]*/],
    ['NUMBER', /^\d+(\.\d+)?/],
    ['STRING', /^"([^"\\]|\\.)*"/],
    ['IDENTIFIER', /^[a-zA-Z_]\w*/],
    ['OPERATOR', /^==|!=|<=|>=|\+|-|\*|\/|%|=/],
    ['PUNCTUATION', /^[;(){}[\],]/],
    ['NEWLINE', /^\n/],
  ];

  let tokens = [];
  let line = 1;

  while (code.length > 0) {
    let matched = false;

    for (let [type, regex] of tokenSpec) {
      const match = code.match(regex);
      if (match) {
        matched = true;
        const value = match[0];
        if (type !== 'WHITESPACE' && type !== 'COMMENT') {
          tokens.push({ type, value, line });
        }
        if (type === 'NEWLINE') {
          line++;
        }
        code = code.slice(value.length);
        break;
      }
    }

    if (!matched) {
      throw new Error(`Unrecognized token at line ${line}`);
    }
  }

  return tokens;
}

// Parser function
function parse(tokens) {
  // Basic recursive-descent parser
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function consume(expectedType) {
    const token = tokens[position];
    if (!token || token.type !== expectedType) {
      throw new Error(`Expected ${expectedType} but found ${token ? token.type : 'EOF'}`);
    }
    position++;
    return token;
  }

  function parseProgram() {
    const statements = [];
    while (position < tokens.length) {
      statements.push(parseStatement());
    }
    return { type: 'Program', body: statements };
  }

  function parseStatement() {
    const token = peek();
    if (token.type === 'IDENTIFIER' && token.value.toLowerCase() === 'spill') {
      return parsePrintStatement();
    } else if (token.type === 'IDENTIFIER' && token.value.toLowerCase() === 'yo') {
      return parseVariableDeclaration();
    } else {
      throw new Error(`Unexpected token ${token.value} at line ${token.line}`);
    }
  }

  function parsePrintStatement() {
    consume('IDENTIFIER'); // 'spill'
    const argument = parseExpression();
    consume('PUNCTUATION'); // ';'
    return { type: 'PrintStatement', argument };
  }

  function parseVariableDeclaration() {
    consume('IDENTIFIER'); // 'yo'
    const identifier = consume('IDENTIFIER'); // variable name
    consume('OPERATOR'); // '='
    const init = parseExpression();
    consume('PUNCTUATION'); // ';'
    return {
      type: 'VariableDeclaration',
      identifier: identifier.value,
      init,
    };
  }

  function parseExpression() {
    const token = peek();
    if (token.type === 'STRING') {
      position++;
      return { type: 'Literal', value: token.value.slice(1, -1) };
    } else if (token.type === 'NUMBER') {
      position++;
      return { type: 'Literal', value: parseFloat(token.value) };
    } else if (token.type === 'IDENTIFIER') {
      position++;
      return { type: 'Identifier', name: token.value };
    } else {
      throw new Error(`Unexpected expression ${token.value} at line ${token.line}`);
    }
  }

  return parseProgram();
}

// Executor function
function execute(node, context, outputArea) {
  switch (node.type) {
    case 'Program':
      node.body.forEach(statement => execute(statement, context, outputArea));
      break;

    case 'PrintStatement':
      const value = evaluate(node.argument, context);
      outputArea.value += value + '\n';
      break;

    case 'VariableDeclaration':
      const varValue = evaluate(node.init, context);
      context[node.identifier] = varValue;
      break;

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}

// Evaluator function
function evaluate(node, context) {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier':
      if (node.name in context) {
        return context[node.name];
      } else {
        throw new Error(`Undefined variable ${node.name}`);
      }

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}
