export function initializeHelpPopup() {
    // console.log('Initializing help popup system'); // find_me
    
    const helpButton = document.getElementById('help-button');
    const helpPopup = document.getElementById('help-popup');
    
    if (!helpButton || !helpPopup) {
        // console.log('Help elements not found in DOM'); // find_me
        return;
    }

    helpButton.addEventListener('click', () => {
        // console.log('Help button clicked - toggling popup'); // find_me
        helpPopup.classList.toggle('visible');
    });
} 