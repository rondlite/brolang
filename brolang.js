// brolang.js

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
    const context = {
      variables: {},
      functions: {},
      output: '',
    };
    execute(ast, context);

    // Display the output
    outputArea.value = context.output;
  } catch (error) {
    outputArea.value = 'Error: ' + error.message;
    console.error(error);
  }
}

// Event listener for the Run button
document.getElementById('runButton').addEventListener('click', runBroLang);

// Tokenizer function
function tokenize(code) {
  const tokenSpec = [
    ['WHITESPACE', /^\s+/],
    ['COMMENT', /^\/\/[^\n]*/],
    ['MULTILINE_COMMENT', /^\/\*[\s\S]*?\*\//],
    ['NUMBER', /^\d+(\.\d+)?/],
    ['STRING', /^"([^"\\]|\\.)*"/],
    ['STRAIGHTUP', /^straightUp\b/],
    ['NAH', /^nah\b/],
    ['IDENTIFIER', /^[a-zA-Z_]\w*/],
    ['OPERATOR', /^==|!=|<=|>=|\+{1,2}|-{1,2}|\*|\/|%|=/],
    ['PUNCTUATION', /^[;(){}[\],]/],
    ['LOGICAL', /^&&|\|\||!|and\b|or\b|not\b/],
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
        if (type === 'NEWLINE') {
          line++;
        } else if (type !== 'WHITESPACE' && type !== 'COMMENT' && type !== 'MULTILINE_COMMENT') {
          tokens.push({ type, value, line });
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
  let position = 0;

  function peek(offset = 0) {
    return tokens[position + offset];
  }

  function consume(expectedType, expectedValue) {
    const token = tokens[position];
    if (!token || token.type !== expectedType || (expectedValue && token.value !== expectedValue)) {
      throw new Error(`Expected ${expectedType} '${expectedValue}' but found ${token ? token.type + " '" + token.value + "'" : 'EOF'}`);
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
    if (token.type === 'IDENTIFIER') {
      const keyword = token.value.toLowerCase();
      if (keyword === 'spill') {
        return parsePrintStatement();
      } else if (keyword === 'yo' || keyword === 'nocap') {
        return parseVariableDeclaration();
      } else if (keyword === 'if') {
        return parseIfStatement();
      } else if (keyword === 'while') {
        return parseWhileStatement();
      } else if (keyword === 'for') {
        return parseForStatement();
      } else if (keyword === 'brofunc') {
        return parseFunctionDeclaration();
      } else if (keyword === 'return' || keyword === 'bounce') {
        return parseReturnStatement();
      } else if (keyword === 'break') {
        consume('IDENTIFIER');
        consume('PUNCTUATION', ';');
        return { type: 'BreakStatement' };
      } else if (keyword === 'continue') {
        consume('IDENTIFIER');
        consume('PUNCTUATION', ';');
        return { type: 'ContinueStatement' };
      } else {
        return parseExpressionStatement();
      }
    } else {
      return parseExpressionStatement();
    }
  }

  function parseBlock() {
    consume('PUNCTUATION', '{');
    const body = [];
    while (peek() && peek().value !== '}') {
      body.push(parseStatement());
    }
    consume('PUNCTUATION', '}');
    return body;
  }

  function parsePrintStatement() {
    consume('IDENTIFIER'); // 'spill'
    const argument = parseExpression();
    consume('PUNCTUATION', ';');
    return { type: 'PrintStatement', argument };
  }

  function parseVariableDeclaration() {
    const isConstant = peek().value.toLowerCase() === 'nocap';
    if (isConstant) consume('IDENTIFIER'); // 'nocap'
    consume('IDENTIFIER'); // 'yo'
    const identifier = consume('IDENTIFIER'); // variable name
    consume('OPERATOR', '=');
    const init = parseExpression();
    consume('PUNCTUATION', ';');
    return {
      type: 'VariableDeclaration',
      identifier: identifier.value,
      init,
      constant: isConstant,
    };
  }

  function parseIfStatement() {
    consume('IDENTIFIER'); // 'if'
    consume('PUNCTUATION', '(');
    const test = parseExpression();
    consume('PUNCTUATION', ')');
    const consequent = { type: 'BlockStatement', body: parseBlock() };
    let alternate = null;
    if (peek() && peek().value.toLowerCase() === 'else') {
      consume('IDENTIFIER'); // 'else'
      if (peek() && peek().value.toLowerCase() === 'if') {
        alternate = parseIfStatement();
      } else {
        alternate = { type: 'BlockStatement', body: parseBlock() };
      }
    }
    return { type: 'IfStatement', test, consequent, alternate };
  }

  function parseWhileStatement() {
    consume('IDENTIFIER'); // 'while'
    consume('PUNCTUATION', '(');
    const test = parseExpression();
    consume('PUNCTUATION', ')');
    const body = { type: 'BlockStatement', body: parseBlock() };
    return { type: 'WhileStatement', test, body };
  }

  function parseForStatement() {
    consume('IDENTIFIER'); // 'for'
    consume('PUNCTUATION', '(');
    const init = parseVariableDeclaration();
    const test = parseExpression();
    consume('PUNCTUATION', ';');
    const update = parseExpression();
    consume('PUNCTUATION', ')');
    const body = { type: 'BlockStatement', body: parseBlock() };
    return { type: 'ForStatement', init, test, update, body };
  }

  function parseFunctionDeclaration() {
    consume('IDENTIFIER'); // 'brofunc'
    const name = consume('IDENTIFIER'); // function name
    consume('PUNCTUATION', '(');
    const params = [];
    while (peek() && peek().value !== ')') {
      const param = consume('IDENTIFIER');
      params.push(param.value);
      if (peek() && peek().value === ',') {
        consume('PUNCTUATION', ',');
      }
    }
    consume('PUNCTUATION', ')');
    const body = { type: 'BlockStatement', body: parseBlock() };
    return {
      type: 'FunctionDeclaration',
      name: name.value,
      params,
      body,
    };
  }

  function parseReturnStatement() {
    consume('IDENTIFIER'); // 'return' or 'bounce'
    const argument = parseExpression();
    consume('PUNCTUATION', ';');
    return { type: 'ReturnStatement', argument };
  }

  function parseExpressionStatement() {
    const expression = parseExpression();
    consume('PUNCTUATION', ';');
    return { type: 'ExpressionStatement', expression };
  }

  function parseExpression() {
    return parseAssignmentExpression();
  }

  function parseAssignmentExpression() {
    let left = parseLogicalOrExpression();
    if (peek() && peek().type === 'OPERATOR' && peek().value === '=') {
      consume('OPERATOR');
      const right = parseAssignmentExpression();
      return { type: 'AssignmentExpression', operator: '=', left, right };
    }
    return left;
  }

  function parseLogicalOrExpression() {
    let left = parseLogicalAndExpression();
    while (peek() && ((peek().type === 'LOGICAL' && (peek().value === '||' || peek().value.toLowerCase() === 'or')))) {
      const operator = consume('LOGICAL').value;
      const right = parseLogicalAndExpression();
      left = { type: 'LogicalExpression', operator, left, right };
    }
    return left;
  }

  function parseLogicalAndExpression() {
    let left = parseEqualityExpression();
    while (peek() && ((peek().type === 'LOGICAL' && (peek().value === '&&' || peek().value.toLowerCase() === 'and')))) {
      const operator = consume('LOGICAL').value;
      const right = parseEqualityExpression();
      left = { type: 'LogicalExpression', operator, left, right };
    }
    return left;
  }

  function parseEqualityExpression() {
    let left = parseRelationalExpression();
    while (peek() && peek().type === 'OPERATOR' && (peek().value === '==' || peek().value === '!=')) {
      const operator = consume('OPERATOR').value;
      const right = parseRelationalExpression();
      left = { type: 'BinaryExpression', operator, left, right };
    }
    return left;
  }

  function parseRelationalExpression() {
    let left = parseAdditiveExpression();
    while (peek() && peek().type === 'OPERATOR' && (peek().value === '<' || peek().value === '<=' || peek().value === '>' || peek().value === '>=')) {
      const operator = consume('OPERATOR').value;
      const right = parseAdditiveExpression();
      left = { type: 'BinaryExpression', operator, left, right };
    }
    return left;
  }

  function parseAdditiveExpression() {
    let left = parseMultiplicativeExpression();
    while (peek() && peek().type === 'OPERATOR' && (peek().value === '+' || peek().value === '-')) {
      const operator = consume('OPERATOR').value;
      const right = parseMultiplicativeExpression();
      left = { type: 'BinaryExpression', operator, left, right };
    }
    return left;
  }

  function parseMultiplicativeExpression() {
    let left = parseUnaryExpression();
    while (peek() && peek().type === 'OPERATOR' && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
      const operator = consume('OPERATOR').value;
      const right = parseUnaryExpression();
      left = { type: 'BinaryExpression', operator, left, right };
    }
    return left;
  }

  function parseUnaryExpression() {
    if (peek() && ((peek().type === 'OPERATOR' && peek().value === '-') || (peek().type === 'LOGICAL' && peek().value === 'not'))) {
      const operator = consume(peek().type).value;
      const argument = parseUnaryExpression();
      return { type: 'UnaryExpression', operator, argument };
    }
    return parsePrimaryExpression();
  }

  function parsePrimaryExpression() {
    const token = peek();
    if (token.type === 'NUMBER') {
      position++;
      return { type: 'Literal', value: parseFloat(token.value) };
    } else if (token.type === 'STRING') {
      position++;
      return { type: 'Literal', value: token.value.slice(1, -1) };
    } else if (token.type === 'STRAIGHTUP') {
      position++;
      return { type: 'Literal', value: true };
    } else if (token.type === 'NAH') {
      position++;
      return { type: 'Literal', value: false };
    } else if (token.type === 'IDENTIFIER') {
      position++;
      if (peek() && peek().value === '(') {
        // Function call
        consume('PUNCTUATION', '(');
        const args = [];
        while (peek() && peek().value !== ')') {
          args.push(parseExpression());
          if (peek() && peek().value === ',') {
            consume('PUNCTUATION', ',');
          }
        }
        consume('PUNCTUATION', ')');
        return { type: 'CallExpression', callee: { type: 'Identifier', name: token.value }, arguments: args };
      } else {
        return { type: 'Identifier', name: token.value };
      }
    } else if (token.type === 'PUNCTUATION' && token.value === '(') {
      consume('PUNCTUATION', '(');
      const expression = parseExpression();
      consume('PUNCTUATION', ')');
      return expression;
    } else {
      throw new Error(`Unexpected token ${token.value} at line ${token.line}`);
    }
  }

  return parseProgram();
}

// Executor function
function execute(node, context) {
  switch (node.type) {
    case 'Program':
      for (let statement of node.body) {
        const result = execute(statement, context);
        if (result && result.type === 'ReturnStatement') {
          return result;
        }
      }
      break;

    case 'VariableDeclaration':
      const varValue = evaluate(node.init, context);
      if (node.constant) {
        Object.defineProperty(context.variables, node.identifier, {
          value: varValue,
          writable: false,
        });
      } else {
        context.variables[node.identifier] = varValue;
      }
      break;

    case 'PrintStatement':
      const printValue = evaluate(node.argument, context);
      context.output += printValue + '\n';
      break;

    case 'ExpressionStatement':
      evaluate(node.expression, context);
      break;

    case 'IfStatement':
      const testResult = evaluate(node.test, context);
      if (testResult) {
        const result = executeBlock(node.consequent, context);
        if (result && result.type === 'ReturnStatement') {
          return result;
        }
      } else if (node.alternate) {
        const result = executeBlock(node.alternate, context);
        if (result && result.type === 'ReturnStatement') {
          return result;
        }
      }
      break;

    case 'WhileStatement':
      while (evaluate(node.test, context)) {
        const result = executeBlock(node.body, context);
        if (result && result.type === 'BreakStatement') {
          break;
        } else if (result && result.type === 'ContinueStatement') {
          continue;
        } else if (result && result.type === 'ReturnStatement') {
          return result;
        }
      }
      break;

    case 'ForStatement':
      execute(node.init, context);
      while (evaluate(node.test, context)) {
        const result = executeBlock(node.body, context);
        if (result && result.type === 'BreakStatement') {
          break;
        } else if (result && result.type === 'ContinueStatement') {
          // Do nothing
        } else if (result && result.type === 'ReturnStatement') {
          return result;
        }
        evaluate(node.update, context);
      }
      break;

    case 'FunctionDeclaration':
      context.functions[node.name] = node;
      break;

    case 'ReturnStatement':
      return { type: 'ReturnStatement', value: evaluate(node.argument, context) };

    case 'BreakStatement':
      return { type: 'BreakStatement' };

    case 'ContinueStatement':
      return { type: 'ContinueStatement' };

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}

function executeBlock(block, context) {
  const localContext = {
    variables: Object.create(context.variables),
    functions: context.functions,
    output: context.output,
  };
  for (let statement of block.body) {
    const result = execute(statement, localContext);
    if (result && (result.type === 'ReturnStatement' || result.type === 'BreakStatement' || result.type === 'ContinueStatement')) {
      context.output = localContext.output;
      return result;
    }
  }
  context.output = localContext.output;
}

// Evaluator function
function evaluate(node, context) {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier':
      if (node.name in context.variables) {
        return context.variables[node.name];
      } else {
        throw new Error(`Undefined variable '${node.name}'`);
      }

    case 'AssignmentExpression':
      if (node.left.type !== 'Identifier') {
        throw new Error('Invalid left-hand side in assignment');
      }
      const value = evaluate(node.right, context);
      if (Object.getOwnPropertyDescriptor(context.variables, node.left.name) && !Object.getOwnPropertyDescriptor(context.variables, node.left.name).writable) {
        throw new Error(`Cannot assign to constant variable '${node.left.name}'`);
      }
      context.variables[node.left.name] = value;
      return value;

    case 'BinaryExpression':
      const left = evaluate(node.left, context);
      const right = evaluate(node.right, context);
      switch (node.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '%':
          return left % right;
        case '==':
          return left == right;
        case '!=':
          return left != right;
        case '<':
          return left < right;
        case '<=':
          return left <= right;
        case '>':
          return left > right;
        case '>=':
          return left >= right;
        default:
          throw new Error(`Unsupported operator '${node.operator}'`);
      }

    case 'LogicalExpression':
      const leftVal = evaluate(node.left, context);
      switch (node.operator) {
        case '&&':
        case 'and':
          return leftVal && evaluate(node.right, context);
        case '||':
        case 'or':
          return leftVal || evaluate(node.right, context);
        default:
          throw new Error(`Unsupported logical operator '${node.operator}'`);
      }

    case 'UnaryExpression':
      const arg = evaluate(node.argument, context);
      switch (node.operator) {
        case '-':
          return -arg;
        case '!':
        case 'not':
          return !arg;
        default:
          throw new Error(`Unsupported unary operator '${node.operator}'`);
      }

    case 'CallExpression':
      const func = context.functions[node.callee.name];
      if (!func) {
        throw new Error(`Undefined function '${node.callee.name}'`);
      }
      const args = node.arguments.map(arg => evaluate(arg, context));
      const localContext = {
        variables: Object.create(context.variables),
        functions: context.functions,
        output: '',
      };
      func.params.forEach((param, index) => {
        localContext.variables[param] = args[index];
      });
      const result = executeBlock(func.body, localContext);
      if (result && result.type === 'ReturnStatement') {
        return result.value;
      }
      return undefined;

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}
