// первый символ
let a = "";
// второй
let b = "";
// знак операции
let sign = "";

let finish = false;
//будем проверять какие символы содержатся
const simbol = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const action = ["-", "+", "X", "/"];

// экран
const out = document.querySelector(".calc-screen p");

// clear all будет очищать переменные при клике на кнопку ac
function clearAll() {
  a = "";
  b = "";
  sign = "";
  finish = false;
  // тут находится начальное значение для экрана
  out.textContent = 0;
}

document.querySelector(".ac").onclick = clearAll;

document.querySelector(".buttons").onclick = (event) => {
  // если клик был на поле (вне кнопок) тогда ничего не будет
  if (!event.target.classList.contains("btn")) return;
  // нажата кнопка ac
  if (event.target.classList.contains("ac")) return;

  out.textContent = "";
  // получаю нажатую кнопку
  const key = event.target.textContent;

  //если нажата кнопка 0-9 или . то заносим значение в переменную с 1ым символом
  if (simbol.includes(key)) {
    // если перем для 2 символа и для знаков пусты, значит мы работает с 1 символом
    if (b === "" && sign === "") {
      a += key;
      // заносим значение на экран (которое нажали)
      out.textContent = a;
      // если произошло вычисление, знач пусты, но финиш true
    } else if (a !== "" && b !== "" && finish) {
      b = key;
      finish = false;
      out.textContent = b;
      // заношу в б, если был нажат знак
    } else {
      b += key;
      out.textContent = b;
    }
    return;
  }
  // проверяем если нажаты кнопки символов
  // если true то на экран выводим значение переменной sign (там будет нажатый символ)
  if (action.includes(key)) {
    sign = key;
    out.textContent = sign;
    console.log(sign);
    return;
  }

  // нажато равно
  if (key === "=") {
    // чтобы можно было считать число + =
    if (b === '') b = a;
    // в случае есть оператор +, то складываем 1 и 2 значение
    switch (sign) {
      case "+":
        // тк строки, чтобы не было конкатенации, пишем ()
        a = (+a) + (+b);
        break;
      case "-":
        a = a - b;
        break;
      case "X":
        a = a * b;
        break;
      case "/":
        if (b === '0') {
          out.textContent = 'Ошибка'
          a = '';
          b = '';
          sign = '';
          return;
        }
        a = a / b;
        break;
    }
    // ВЫЧИСЛЕНИЯ ОКОНЧЕНЫ
    finish = true;
    // выводим вычисл на экран
    out.textContent = a;
  }
};
