export function setupNumberButtons() {
    // console.log('Setting up number buttons'); // find_me
    
    const numberButtonsContainer = document.getElementById('number-buttons');
    if (!numberButtonsContainer) {
        // console.log('Number buttons container not found'); // find_me
        return;
    }

    // Create and append number buttons
    for (let i = 0; i <= 9; i++) {
        const button = createNumberButton(i);
        numberButtonsContainer.appendChild(button);
    }
    
    // console.log('Number buttons setup complete'); // find_me
} 