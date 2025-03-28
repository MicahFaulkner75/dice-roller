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
* 4. Provides documentation on application features including GM tools
*
* Last updated: March 20, 2025
*/

/**
 * Help popup functionality
 * 
 * This file handles all logic related to the help popup, including showing/hiding
 * the popup, positioning it relative to the applet, and managing keyboard shortcuts.
 */

// Store references to key elements
let helpButtonEl = null;
let helpPopupEl = null;
let appletEl = null;

// Track if the popup is shown
let helpShown = false;

/**
 * Initialize the help popup functionality
 */
export function initializeHelpSystem() {
    console.log('Initializing help popup handler');
    
    // Get references to DOM elements
    helpButtonEl = document.querySelector('.help-button');
    helpPopupEl = document.querySelector('.help-popup');
    appletEl = document.getElementById('dice-applet');
    
    if (!helpButtonEl || !helpPopupEl) {
        console.error('Help elements not found in the DOM');
        return;
    }
    
    // Set up the help content
    createHelpContent();
    
    // Set up event listeners
    helpButtonEl.addEventListener('click', toggleHelpPopup);
    
    // Listen for ESC key to close the popup
    document.addEventListener('keydown', (e) => {
        if (helpShown && (e.key === 'Escape' || e.key === ' ')) {
            hideHelpPopup();
        }
    });
    
    // Listen for clicks outside the help popup
    document.addEventListener('click', (e) => {
        if (helpShown && !helpPopupEl.contains(e.target) && !helpButtonEl.contains(e.target)) {
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
    if (!helpPopupEl) return;
    
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
                
                <div class="help-section">
                    <h3>GM Features</h3>
                    <p>The dice roller includes hidden fudge buttons. Tap one, then roll the die you want to affect.</p>
                    <ul>
                        <li><strong>Top Right Modifier:</strong> Critical Failure</li>
                        <li><strong>Bottom Right Modifier:</strong> Critical Success</li>
                        <li><strong>"Total":</strong> High Roll - forces result >75% of maximum</li>
                        <li><strong>Total Output:</strong> Low Roll - forces result <50% of maximum</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Update the popup content
    helpPopupEl.innerHTML = content;
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
    helpPopupEl.classList.add('show');
    helpShown = true;
    updatePopupPosition();
}

/**
 * Hide the help popup
 */
export function hideHelpPopup() {
    console.log('Hiding help popup');
    if (helpPopupEl) {
        helpPopupEl.classList.remove('show');
        helpShown = false;
    }
}

/**
 * Update the position of the help popup relative to the applet
 */
function updatePopupPosition() {
    if (!appletEl || !helpPopupEl) return;
    
    // Get the applet's position
    const appletRect = appletEl.getBoundingClientRect();
    
    // Position the popup below the header, centered horizontally
    const headerHeight = 24; // Height of the header in pixels
    
    // Calculate position
    const popupLeft = appletRect.left + appletRect.width/2 - helpPopupEl.offsetWidth/2 - 2; // Subtract 2px to move left
    const popupTop = appletRect.top + headerHeight;
    
    // Set the popup position
    helpPopupEl.style.left = `${popupLeft}px`;
    helpPopupEl.style.top = `${popupTop}px`;
} 