document.body.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');

const KEYBOARD = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    config: {
      ru: [
        'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
        'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
        'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
        'lang', ' ',
      ],
      en: [
        '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
        'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
        'lang', ' ',
      ],
      ruShift: [
        'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
        'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/',
        'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter',
        'shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',',
        'lang', ' ',
      ],
      enShift: [
        '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
        'caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter',
        'shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?',
        'lang', ' ',
      ],
    },
  },

  settings: {
    capsLock: null,
    shift: false,
    english: null,
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'hidden');
    this.elements.keysContainer.className = 'keyboard__keys';
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);



    if (localStorage.capsLock === 'true') {
      this.toggleCapsLock();
      document.querySelector('#Caps').classList.toggle(this.settings.capsLock);
    }
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    // cоздает новый пустой DocumentFragment
    let keyConfig = [];

    // загрузка языков
    if (localStorage.english === 'false') {
      this.settings.english = false;
      keyConfig = this.elements.config.ru;
    } else {
      this.settings.english = true;
      keyConfig = this.elements.config.en;
    }

    // создание кнопок
    keyConfig.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.addEventListener('click', () => {
        textarea.focus();
      });

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Backspace';

          keyElement.addEventListener('click', () => {
            if (textarea.selectionStart === 0 && textarea.selectionEnd === textarea.selectionStart) {
              return;
            }
            if (textarea.selectionEnd === textarea.selectionStart) {
              // setRangeText() заменяет в инпуте или текстариа на новый стринг
              textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
            } else {
              textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd, 'end');
            }
          });
          break;
          

        case 'caps':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'CapsLock';
          

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.settings.capsLock);
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Shift';
         
          keyElement.addEventListener('mousedown', () => {
              this.shiftPress(); 
              keyElement.classList.add("keyboard__key--active")
          });
          keyElement.addEventListener('mouseup', () => {
            this.shiftUnpress();
            keyElement.classList.remove("keyboard__key--active")
          });
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = this.settings.english ? 'EN' : 'RU';
          keyElement.id = "lang";
          
          keyElement.addEventListener('click', () => {
            this.toggleLang();
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Enter';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case ' ':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent.value += ' ';
          

          keyElement.addEventListener('click', () => {
            textarea.setRangeText(' ', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            textarea.setRangeText(keyElement.textContent, textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },


  toggleCapsLock() {
    this.settings.capsLock = !this.settings.capsLock;
    localStorage.capsLock = this.settings.capsLock;

    this.elements.keys.forEach((key) => {
      const resultKey = key;
      if (key.textContent.length === 1) {
        resultKey.textContent = this.settings.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
      return resultKey;
    });
  },

  toggleLang() {
    const { ru, ruShift, en, enShift } = this.elements.config;
    const { capsLock, shift, english } = this.settings;
    const { keys } = this.elements;
    const langButtonText = document.getElementById('lang').textContent;

    for (let i = 0; i < keys.length; i += 1) {
      const IsSymbol = en[i].length === 1;
      // изменение симвл
      if (IsSymbol) {
        if (english) {
          if (capsLock) {
            keys[i].textContent = shift ? ruShift[i] : ru[i].toUpperCase();
          } else {
            keys[i].textContent = shift ? ruShift[i] : ru[i];
          }
        }
        if (!english) {
          if (capsLock) {
            keys[i].textContent = shift ? enShift[i] : en[i].toUpperCase();
          } else {
            keys[i].textContent = shift ? enShift[i] : en[i];
          }
        }
      }
    }

    if (langButtonText === 'EN') {
      document.getElementById('lang').textContent = 'RU';
    } else document.getElementById('lang').textContent = 'EN';

    localStorage.setItem('english', !this.settings.english);
    this.settings.english = !this.settings.english;
  },


  shiftPress() {
    const { en, ruShift, enShift } = this.elements.config;
    const { keys } = this.elements;
    const { english } = this.settings;
    for (let i = 0; i < keys.length; i += 1) {
      const IsSymbol = en[i].length === 1;
      // измененяю на символы
      if (IsSymbol) {
        if (english) {
          keys[i].textContent = enShift[i];
        } else {
          keys[i].textContent = ruShift[i];
        }
      }
    }
    this.settings.shift = true; // позволяет менять язык с зажатым шифтом и символы меняются
  },

  shiftUnpress() {
    const { ru, en } = this.elements.config;
    const { keys } = this.elements;
    const { capsLock, english } = this.settings;

    for (let i = 0; i < keys.length; i += 1) {
      const IsSymbol = en[i].length === 1;
      // символы
      if (IsSymbol) {
        if (english) {
          keys[i].textContent = capsLock ? en[i].toUpperCase() : en[i];
        }
        if (!english) {
          keys[i].textContent = capsLock ? ru[i].toUpperCase() : ru[i];
        }
      }
    }
    this.settings.shift = false;
  },
};

window.addEventListener('DOMContentLoaded', () => {
  KEYBOARD.init();
  textarea.focus();
});
