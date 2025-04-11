// This file bundles all dice roller components
// In a real implementation, you would import all your modules here
// import './index';

// Initialize the dice roller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get mount point
    const mountPoint = document.getElementById('dice-roller-mount');
    if (!mountPoint) return;
    
    // Get settings from WordPress
    const settings = window.diceRollerSettings || {};
    
    // Initialize dice roller with error handling
    try {
        initializeDiceRoller(mountPoint, settings);
    } catch (error) {
        console.error('Failed to initialize dice roller:', error);
        // Provide fallback behavior or error message
        if (mountPoint) {
            mountPoint.innerHTML = `
                <div style="padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px;">
                    Failed to load dice roller. Please refresh the page or contact support.
                </div>
            `;
        }
    }
});

/**
 * Utility function to get the correct path to dice roller images
 * @param {string} imageName - The image file name (e.g., 'd20.svg')
 * @returns {string} The full URL to the image
 */
function getDiceRollerImagePath(imageName) {
    // Get plugin URL from settings or use a default path for development
    const settings = window.diceRollerSettings || {};
    const pluginUrl = settings.pluginUrl || '';
    
    // Construct the full path
    return `${pluginUrl}assets/images/${imageName}`;
}

// This is a placeholder implementation - you'll need to replace this with your actual dice roller code
function initializeDiceRoller(mountPoint, settings) {
    // Apply mobile scaling if needed
    if (settings.isMobile && settings.mobileScale) {
        mountPoint.style.transform = `scale(${settings.mobileScale})`;
        mountPoint.style.transformOrigin = settings.position || 'bottom right';
    }
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'dice-roller-button-container';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '1100';
    
    // Create button
    const button = document.createElement('img');
    button.id = 'dice-roller-button';
    button.src = getDiceRollerImagePath('d20.svg'); // Using the utility function
    button.alt = 'Launch Dice Roller';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.cursor = 'pointer';
    
    // Make button accessible
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Open Dice Roller');
    
    buttonContainer.appendChild(button);
    
    // Create dice roller container (initially hidden)
    const container = document.createElement('div');
    container.id = 'dice-roller-container';
    container.style.display = 'none';
    
    // Populate with dice roller HTML structure - this would be replaced with your actual HTML
    container.innerHTML = `
        <div id="dice-applet" class="draggable" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
            <div class="header" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <h3 style="margin: 0;">Dice Roller</h3>
                <button id="close-dice-roller" style="background: none; border: none; cursor: pointer;">×</button>
            </div>
            <div style="text-align: center;">
                <p>This is a placeholder for the dice roller interface.</p>
                <p>Replace this with your actual dice roller code.</p>
                <div class="dice-buttons">
                    <img src="${getDiceRollerImagePath('d4.svg')}" alt="d4" />
                    <img src="${getDiceRollerImagePath('d6.svg')}" alt="d6" />
                    <img src="${getDiceRollerImagePath('d8.svg')}" alt="d8" />
                    <img src="${getDiceRollerImagePath('d10.svg')}" alt="d10" />
                    <img src="${getDiceRollerImagePath('d12.svg')}" alt="d12" />
                    <img src="${getDiceRollerImagePath('d20.svg')}" alt="d20" />
                </div>
            </div>
        </div>
    `;
    
    // Add to mount point
    mountPoint.appendChild(buttonContainer);
    mountPoint.appendChild(container);
    
    // Add event listeners
    button.addEventListener('click', toggleDiceRoller);
    
    // Make button keyboard accessible
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDiceRoller();
        }
    });
    
    // Add close button listener
    const closeButton = container.querySelector('#close-dice-roller');
    if (closeButton) {
        closeButton.addEventListener('click', toggleDiceRoller);
    }
    
    // Initialize in open state if settings indicate
    if (settings.initiallyOpen) {
        toggleDiceRoller();
    }
    
    // Toggle dice roller visibility
    function toggleDiceRoller() {
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }
} 