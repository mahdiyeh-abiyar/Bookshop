// Constants
const SELECTORS = {
  FORM: 'form',
  USERNAME: '#userName',
  PASSWORD: '#password',
  ERROR: '.error',
  LOADING: '.loading'
};

const CLASSES = {
  ERROR: 'border-red-500',
  HIDDEN: 'hidden',
  ERROR_TEXT: 'text-red-500 text-sm mt-1',
  LOADING_VISIBLE: 'block'
};

// API Config
const API = {
  URL: 'http://localhost:3000/auth/login',
  HEADERS: {
      "Content-Type": "application/json"
  }
};

// Token Service
const TokenService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
};

// DOM Elements
const form = document.querySelector(SELECTORS.FORM);
const userName = document.querySelector(SELECTORS.USERNAME);
const password = document.querySelector(SELECTORS.PASSWORD);
const errorEl = document.querySelector(SELECTORS.ERROR);
const loadingEl = document.querySelector(SELECTORS.LOADING);



// Show validation error
const showError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(SELECTORS.ERROR);
  
  element.classList.add(CLASSES.ERROR);
  errorDisplay.textContent = message;
  errorDisplay.classList.remove(CLASSES.HIDDEN);
  
  setTimeout(() => {
      hideError(element);
  }, 5000);
};

// Hide error
const hideError = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(SELECTORS.ERROR);
  
  element.classList.remove(CLASSES.ERROR);
  errorDisplay.classList.add(CLASSES.HIDDEN);
};

// Validate single field
const validateField = (element, value, minLength = 0) => {
  if (!value.trim()) {
      showError(element, `لطفاً ${element.placeholder} را وارد کنید`);
      return false;
  }
  
  if (minLength > 0 && value.length < minLength) {
      showError(element, `${element.placeholder} باید حداقل ${minLength} کاراکتر باشد`);
      return false;
  }
  
  hideError(element);
  return true;
};

// Validate entire form
const validateForm = () => {
  let isValid = true;
  
  isValid &= validateField(userName, userName.value);
  isValid &= validateField(password, password.value, 4);
  
  return isValid;
};

// Show loading state
const showLoading = () => {
  loadingEl.classList.add(CLASSES.LOADING_VISIBLE);
  loadingEl.classList.remove(CLASSES.HIDDEN);
};

// Hide loading state
const hideLoading = () => {
  loadingEl.classList.remove(CLASSES.LOADING_VISIBLE);
  loadingEl.classList.add(CLASSES.HIDDEN);
};

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!validateForm()) return;
  
  try {
      showLoading();
      
      const response = await fetch(API.URL, {
          method: 'POST',
          headers: API.HEADERS,
          body: JSON.stringify({
              username: userName.value,
              password: password.value
          })
      });

      // console.log('Response status:', response.status);
      const data = await response.json();
      // console.log(data);
      
      if (!response.ok) {
          throw new Error(data.message || 'نام کاربری یا رمز عبور اشتباه است');
      }
      
      TokenService.setToken(data.token);
      window.location.href = '/src/ProductsList.html';
      // console.log('Token:', data.token);
      alert("ورود شما با موفقیت انجام شد!");
      
  } catch (error) {
      showError(password, error.message);
  } finally {
      hideLoading();
  }
};

// Event Listeners
form.addEventListener('submit', handleSubmit);

// Clear errors on input
userName.addEventListener('input', () => hideError(userName));
password.addEventListener('input', () => hideError(password));
