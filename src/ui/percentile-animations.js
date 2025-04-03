/*
* PERCENTILE ANIMATIONS
*
* Handles the four different animation paths for percentile dice.
* Each path manages its own cleanup and timing while keeping the
* core percentile functionality intact.
*
* This file:
* 1. Double-click: Mode transition + roll animations
* 2. Long-press: Progress feedback + transition + roll
* 3. Shift-click: Immediate roll animation
* 4. Notation: Direct roll animation
*/

// Animation timing constants
const TIMING = {
    MODE_TRANSITION: 300,    // Time for mode change animation
    ROLL_DURATION: 2000,     // Standard roll animation time
    PROGRESS_INTERVAL: 50,   // Long-press progress update interval
    HOLD_THRESHOLD: 500     // Time to trigger long-press
};

// Utility function for physics-based deceleration
function decelerate(t, p_f, A, tau) {
    return p_f - A * Math.exp(-t / tau);
}

// Cleanup utilities
const cleanup = {
    // Clear any active animations
    animations: (button) => {
        const elements = button.querySelectorAll('.colored-die, .main-die');
        elements.forEach(el => {
            el.style.transform = '';
            el.classList.remove('spin');
        });
    },

    // Reset visual states
    visual: (button) => {
        const mainDie = button.querySelector('.main-die');
        const coloredDice = button.querySelectorAll('.colored-die');
        
        if (mainDie) mainDie.style.opacity = '1';
        coloredDice.forEach(die => die.style.opacity = '0');
    },

    // Clear any running timers
    timers: (timerId) => {
        if (timerId) {
            clearTimeout(timerId);
            clearInterval(timerId);
        }
    }
};

export const percentileAnimations = {
    // Double-click animation path
    doubleClick: {
        showModeTransition: (button) => {
            // Show mode transition
            button.classList.add('percentile-active');
            const mainDie = button.querySelector('.main-die');
            const coloredDice = button.querySelectorAll('.colored-die');

            // Fade out main die, fade in colored dice
            if (mainDie) mainDie.style.opacity = '0';
            coloredDice.forEach(die => {
                die.style.opacity = '1';
                die.style.transition = 'opacity ${TIMING.MODE_TRANSITION}ms';
            });

            return new Promise(resolve => 
                setTimeout(resolve, TIMING.MODE_TRANSITION));
        },

        animateRoll: (button) => {
            const coloredDice = button.querySelectorAll('.colored-die');
            coloredDice.forEach(die => {
                die.classList.remove('spin');
                void die.offsetWidth; // Force reflow
                die.classList.add('spin');
            });

            return new Promise(resolve => 
                setTimeout(resolve, TIMING.ROLL_DURATION));
        },

        cleanup: (button) => {
            cleanup.animations(button);
            cleanup.visual(button);
        }
    },

    // Long-press animation path
    longPress: {
        progressTimer: null,
        
        showProgress: (button, onComplete) => {
            let progress = 0;
            const coloredDice = button.querySelectorAll('.colored-die');
            
            // Start progress animation
            this.progressTimer = setInterval(() => {
                progress += (TIMING.PROGRESS_INTERVAL / TIMING.HOLD_THRESHOLD);
                
                if (progress >= 1) {
                    cleanup.timers(this.progressTimer);
                    onComplete();
                } else {
                    // Gradually reveal colored dice
                    coloredDice.forEach(die => {
                        die.style.opacity = progress.toString();
                    });
                }
            }, TIMING.PROGRESS_INTERVAL);

            return this.progressTimer;
        },

        animateRoll: (button) => {
            return percentileAnimations.doubleClick.animateRoll(button);
        },

        cleanup: (button) => {
            cleanup.timers(this.progressTimer);
            cleanup.animations(button);
            cleanup.visual(button);
        }
    },

    // Shift-click animation path
    shiftClick: {
        animateImmediate: (button) => {
            // Skip mode transition, go straight to roll
            button.classList.add('percentile-active');
            const coloredDice = button.querySelectorAll('.colored-die');
            
            coloredDice.forEach(die => {
                die.style.opacity = '1';
                die.classList.add('spin');
            });

            return new Promise(resolve => 
                setTimeout(resolve, TIMING.ROLL_DURATION));
        },

        cleanup: (button) => {
            cleanup.animations(button);
            cleanup.visual(button);
        }
    },

    // Notation animation path
    notation: {
        animateRoll: (button) => {
            // Similar to shift-click but without button state changes
            const coloredDice = button.querySelectorAll('.colored-die');
            
            coloredDice.forEach(die => {
                die.style.opacity = '1';
                die.classList.add('spin');
            });

            return new Promise(resolve => 
                setTimeout(resolve, TIMING.ROLL_DURATION));
        },

        cleanup: (button) => {
            cleanup.animations(button);
            // Don't reset visual state as notation doesn't affect button
        }
    }
}; 