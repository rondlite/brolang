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
      context.output += String(printValue) + '\n';
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

    case 'CallExpression':
      const func = context.functions[node.callee.name];
      if (!func) {
        throw new Error(`Undefined function '${node.callee.name}'`);
      }
      const args = node.arguments.map(arg => evaluate(arg, context));
      return executeFunction(func, args, context);

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
          throw new Error(`Unsupported unary operator '${node.operator}'`);
      }

    case 'CallExpression':
      if (node.callee.type === 'MemberExpression') {
        const obj = evaluate(node.callee.object, context);
        const methodName = node.callee.property;
        const method = obj.methods[methodName];
        if (!method) {
          throw new Error(`Undefined method '${methodName}'`);
        }
        const args = node.arguments.map(arg => evaluate(arg, context));
        const methodContext = {
          variables: { ...context.variables },
          functions: context.functions,
          classes: context.classes,
          output: context.output,
          thisValue: obj,
        };
        method.params.forEach((param, index) => {
          methodContext.variables[param] = args[index];
        });
        const result = executeBlock(method.body, methodContext);
        context.output = methodContext.output;
        if (result && result.type === 'ReturnStatement') {
          return result.value;
        }
        return undefined;
      } else {
        const func = context.functions[node.callee.name];
        if (!func) {
          throw new Error(`Undefined function '${node.callee.name}'`);
        }
        const args = node.arguments.map(arg => evaluate(arg, context));
        return executeFunction(func, args, context);
      }

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

    case 'MemberExpression':
      const object = evaluate(node.object, context);
      const property = node.property;
      if (object.variables && property in object.variables) {
        return object.variables[property];
      } else if (object.methods && property in object.methods) {
        return { type: 'Method', object: object, method: object.methods[property] };
      } else {
        throw new Error(`Property '${property}' does not exist`);
      }

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}

function evaluateClass(classNode, context) {
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
  return obj;
}
