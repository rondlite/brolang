// BroLang Interpreter

// Tokenizer function
function tokenize(code) {
  const tokenSpec = [
    ['WHITESPACE', /^\s+/],
    ['COMMENT', /^\/\/[^\n]*/],
    ['MULTILINE_COMMENT', /^\/\*[\s\S]*?\*\//],
    ['NUMBER', /^\d+(\.\d+)?/],
    ['STRING', /^"([^"\\]|\\.)*"/],
    ['SPILL', /^spill\b/],
    ['HOLLA', /^holla\b/],
    ['STRAIGHTUP', /^straightUp\b/],
    ['NAH', /^nah\b/],
    ['GHOST', /^ghost\b/],
    ['IF', /^if\b/],
    ['ELSE', /^else\b/],
    ['WHILE', /^while\b/],
    ['FOR', /^for\b/],
    ['BREAK', /^break\b/],
    ['CONTINUE', /^continue\b/],
    ['FUNCTION', /^brofunc\b/],
    ['RETURN', /^bounce\b/],
    ['CLASS', /^bigBro\b/],
    ['EXTENDS', /^inherits\b/],
    ['NEW', /^new\b/],
    ['THIS', /^me\b/],
    ['IDENTIFIER', /^[a-zA-Z_]\w*/],
    ['OPERATOR', /^==|!=|<=|>=|\+{1,2}|-{1,2}|\*|\/|%|=/],
    ['PUNCTUATION', /^[;(){}[\],.]/],
    ['LOGICAL', /^&&|\|\||!|and\b|or\b|not\b/],
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
        if (type !== 'WHITESPACE' && type !== 'COMMENT' && type !== 'MULTILINE_COMMENT') {
          tokens.push({ type, value, line });
        }
        if (type === 'NEWLINE') line++;
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

// Parser function implementation remains the same

// Evaluator
async function evaluate(node, context) {
  switch (node.type) {
    case 'Program':
      let result;
      for (const statement of node.body) {
        result = await execute(statement, context);
      }
      return result;

    case 'Literal':
      return node.value;

    case 'Identifier':
      if (node.name in context.variables) {
        return context.variables[node.name];
      }
      throw new Error(`Undefined variable: ${node.name}`);

    case 'BinaryExpression':
      const left = await evaluate(node.left, context);
      const right = await evaluate(node.right, context);
      switch (node.operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '%': return left % right;
        case '==': return left == right;
        case '!=': return left != right;
        case '<': return left < right;
        case '<=': return left <= right;
        case '>': return left > right;
        case '>=': return left >= right;
      }

    case 'LogicalExpression':
      const leftValue = await evaluate(node.left, context);
      switch (node.operator) {
        case '&&':
        case 'and':
          return leftValue && await evaluate(node.right, context);
        case '||':
        case 'or':
          return leftValue || await evaluate(node.right, context);
      }

    case 'UnaryExpression':
      const argument = await evaluate(node.argument, context);
      switch (node.operator) {
        case '+': return +argument;
        case '-': return -argument;
        case '!':
        case 'not':
          return !argument;
      }

    case 'AssignmentExpression':
      const value = await evaluate(node.right, context);
      if (node.left.type === 'Identifier') {
        context.variables[node.left.name] = value;
      } else if (node.left.type === 'MemberExpression') {
        const obj = await evaluate(node.left.object, context);
        obj[node.left.property] = value;
      }
      return value;

    case 'CallExpression':
      const func = await evaluate(node.callee, context);
      const args = await Promise.all(node.arguments.map(arg => evaluate(arg, context)));
      if (typeof func !== 'function') {
        throw new Error('Attempted to call non-function');
      }
      return func.apply(null, args);

    case 'MemberExpression':
      const object = await evaluate(node.object, context);
      return object[node.property];

    case 'ThisExpression':
      return context.this;

    case 'NewExpression':
      const constructor = await evaluate(node.callee, context);
      const constructorArgs = await Promise.all(node.arguments.map(arg => evaluate(arg, context)));
      return new constructor(...constructorArgs);

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

// Executor
async function execute(node, context) {
  switch (node.type) {
    case 'ExpressionStatement':
      return await evaluate(node.expression, context);

    case 'SpillStatement':
      const result = await evaluate(node.expression, context);
      console.log(result);
      return result;

    case 'HollaStatement':
      const prompt = await evaluate(node.prompt, context);
      return await context.input(prompt);

    case 'IfStatement':
      if (await evaluate(node.test, context)) {
        return await execute(node.consequent, context);
      } else if (node.alternate) {
        return await execute(node.alternate, context);
      }
      return null;

    case 'WhileStatement':
      while (await evaluate(node.test, context)) {
        try {
          await execute(node.body, context);
        } catch (e) {
          if (e === 'break') break;
          if (e === 'continue') continue;
          throw e;
        }
      }
      return null;

    case 'ForStatement':
      for (await execute(node.init, context);
           await evaluate(node.test, context);
           await evaluate(node.update, context)) {
        try {
          await execute(node.body, context);
        } catch (e) {
          if (e === 'break') break;
          if (e === 'continue') continue;
          throw e;
        }
      }
      return null;

    case 'FunctionDeclaration':
      context.variables[node.name] = function(...args) {
        const functionContext = { ...context, variables: { ...context.variables } };
        node.params.forEach((param, index) => {
          functionContext.variables[param] = args[index];
        });
        return execute(node.body, functionContext);
      };
      return null;

    case 'ReturnStatement':
      return await evaluate(node.argument, context);

    case 'ClassDeclaration':
      let superClass = node.superClass ? context.variables[node.superClass] : null;
      context.variables[node.name] = class extends superClass {
        constructor(...args) {
          super(...args);
          const classContext = { ...context, variables: { ...context.variables }, this: this };
          execute(node.body, classContext);
        }
      };
      return null;

    case 'BlockStatement':
      let blockResult = null;
      for (const statement of node.body) {
        blockResult = await execute(statement, context);
      }
      return blockResult;

    case 'BreakStatement':
      throw 'break';

    case 'ContinueStatement':
      throw 'continue';

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

// Main interpreter function
async function interpretBroLang(code, inputFunction = async (prompt) => prompt) {
  const tokens = tokenize(code);
  const ast = parse(tokens);
  const context = {
    variables: {},
    input: inputFunction
  };
  return await execute(ast, context);
}

// Export the interpreter
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interpretBroLang, tokenize, parse, evaluate, execute };
}

// Event listener for the Run button
document.getElementById('runButton').addEventListener('click', interpretBroLang);

