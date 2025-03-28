/*
* NUMBER BUTTONS HANDLER
*
* This file manages the interactions for the number buttons column in the dice roller app.
* It is responsible for handling button clicks, updating the number display,
* and processing backspace operations. The numbers entered here are used as multipliers
* for dice when dice buttons are clicked.
*
* This file:
* 1. Sets up event listeners for number buttons
* 2. Handles number button clicks to build numerical values
* 3. Manages the number output display
* 4. Provides backspace functionality for editing number input
* 5. Interfaces with dice button functionality via exported getter/setter methods
* 6. Supports quick dice quantity selection for dice roll operations
*
* Last updated: March 19, 2025
*/

let currentNumberValue = '';
const maxDigits = 3; // Maximum number of digits allowed
let isInitialized = false; // Flag to prevent multiple initialization

/**
 * Initialize the number buttons functionality
 */
export function setupNumberButtons() {
    // Prevent multiple initialization
    if (isInitialized) {
        console.log('Number buttons already initialized, skipping setup');
        return;
    }
    
    console.log('Setting up number buttons...');
    
    // Get all number buttons
    const numberButtonsEl = document.querySelectorAll('.number-button');
    const numberOutputEl = document.querySelector('.number-output');
    const clearLastDigitButtonEl = document.getElementById('number-backspace');
    
    // Remove any existing event listeners (just in case)
    numberButtonsEl.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Get the fresh buttons
    const freshButtonsEl = document.querySelectorAll('.number-button');
    
    // Add click event listeners to all number buttons
    freshButtonsEl.forEach(button => {
        button.addEventListener('click', (e) => {
            console.log(`Button ${button.dataset.value} clicked`);
            const value = button.dataset.value;
            handleNumberClick(value, numberOutputEl);
        });
    });
    
    // Clone and replace clear last digit button to remove any existing listeners
    if (clearLastDigitButtonEl) {
        const newClearLastDigit = clearLastDigitButtonEl.cloneNode(true);
        clearLastDigitButtonEl.parentNode.replaceChild(newClearLastDigit, clearLastDigitButtonEl);
        
        // Add click event listener to the new clear last digit button
        newClearLastDigit.addEventListener('click', () => {
            console.log('Clear last digit clicked');
            clearLastDigit(numberOutputEl);
        });
    }
    
    // Mark as initialized
    isInitialized = true;
    
    console.log('Number buttons initialized');
}

/**
 * Handle a number button click
 * @param {string} value - The number value clicked
 * @param {HTMLElement} outputElement - The element to display the number
 */
function handleNumberClick(value, outputElement) {
    console.log(`Handling click for ${value}, current value before: "${currentNumberValue}"`);
    
    // Check if we're at max digits
    if (currentNumberValue.length >= maxDigits) {
        console.log('Max digits reached, ignoring input');
        return;
    }
    
    // Add the new digit to the existing value
    currentNumberValue += value;
    console.log(`New current value: "${currentNumberValue}"`);
    
    // Update the display
    updateNumberDisplay(outputElement);
    
    // Optional: Add visual feedback to the button
    const buttonEl = document.querySelector(`.number-button[data-value="${value}"]`);
    if (buttonEl) {
        buttonEl.classList.add('active');
        setTimeout(() => {
            buttonEl.classList.remove('active');
        }, 150);
    }
}

/**
 * Remove the last digit entered in the number display
 * This is different from the keyboard backspace which clears the entire app
 * @param {HTMLElement} outputElement - The element displaying the number
 */
function clearLastDigit(outputElement) {
    console.log(`Clearing last digit, current value before: "${currentNumberValue}"`);
    
    // Remove the last character
    if (currentNumberValue.length > 0) {
        currentNumberValue = currentNumberValue.slice(0, -1);
        console.log(`New current value after clearing last digit: "${currentNumberValue}"`);
        updateNumberDisplay(outputElement);
    }
}

/**
 * Update the number display element
 * @param {HTMLElement} outputElement - The element to update
 */
function updateNumberDisplay(outputElement) {
    if (!outputElement) {
        console.error('Output element not found');
        return;
    }
    outputElement.textContent = currentNumberValue;
    console.log(`Display updated with: "${currentNumberValue}"`);
}

/**
 * Get the current number value
 * @returns {string} The current number value
 */
export function getCurrentNumberValue() {
    return currentNumberValue;
}

/**
 * Set the current number value
 * @param {string} value - The value to set
 */
export function setCurrentNumberValue(value) {
    // Validate that the input contains only digits
    if (!/^\d*$/.test(value)) {
        console.error('Invalid number value:', value);
        return;
    }
    
    // Ensure we don't exceed max digits
    currentNumberValue = value.slice(0, maxDigits);
    console.log(`Current value set externally to: "${currentNumberValue}"`);
    
    // Update the display
    const outputEl = document.querySelector('.number-output');
    if (outputEl) {
        updateNumberDisplay(outputEl);
    }
}

/**
 * Clear the current number value
 */
export function clearNumberValue() {
    currentNumberValue = '';
    console.log('Current value cleared');
    
    const outputEl = document.querySelector('.number-output');
    if (outputEl) {
        updateNumberDisplay(outputEl);
    }
}

// Add a CSS class for visual feedback on button press
document.addEventListener('DOMContentLoaded', () => {
    // Add active button styles if not already in CSS
    const style = document.createElement('style');
    style.textContent = `
        .number-button.active {
            background-color: #888 !important;
        }
    `;
    document.head.appendChild(style);
}); 