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
* 4. Configures the launch button and applet display
* 5. Makes the applet draggable
* 6. Exports essential UI functions for use in other modules
*/

import './styles.css';
import { setupEventListeners } from './ui/button-handler';
import { setupDiceInput, setupDiceButtons } from './ui-updates';
import { makeDraggable } from './make-draggable';
import { 
  toggleApplet, 
  centerApplet, 
  minimizeApplet 
} from './core-functions';

// Add debug border toggle functionality
function setupDebugMode() {
    document.addEventListener('keydown', (e) => {
        // Toggle debug borders with Command + B (metaKey on Mac)
        if (e.metaKey && e.key.toLowerCase() === 'b') {
            e.preventDefault(); // Prevent browser's default bookmark action
            const applet = document.getElementById('dice-applet');
            applet.classList.toggle('debug-borders');
            console.log('Debug borders:', applet.classList.contains('debug-borders') ? 'ON' : 'OFF');
        }
    });
}

// Initialize all UI components when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    setupEventListeners();
    setupDiceInput();
    setupDiceButtons();
    setupDebugMode();
    
    // Get the launch button and applet
    const launchButton = document.getElementById('dice-roller-button');
    
    // Initialize applet state - hide and center it using core functions
    minimizeApplet();
    centerApplet(); // Only center during initial setup
    
    // Add click handler for launch button
    launchButton.addEventListener('click', () => {
        // Use core function to toggle applet visibility
        // Don't center when toggling to preserve position
        toggleApplet(false);
    });

    // Make the applet draggable
    const applet = document.getElementById('dice-applet');
    makeDraggable(applet);
    
    // Log that initialization is complete for testing
    console.log("Dice roller initialized with new applet state management");
});

// Export UI functions from ui-updates.js
export { setupDiceInput, setupDiceButtons } from './ui-updates';

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

