/*
* HELP POPUP HANDLER
*
* This file manages the help popup functionality for the dice roller app.
* It is responsible for showing and hiding the help popup when the help button is clicked.
*
* This file:
* 1. Sets up event listeners for the help button and close button
* 2. Handles showing and hiding the help popup
* 3. Manages keyboard shortcuts related to the help popup
*
* Last updated: March 19, 2025
*/

/**
 * Help popup functionality
 * 
 * This file handles all logic related to the help popup, including showing/hiding
 * the popup, positioning it relative to the applet, and managing keyboard shortcuts.
 */

// Store references to key elements
let helpButton;
let helpPopup;
let applet;

// Track if the popup is shown
let helpShown = false;

/**
 * Initialize the help popup functionality
 */
export function setupHelpPopup() {
    console.log('Initializing help popup handler');
    
    // Get references to DOM elements
    helpButton = document.querySelector('.help-button');
    helpPopup = document.querySelector('.help-popup');
    applet = document.getElementById('dice-applet');
    
    if (!helpButton || !helpPopup) {
        console.error('Help elements not found in the DOM');
        return;
    }
    
    // Set up the help content
    createHelpContent();
    
    // Set up event listeners
    helpButton.addEventListener('click', toggleHelpPopup);
    
    // Listen for ESC key to close the popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpShown) {
            hideHelpPopup();
        }
    });
    
    // Track applet movements to update popup position
    document.addEventListener('mousemove', updatePopupPosition);
    document.addEventListener('mouseup', updatePopupPosition);
    
    // Initial positioning
    updatePopupPosition();
}

/**
 * Create the help content with the specified sections
 */
function createHelpContent() {
    if (!helpPopup) return;
    
    // Create the content structure
    const content = `
        <div class="help-content">
            <div class="help-header">
                <h2>Dice Roller Help</h2>
            </div>
            <div class="help-body">
                <div class="help-section">
                    <h3>Buttons</h3>
                    <p><strong>Dice Buttons:</strong> Click any die, it rolls and is added to the dice pool.</p>
                    <p><strong>Number Buttons:</strong> Quick-build dice rolls. Choose the amount, then click the dice-type you're rolling.</p>
                    <p><strong>Clear Button:</strong> Clear the app.</p>
                    <p><strong>Roll Button:</strong> Roll all the dice.</p>
                    <p><strong>Modifiers:</strong> Click the buttons to add or subtract from the modifier.</p>
                    <p><strong>Percentile Dice:</strong> Long-click or double-click the d10 die icon and roll traditional percentiles.</p>
                </div>
                
                <div class="help-section">
                    <h3>Keyboard Shortcuts</h3>
                    <p><strong>Enter:</strong> Roll the dice.</p>
                    <p><strong>Backspace:</strong> Clear the applet.</p>
                    <p><strong>Spacebar:</strong> Show or minimize the applet.</p>
                    <p><strong>Escape:</strong> Close the applet.</p>
                </div>
                
                <div class="help-section">
                    <h3>Input Bar</h3>
                    <p>Type in whatever dice nomenclature you'd like to roll.</p>
                </div>
            </div>
        </div>
    `;
    
    // Update the popup content
    helpPopup.innerHTML = content;
}

/**
 * Toggle the help popup visibility
 */
export function toggleHelpPopup() {
    if (helpShown) {
        hideHelpPopup();
    } else {
        showHelpPopup();
    }
}

/**
 * Show the help popup
 */
export function showHelpPopup() {
    console.log('Showing help popup');
    helpPopup.classList.add('show');
    helpShown = true;
    updatePopupPosition();
}

/**
 * Hide the help popup
 */
export function hideHelpPopup() {
    console.log('Hiding help popup');
    helpPopup.classList.remove('show');
    helpShown = false;
}

/**
 * Update the position of the help popup relative to the applet
 */
function updatePopupPosition() {
    if (!applet || !helpPopup) return;
    
    // Get the applet's position
    const appletRect = applet.getBoundingClientRect();
    
    // Position the popup below the header, centered horizontally
    const headerHeight = 24; // Height of the header in pixels
    
    // Calculate position
    const popupLeft = appletRect.left + appletRect.width/2 - helpPopup.offsetWidth/2 - 2; // Subtract 2px to move left
    const popupTop = appletRect.top + headerHeight;
    
    // Set the popup position
    helpPopup.style.left = `${popupLeft}px`;
    helpPopup.style.top = `${popupTop}px`;
} 