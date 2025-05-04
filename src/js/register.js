// DOM selectors and CSS classes
const SELECTORS = {
    FORM: 'form',
    USERNAME: '#userName',
    PASSWORD: '#password',
    CONFIRM_PASSWORD: '#confirmPassword',
    ERROR: '.error'
};

const CLASSES = {
    ERROR: 'border-red-500',
    SUCCESS: 'border-[#8E51FF]',
    HIDDEN: 'hidden',
    ERROR_TEXT: 'text-red-500 text-sm mt-1'
};

// API Config
const API = {
    URL: 'http://localhost:3000/auth/register',
    HEADERS: {
        "Content-Type": "application/json"
    }
};

// DOM Elements
const form = document.querySelector(SELECTORS.FORM);
const userName = document.querySelector(SELECTORS.USERNAME);
const password = document.querySelector(SELECTORS.PASSWORD);
const confirmPassword = document.querySelector(SELECTORS.CONFIRM_PASSWORD);


// Validate single field
const validateField = (element, value, minLength = 0) => {
    if (!value.trim()) {
        showError(element, `لطفا ${element.placeholder} را وارد کنید.`);
        return false;
    }
    
    if (minLength > 0 && value.length < minLength) {
        showError(element, `${element.placeholder} باید حداقل ${minLength} کاراکتر باشد.`);
        return false;
    }
    
    setSuccess(element);
    return true;
};

// Check password match
const validatePasswordMatch = (password, confirmPassword) => {
    if (confirmPassword.value !== password.value) {
        showError(confirmPassword, "رمز عبور مطابقت ندارد");
        return false;
    }
    return true;
};

// Validate entire form
const validateForm = () => {
    let isValid = true;
    
    isValid &= validateField(userName, userName.value);
    isValid &= validateField(password, password.value, 4);
    isValid &= validateField(confirmPassword, confirmPassword.value);
    
    if (isValid) {
        isValid &= validatePasswordMatch(password, confirmPassword);
    }
    
    return isValid;
};


// Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    try {
        const formData = {
            username: userName.value.trim(),
            password: password.value.trim(),
            confirmPassword: confirmPassword.value.trim()
        };
    
        const response = await fetch(API.URL, {
            method: "POST",
            headers: API.HEADERS,
            body: JSON.stringify(formData)
        });
    
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'خطا در ثبت نام');
        }
    
        alert("ثبت نام شما با موفقیت انجام شد!");
        window.location.href = "../LoginForm.html";
    
    } catch (error) {
        console.error('خطا:', error);
        alert("خطا در ثبت نام: " + error.message);
    }
};


// Show validation error
const showError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(SELECTORS.ERROR);
    
    element.classList.add(CLASSES.ERROR);
    element.classList.remove(CLASSES.SUCCESS);
    
    errorDisplay.textContent = message;
    errorDisplay.classList.add(...CLASSES.ERROR_TEXT.split(' '));
    errorDisplay.classList.remove(CLASSES.HIDDEN);
};


// Mark field as valid
const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(SELECTORS.ERROR);
    
    element.classList.remove(CLASSES.ERROR);
    element.classList.add(CLASSES.SUCCESS);
    
    errorDisplay.textContent = '';
    errorDisplay.classList.add(CLASSES.HIDDEN);
};


// Real-time validation
userName.addEventListener('input', () => validateField(userName, userName.value));
password.addEventListener('input', () => validateField(password, password.value, 4));
confirmPassword.addEventListener('input', () => {
    validateField(confirmPassword, confirmPassword.value);
    if (password.value) validatePasswordMatch(password, confirmPassword);
});


form.addEventListener('submit', handleSubmit);
