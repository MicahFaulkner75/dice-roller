/*
* APPLICATION ENTRY POINT
*
* This file serves as the main entry point for the dice roller application.
* It is responsible for initializing all components, setting up the UI, and
* exporting key functionality for use throughout the application.
*
* This file:
* 1. Imports and applies CSS styles
* 2. Sets up debug mode functionality (setupDebugMode)
* 3. Initializes all UI components on document load
* 4. Sets up number buttons functionality
* 5. Sets up help popup functionality
* 6. Configures the launch button and applet display
* 7. Makes the applet draggable
* 8. Exports essential UI functions for use in other modules
*
* Last updated: March 19, 2025
*/

import './styles.css';
import { setupEventListeners } from './ui/button-handler';
import { setupDiceInput, setupDiceButtons } from './ui-updates';
import { makeDraggable } from './make-draggable';
import { 
  toggleApplet, 
  centerApplet, 
  minimizeApplet,
  resetApplet
} from './core-functions';
// Import the number buttons functionality
import { setupNumberButtons } from './number-buttons';
// Import the help popup functionality
import { initializeHelpSystem } from './help';
import { initDisplayModule } from './ui/display';

// Add debug border toggle functionality
function setupDebugMode() {
    document.addEventListener('keydown', (e) => {
        // Toggle debug borders with Command + B (metaKey on Mac)
        if (e.metaKey && e.key.toLowerCase() === 'b') {
            e.preventDefault(); // Prevent browser's default bookmark action
            const appletEl = document.getElementById('dice-applet');
            appletEl.classList.toggle('debug-borders');
            console.log('Debug borders:', appletEl.classList.contains('debug-borders') ? 'ON' : 'OFF');
        }
    });
}

// Initialize all UI components when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM fully loaded and parsed'); // find_me
    setupUI();
    setupEventListeners();
    setupDiceInput();
    setupDiceButtons();
    setupDebugMode();
    // Initialize number buttons
    setupNumberButtons();
    // Initialize help popup
    initializeHelpSystem();
    
    // Get the launch button and applet
    const launchButtonEl = document.getElementById('dice-roller-button');
    
    // Initialize applet state - hide and center it using core functions
    minimizeApplet();
    centerApplet(); // Only center during initial setup
    
    // Add click handler for launch button
    launchButtonEl.addEventListener('click', () => {
        // Use core function to toggle applet visibility
        // Don't center when toggling to preserve position
        toggleApplet(false);
    });

    // Make the applet draggable
    const appletEl = document.getElementById('dice-applet');
    makeDraggable(appletEl);
    
    // Reset applet to initial state
    resetApplet();
    
    // Initialize display module
    initDisplayModule(); // Initialize display module with scroll handler
    
    // Log that initialization is complete for testing
    console.log("Dice roller initialized with new applet state management");
});

// Export UI functions from ui-updates.js
export { setupDiceInput, setupDiceButtons } from './ui-updates';

// Export number buttons functions
export { 
    getCurrentNumberValue, 
    setCurrentNumberValue, 
    clearNumberValue
} from './number-buttons';

// Export help popup functions
export {
    showHelpPopup,
    hideHelpPopup,
    toggleHelpPopup
} from './help';

// Export core functions for potential use in other modules
export {
    rollSpecificDie,
    rollPercentileDie,
    rollNonStandardDie,
    rerollAllDice,
    clearDicePool,
    resetApplet,
    adjustModifier,
    setModifierValue,
    processNotation,
    animateDiceRoll,
    minimizeApplet,
    toggleApplet,
    activatePercentileMode,
    // Additional applet state functions
    centerApplet,
    showApplet
} from './core-functions';

// Other utility exports
export { formatModifier, formatDiceInput } from './utils/formatting';

