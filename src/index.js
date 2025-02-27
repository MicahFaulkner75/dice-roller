import './styles.css';
import { setupEventListeners } from './event-handlers';
import { setupDiceInput, setupDiceButtons, updateDisplay } from './ui-updates';
import { makeDraggable } from './make-draggable';

// Initialize all UI components when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set up core UI event listeners
    setupEventListeners();
    setupDiceInput();
    setupDiceButtons();
    
    // Initialize draggable functionality
    const applet = document.getElementById('dice-applet');
    if (applet) {
        makeDraggable(applet);
        // Set initial state of applet to hidden
        applet.style.display = 'none';
    }

    // Initialize the display
    updateDisplay();
});

// Export UI functions for potential use in other modules
export { setupDiceInput, setupDiceButtons, updateDisplay } from './ui-updates';
export { animateDiceIcons, animateResults } from './animations/dice-animations';
export { formatModifier, formatDiceInput } from './utils/formatting';