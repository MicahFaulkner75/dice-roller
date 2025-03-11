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
import { setupEventListeners } from './event-handlers';
import { setupDiceInput, setupDiceButtons, updateDisplay } from './ui-updates';
import { makeDraggable } from './make-draggable';

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
    const applet = document.getElementById('dice-applet');
    
    // Set initial state explicitly
    applet.style.display = 'none';
    
    // Add click handler for launch button
    launchButton.addEventListener('click', () => {
        const isHidden = applet.style.display === 'none';
        applet.style.display = isHidden ? 'flex' : 'none';
    });

    // Make the applet draggable
    makeDraggable(applet);
});

// Export UI functions for potential use in other modules
export { setupDiceInput, setupDiceButtons, updateDisplay } from './ui-updates';
export { animateDiceIcons, animateResults } from './animations/dice-animations';
export { formatModifier, formatDiceInput } from './utils/formatting';

