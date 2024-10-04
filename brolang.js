// interpreter.js

// Tokenizer function
function tokenize(code) {
  const tokenSpec = [
    ['WHITESPACE', /^\s+/],
    ['COMMENT', /^\/\/[^\n]*/],
    ['MULTILINE_COMMENT', /^\/\*[\s\S]*?\*\//],
    ['NUMBER', /^\d+(\.\d+)?/],
    ['STRING', /^"([^"\\]|\\.)*"/],
    ['SPILL', /^spill\b/],
    ['STRAIGHTUP', /^straightUp\b/],
    ['NAH', /^nah\b/],
    ['IDENTIFIER', /^[a-zA-Z_]\w*/],
    ['OPERATOR', /^==|!=|<=|>=|\+{1,2}|-{1,2}|\*|\/|%|=/],
    ['PUNCTUATION', /^[;(){}[\],.]/],
    ['LOGICAL', /^&&|\|\||!|and\b|or\b|not\b/],
    ['NEWLINE', /^\n/],
    ['RETURN', /^return\b/],
    ['CLASS', /^class\b/],
    ['EXTENDS', /^extends\b/],
    ['NEW', /^new\b/],
    ['FUNCTION', /^func\b/],
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

  function parseProgram() {
    const statements = [];
    while (position < tokens.length) {
      statements.push(parseStatement());
    }
    return { type: 'Program', body: statements };
  }

  function parseStatement() {
    const token = tokens[position];
    switch (token.type) {
      case 'SPILL':
        position++;
        const argument = parseExpression();
        return { type: 'SpillStatement', argument };
      case 'STRAIGHTUP':
      case 'NAH':
        return parseVariableDeclaration();
      case 'FUNCTION':
        return parseFunctionDeclaration();
      case 'CLASS':
        return parseClassDeclaration();
      case 'RETURN':
        return parseReturnStatement();
      case 'IDENTIFIER':
        if (tokens[position + 1] && tokens[position + 1].value === '(') {
          return parseFunctionCall();
        } else {
          return parseExpressionStatement();
        }
      case 'PUNCTUATION':
        if (token.value === '{') {
          position++;
          return parseBlockStatement();
        }
      case 'OPERATOR':
        if (token.value === 'if') {
          return parseIfStatement();
        } else if (token.value === 'while') {
          return parseWhileStatement();
        } else if (token.value === 'for') {
          return parseForStatement();
        }
      case 'NEW':
        return parseNewExpression();
      default:
        return parseExpressionStatement();
    }
  }

  function parseVariableDeclaration() {
    const token = tokens[position];
    position++;
    const identifier = tokens[position];
    position++;
    if (identifier.type !== 'IDENTIFIER') {
      throw new Error(`Expected identifier at line ${token.line}`);
    }
    let init = null;
    if (tokens[position] && tokens[position].type === 'OPERATOR' && tokens[position].value === '=') {
      position++;
      init = parseExpression();
    }
    return {
      type: 'VariableDeclaration',
      identifier: identifier.value,
      constant: token.type === 'STRAIGHTUP',
      init,
    };
  }

  function parseBlockStatement() {
    const body = [];
    while (position < tokens.length && tokens[position].value !== '}') {
      body.push(parseStatement());
    }
    if (tokens[position].value !== '}') {
      throw new Error(`Expected '}' at line ${tokens[position - 1].line}`);
    }
    position++;
    return { type: 'BlockStatement', body };
  }

  function parseIfStatement() {
    position++; // Skip 'if'
    const test = parseExpression();
    const consequent = parseBlockStatement();
    let alternate = null;
    if (tokens[position] && tokens[position].value === 'else') {
      position++;
      alternate = parseBlockStatement();
    }
    return { type: 'IfStatement', test, consequent, alternate };
  }

  function parseWhileStatement() {
    position++; // Skip 'while'
    const test = parseExpression();
    const body = parseBlockStatement();
    return { type: 'WhileStatement', test, body };
  }

  function parseForStatement() {
    position++; // Skip 'for'
    const init = parseStatement();
    const test = parseExpression();
    position++; // Skip ';'
    const update = parseExpression();
    const body = parseBlockStatement();
    return { type: 'ForStatement', init, test, update, body };
  }

  function parseFunctionCall() {
    const nameToken = tokens[position];
    position += 2; // Skip name and '('
    const args = [];
    while (tokens[position] && tokens[position].value !== ')') {
      args.push(parseExpression());
      if (tokens[position] && tokens[position].value === ',') {
        position++;
      }
    }
    if (tokens[position].value !== ')') {
      throw new Error(`Expected ')' at line ${tokens[position - 1].line}`);
    }
    position++; // Skip ')'
    return { type: 'CallExpression', callee: { type: 'Identifier', name: nameToken.value }, arguments: args };
  }

  function parseFunctionDeclaration() {
    position++; // Skip 'func'
    const nameToken = tokens[position];
    position++;
    if (nameToken.type !== 'IDENTIFIER') {
      throw new Error(`Expected function name at line ${nameToken.line}`);
    }
    position++; // Skip '('
    const params = [];
    while (tokens[position] && tokens[position].value !== ')') {
      params.push(tokens[position].value);
      position++;
      if (tokens[position] && tokens[position].value === ',') {
        position++;
      }
    }
    if (tokens[position].value !== ')') {
      throw new Error(`Expected ')' at line ${tokens[position - 1].line}`);
    }
    position++; // Skip ')'
    const body = parseBlockStatement();
    return { type: 'FunctionDeclaration', name: nameToken.value, params, body };
  }

  function parseClassDeclaration() {
    position++; // Skip 'class'
    const nameToken = tokens[position];
    position++;
    if (nameToken.type !== 'IDENTIFIER') {
      throw new Error(`Expected class name at line ${nameToken.line}`);
    }
    let superClass = null;
    if (tokens[position] && tokens[position].type === 'EXTENDS') {
      position++; // Skip 'extends'
      superClass = tokens[position].value;
      position++;
    }
    const body = parseBlockStatement();
    return { type: 'ClassDeclaration', name: nameToken.value, superClass, body };
  }

  function parseReturnStatement() {
    position++; // Skip 'return'
    const argument = parseExpression();
    return { type: 'ReturnStatement', argument };
  }

  function parseNewExpression() {
    position++; // Skip 'new'
    const className = tokens[position];
    position++;
    if (className.type !== 'IDENTIFIER') {
      throw new Error(`Expected class name at line ${className.line}`);
    }
    position++; // Skip '('
    const args = [];
    while (tokens[position] && tokens[position].value !== ')') {
      args.push(parseExpression());
      if (tokens[position] && tokens[position].value === ',') {
        position++;
      }
    }
    if (tokens[position].value !== ')') {
      throw new Error(`Expected ')' at line ${tokens[position - 1].line}`);
    }
    position++; // Skip ')'
    return { type: 'NewExpression', callee: { type: 'Identifier', name: className.value }, arguments: args };
  }

  function parseExpressionStatement() {
    const expression = parseExpression();
    return { type: 'ExpressionStatement', expression };
  }

  function parseExpression() {
    const token = tokens[position];
    position++;
    if (token.type === 'NUMBER' || token.type === 'STRING') {
      return { type: 'Literal', value: token.value };
    } else if (token.type === 'IDENTIFIER') {
      return { type: 'Identifier', name: token.value };
    } else {
      throw new Error(`Unexpected token ${token.value} at line ${token.line}`);
    }
  }

  return parseProgram();
}

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
      classes: {},
      output: '',
    };
    execute(ast, context);

    // If 'main' function exists, call it
    if (context.functions['main']) {
      // Create a local context for 'main' function
      const mainContext = {
        variables: { ...context.variables },
        functions: context.functions,
        classes: context.classes,
        output: context.output,
      };
      // Execute 'main' function
      const mainFunc = context.functions['main'];
      executeFunction(mainFunc, [], mainContext);
      // Update output
      outputArea.value = mainContext.output;
    } else {
      // No 'main' function, display the output collected during execution
      outputArea.value = context.output;
    }
  } catch (error) {
    outputArea.value = 'Error at line ' + (error.line || '?') + ': ' + error.message;
    console.error(error);
  }
}

// Event listener for the Run button
document.getElementById('runButton').addEventListener('click', runBroLang);

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

    case 'SpillStatement':
      const printValue = evaluate(node.argument, context);
      context.output += String(printValue) + '\n';
      break;

    case 'ExpressionStatement':
      evaluate(node.expression, context);
      break;

    case 'VariableDeclaration':
      const varValue = node.init ? evaluate(node.init, context) : undefined;
      if (node.constant) {
        Object.defineProperty(context.variables, node.identifier, {
          value: varValue,
          writable: false,
        });
      } else {
        context.variables[node.identifier] = varValue;
      }
      break;

    case 'FunctionDeclaration':
      context.functions[node.name] = node;
      break;

    case 'ClassDeclaration':
      context.classes[node.name] = node;
      break;

    case 'ReturnStatement':
      return { type: 'ReturnStatement', value: evaluate(node.argument, context) };

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

    case 'CallExpression':
      const func = context.functions[node.callee.name];
      if (!func) {
        throw new Error(`Undefined function '${node.callee.name}'`);
      }
      const args = node.arguments.map(arg => evaluate(arg, context));
      return executeFunction(func, args, context);

    case 'NewExpression':
      const classNode = context.classes[node.callee.name];
      if (!classNode) {
        throw new Error(`Undefined class '${node.callee.name}'`);
      }
      const obj = {
        variables: {},
        methods: {},
      };
      // Inherit from superclass if any
      if (classNode.superClass) {
        const superClassNode = context.classes[classNode.superClass];
        if (!superClassNode) {
          throw new Error(`Undefined superclass '${classNode.superClass}'`);
        }
        const superObj = evaluateClass(superClassNode, context);
        Object.setPrototypeOf(obj.variables, superObj.variables);
        Object.setPrototypeOf(obj.methods, superObj.methods);
      }
      // Define methods
      classNode.body.forEach(member => {
        if (member.type === 'MethodDefinition') {
          obj.methods[member.name] = member;
        }
      });
      // Call 'init' method if exists
      const initMethod = obj.methods['init'];
      if (initMethod) {
        const args = node.arguments.map(arg => evaluate(arg, context));
        const methodContext = {
          variables: { ...context.variables },
          functions: context.functions,
          classes: context.classes,
          output: context.output,
          thisValue: obj,
        };
        initMethod.params.forEach((param, index) => {
          methodContext.variables[param] = args[index];
        });
        executeBlock(initMethod.body, methodContext);
        context.output = methodContext.output;
      }
      return obj;

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}

function executeBlock(block, context) {
  const localContext = {
    variables: { ...context.variables },
    functions: context.functions,
    classes: context.classes,
    output: context.output,
    thisValue: context.thisValue,
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

function executeFunction(funcNode, args, context) {
  const localContext = {
    variables: { ...context.variables },
    functions: context.functions,
    classes: context.classes,
    output: context.output,
    thisValue: context.thisValue,
  };
  funcNode.params.forEach((param, index) => {
    localContext.variables[param] = args[index];
  });
  const result = executeBlock(funcNode.body, localContext);
  context.output = localContext.output;
  if (result && result.type === 'ReturnStatement') {
    return result.value;
  }
  return undefined;
}

// Evaluator function
function evaluate(node, context) {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier':
      if (node.name === 'me') {
        return context.thisValue;
      }
      if (node.name in context.variables) {
        return context.variables[node.name];
      } else {
        throw new Error(`Undefined variable '${node.name}'`);
      }

    case 'AssignmentExpression':
      if (node.left.type !== 'Identifier' && node.left.type !== 'MemberExpression') {
        throw new Error('Invalid left-hand side in assignment');
      }
      const value = evaluate(node.right, context);
      if (node.left.type === 'Identifier') {
        if (Object.getOwnPropertyDescriptor(context.variables, node.left.name) && !Object.getOwnPropertyDescriptor(context.variables, node.left.name).writable) {
          throw new Error(`Cannot assign to constant variable '${node.left.name}'`);
        }
        context.variables[node.left.name] = value;
      } else if (node.left.type === 'MemberExpression') {
        const obj = evaluate(node.left.object, context);
        obj.variables[node.left.property] = value;
      }
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
          throw new Error(`
