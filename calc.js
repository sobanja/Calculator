const expressionElement = document.getElementById("expression");
const resultElement = document.getElementById("result");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const parenthesisButtons = document.querySelectorAll(".parenthesis");
const calculateButton = document.getElementById("calculate");

let expression = "";

numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += button.textContent;
    expressionElement.textContent = expression;
  });
});

operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += " " + button.textContent + " ";
    expressionElement.textContent = expression;
  });
});

parenthesisButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += " " + button.textContent + " ";
    expressionElement.textContent = expression;
  });
});

calculateButton.addEventListener("click", () => {
  const result = evaluateExpression(expression);
  resultElement.textContent = result;
  expression = result.toString();
  expressionElement.textContent = expression;
});

function evaluateExpression(expression) {
  try {
    // Implementing a simple stack-based expression evaluator
    const tokens = expression.split(" ");
    const stack = [];

    for (const token of tokens) {
      if (!isNaN(token)) {
        stack.push(parseFloat(token));
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        let subExpression = [];
        while (stack.length > 0 && stack[stack.length - 1] !== "(") {
          subExpression.unshift(stack.pop());
        }
        stack.pop(); // Pop the "("
        stack.push(evaluateSubExpression(subExpression));
      } else if (token === "+" || token === "-" || token === "*" || token === "/") {
        stack.push(token);
      }
    }

    return evaluateSubExpression(stack);
  } catch (error) {
    return "Error";
  }
}

function evaluateSubExpression(subExpression) {
  const operators = [];
  const operands = [];

  for (const token of subExpression) {
    if (!isNaN(token)) {
      operands.push(token);
    } else if (token === "+" || token === "-" || token === "*" || token === "/") {
      while (operators.length > 0 && precedence(operators[operators.length - 1]) >= precedence(token)) {
        const operator = operators.pop();
        const operand2 = operands.pop();
        const operand1 = operands.pop();
        operands.push(applyOperator(operator, operand1, operand2));
      }
      operators.push(token);
    }
  }

  while (operators.length > 0) {
    const operator = operators.pop();
    const operand2 = operands.pop();
    const operand1 = operands.pop();
    operands.push(applyOperator(operator, operand1, operand2));
  }

  return operands[0];
}

function precedence(operator) {
  if (operator === "+" || operator === "-") {
    return 1;
  } else if (operator === "*" || operator === "/") {
    return 2;
  }
  return 0;
}

function applyOperator(operator, operand1, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
  }
}