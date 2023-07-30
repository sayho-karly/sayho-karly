import {
  addClass,
  getNode,
  loadStorage,
  refError,
  removeClass,
  saveStorage,
} from '../lib/index.js';

const authBtn = getNode('.authBtn');
const signupBtn = getNode('.signupBtn');
const IdInput = getNode('.userIdInput');
const nameInput = getNode('.userNameInput');
const emailInput = getNode('.userEmailInput');
const PhoneInput = getNode('.userPhoneInput');
const searchAddress = getNode('.searchAddressBtn');
const passwordInput = getNode('.userPasswordInput');
const checkDuplicate = getNode('.checkDuplicateBtn');
const passwordCheckInput = getNode('.userCheckInput');

function validateInput(inputElement, validationFunction, target) {
  if (validationFunction(inputElement.value) || !inputElement.value) {
    addClass(target, 'hidden');
  } else {
    removeClass(target, 'hidden');
  }
}

function handleCheckPwd(e) {
  const errorMessage = e.target.nextElementSibling;
  if (passwordInput.value !== passwordCheckInput.value) {
    removeClass(errorMessage, 'hidden');
  } else {
    addClass(errorMessage, 'hidden');
  }
}
function addValidateForInputEvent(input, inputReg) {
  return input.addEventListener('input', () =>
    validateInput(input, inputReg, input.nextElementSibling)
  );
}

function handleCheckValidation(e) {
  const errorMessage = e.target.nextElementSibling;
  if (hasNumber(nameInput.value)) {
    removeClass(errorMessage, 'hidden');
  } else {
    addClass(errorMessage, 'hidden');
  }
}

function handleCheckNumeric(e) {
  const inputValue = e.target.value;

  // 숫자 이외의 문자를 제거하여 숫자만 남깁니다.
  const numericValue = inputValue.replace(/\D/g, '');
  // 숫자만 남은 값을 input 요소에 설정합니다.
  e.target.value = numericValue;

  if (e.target.value) {
    removeClass(authBtn, 'disabled:border-gray-300');
    removeClass(authBtn, 'disabled:font-semibold');
    removeClass(authBtn, 'disabled:text-gray-300');
  } else {
    addClass(authBtn, 'disabled:border-gray-300');
    addClass(authBtn, 'disabled:font-semibold');
    addClass(authBtn, 'disabled:text-gray-300');
  }
}

function handleRegister() {
  const Id = IdInput.value;
  const password = passwordInput.value;
  const UID = generateRandomID(10);

  if (!Id || !password || !emailInput || !nameInput || !PhoneInput) {
    refError('필수 입력값을 입력해주세요');
  } else {
    saveStorage(Id, { pwd: password, uniqueID: UID });
  }
}

function handleCheckDuplicate() {
  const Id = IdInput.value
  loadStorage(Id).then((res) => {
    if(!res) {
      return
    }
    alert('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
  });
}


function openLinkInPopup(e) {
  e.preventDefault();
  const url = 'https://www.kurly.com/address/shipping-address';
  window.open(url, '_blank', 'width=500, height=400');
}

function hasNumber(text) {
  if (typeof text !== 'string') {
    return false;
  }

  const regex = /\d/;
  return regex.test(text);
}

function emailReg(text) {
  const RegExr =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return RegExr.test(String(text).toLowerCase());
}

function pwReg(text) {
  const RegExr = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$/;
  return RegExr.test(String(text).toLowerCase());
}

addValidateForInputEvent(IdInput, emailReg);
addValidateForInputEvent(passwordInput, pwReg);
addValidateForInputEvent(emailInput, emailReg);
passwordCheckInput.addEventListener('input', handleCheckPwd);
nameInput.addEventListener('input', handleCheckValidation);
PhoneInput.addEventListener('input', handleCheckNumeric);
searchAddress.addEventListener('click', openLinkInPopup);
signupBtn.addEventListener('click', handleRegister);
checkDuplicate.addEventListener('click', handleCheckDuplicate)

function generateRandomID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomID = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomID += characters[randomIndex];
  }

  return randomID;
}