// Получение элементов, на которых будет отображаться выражение и результат
const expressionElement = document.getElementById("expression");
const resultElement = document.getElementById("result");

// Получение кнопок для цифр, операторов и скобок
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const bracketButtons = document.querySelectorAll(".bracket");

// кнопка равно
const calculateButton = document.getElementById("calculate");
// clear btn
const ac = document.querySelector(".ac");

// высчитываемое выражение
let expression = "";
expressionElement.textContent = "0";

// Назначение обработчиков событий для кнопок цифр
numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    // при нажатии кнопок цифр, знач будет заноситься в переменную выражения
    // и на странице в контенте
    expression += button.textContent;
    expressionElement.textContent = expression;
  });
});

// Назначение обработчиков событий для кнопок операторов
operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += " " + button.textContent + " ";
    expressionElement.textContent = expression;
  });
});

// Назначение обработчиков событий для кнопок скобок
bracketButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += " " + button.textContent + " ";
    expressionElement.textContent = expression;
  });
});

// Назначение обработчика события для кнопки "Calculate" =
calculateButton.addEventListener("click", () => {
  const result = evaluateExpression(expression);
  resultElement.textContent = result;
  expression = result.toString();
  expressionElement.textContent = expression;
});

// clear all будет очищать переменные при клике на кнопку ac
function clearAll() {
  expressionElement.textContent = '0';
  expression = '';
}

// Назначение обработчика события на кнопку "AC" для очистки
document.querySelector(".ac").onclick = clearAll;

// Функция для вычисления выражения
function evaluateExpression(expression) {
  try {
     // Преобразование выражения в массив токенов
    const tokens = expression.split(" ");
    const stack = [];

    // Обработка каждого токена в выражении
    for (const token of tokens) {
      if (!isNaN(token)) {
        stack.push(parseFloat(token));
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        // Обработка закрывающей скобки
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
    // Вычисление подвыражений и операций
    return evaluateSubExpression(stack);
  } catch (error) {
    return "Error";
  }
}
// Функция для вычисления подвыражения
function evaluateSubExpression(subExpression) {
  const operators = [];
  const operands = [];
// Обработка токенов в подвыражении
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
 // Выполнение оставшихся операций
  while (operators.length > 0) {
    const operator = operators.pop();
    const operand2 = operands.pop();
    const operand1 = operands.pop();
    operands.push(applyOperator(operator, operand1, operand2));
  }

  return operands[0];
}

// Определение приоритета операторов
function precedence(operator) {
  if (operator === "+" || operator === "-") {
    return 1;
  } else if (operator === "*" || operator === "/") {
    return 2;
  }
  return 0;
}
// Применение оператора к операндам
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