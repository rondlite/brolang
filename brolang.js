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
    outputArea.value = 'Error: ' + error.message;
    console.error(error);
  }
}

// Event listener for the Run button
document.getElementById('runButton').addEventListener('click', runBroLang);

// Tokenizer function
// ... (No changes to tokenizer)

// Parser function
// ... (No changes to parser)

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

    case 'ClassDeclaration':
      context.classes[node.name] = node;
      break;

    case 'MemberExpression':
      const obj = evaluate(node.object, context);
      if (!obj || !obj.variables) {
        throw new Error(`Cannot access property '${node.property}' of undefined`);
      }
      return obj.variables[node.property];

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
// ... (Minor improvements can be added for robustness, like error handling)
