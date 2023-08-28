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
        // если текущ токен является числом, то добавялем его в стэк операндов 
        stack.push(parseFloat(token));
      } else if (token === "(") {
        // если токен явл открыв скобкой, то добавляем его в стэк операторов
        // это начало выражения, которе надо вычислить в первую очередь
        stack.push(token);
      } else if (token === ")") {
        // Обработка закрывающей скобки, добавл в подвыражение
        let subExpression = [];
        // извлекаем токены из стэка, пока не найдем открыв скобку
        // чтобы мы ее удалили, и все выражение можно было посчитать например 2 + (2 + 2) => 2 + 4
        while (stack.length > 0 && stack[stack.length - 1] !== "(") {
          subExpression.unshift(stack.pop());
        }
        stack.pop(); // Pop the "("
        // вычилсяем результат с помощью функции
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
  // стэк для операторов
  const operators = [];
  // стэк для операндов
  const operands = [];
// Обработка токенов в подвыражении
  for (const token of subExpression) {
    // если токен число, пушим в операнды
    if (!isNaN(token)) {
      operands.push(token);
       // Если токен оператор +, -, *, или /, вып операции с операторами и операндами
    } else if (token === "+" || token === "-" || token === "*" || token === "/") {
      // выполняем операции в порядке приоритета, пока оператор в стеке operators 
      // имеет больший или равный приоритет, чем текущий оператор
      while (operators.length > 0 && precedence(operators[operators.length - 1]) >= precedence(token)) {
        // Извлекаем последний оператор из стека операторов
        const operator = operators.pop();
        // Извлекаем последний операнд из стека операндов
        const operand2 = operands.pop();
        // извлекаем предидущий операнд из стэка операндов
        const operand1 = operands.pop();
        // выпо операцию между 1 и 2 операндом, исп оператор и функцию приминения оператора
        operands.push(applyOperator(operator, operand1, operand2));
      }
      // после добавляем его в стэк
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
  // Низкий приоритет для + и -
  if (operator === "+" || operator === "-") {
    return 1;
  // более высокий приоритет
  } else if (operator === "*" || operator === "/") {
    return 2;
  }
  // наименьший приоритет для остальных операторов 
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