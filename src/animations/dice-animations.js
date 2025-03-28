/*
* DICE ANIMATIONS
* 
* This file manages all visual animations related to dice rolling.
* It is responsible for coordinating the visual feedback when dice are rolled,
* including spinning dice icons and transitioning result numbers.
* It receives all necessary data through parameters rather than accessing state directly.
*
* This file:
* 1. Animates dice button icons when rolling (animateDiceIcons)
* 2. Manages d10 percentile mode animations (resetD10State, animatePercentileRoll)
* 3. Handles number result animations in the results area (animateNumberResult)
* 4. Coordinates the animation of results and total display (animateResults)
*
* Last updated: March 2025
*/

// Import state management functions
import { 
  getAnimationSubtotal, 
  setAnimationSubtotal 
} from '../state';

/**
 * Check if a die type is a standard die (d4, d6, d8, d10, d12, d20)
 * @param {string} dieType - The type of die to check
 * @returns {boolean} Whether the die is standard
 */
function isStandardDie(dieType) {
  return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].includes(dieType);
}

/**
 * Physics-based deceleration function
 * @param {number} t - Elapsed time in milliseconds
 * @param {number} p_f - Final position/angle
 * @param {number} A - Amplitude (typically final - initial)
 * @param {number} tau - Time constant controlling deceleration rate
 * @returns {number} - Current position/angle at time t
 */
function decelerate(t, p_f, A, tau) {
  return p_f - A * Math.exp(-t / tau);
}

/**
 * Animate an element's transform properties using physics-based deceleration
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in ms
 * @param {number} options.tau - Time constant for deceleration
 * @param {Object} options.transforms - Transform properties to animate
 * @param {Object} options.transforms.rotation - Rotation properties
 * @param {number} options.transforms.rotation.start - Start angle in degrees
 * @param {number} options.transforms.rotation.end - End angle in degrees
 * @param {Object} options.transforms.translate - Translation properties
 * @param {Object} options.transforms.translate.x - X translation properties
 * @param {number} options.transforms.translate.x.start - Start X position
 * @param {number} options.transforms.translate.x.end - End X position
 * @param {Object} options.transforms.translate.y - Y translation properties
 * @param {number} options.transforms.translate.y.start - Start Y position
 * @param {number} options.transforms.translate.y.end - End Y position
 * @returns {string} - Animation ID for cancellation
 */
function animateTransform(element, options) {
  const {
    duration = 2000,
    tau = 325,
    transforms = {}
  } = options;

  const animationId = `transform_${Date.now()}`;
  
  // Store animation reference
  if (!window.diceAnimations) {
    window.diceAnimations = {};
  }
  
  // Cancel existing animation if any
  if (window.diceAnimations[animationId]) {
    cancelAnimationFrame(window.diceAnimations[animationId]);
    window.diceAnimations[animationId] = null;
  }
  
  let startTime = null;
  
  function animateStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;
    
    if (elapsedTime < duration) {
      const transform = [];
      
      // Handle rotation
      if (transforms.rotation) {
        const { start, end } = transforms.rotation;
        const amplitude = end - start;
        const currentAngle = decelerate(elapsedTime, end, amplitude, tau);
        transform.push(`rotate(${currentAngle}deg)`);
      }
      
      // Handle translation
      if (transforms.translate) {
        if (transforms.translate.x) {
          const { start, end } = transforms.translate.x;
          const amplitude = end - start;
          const currentX = decelerate(elapsedTime, end, amplitude, tau);
          transform.push(`translateX(${currentX}px)`);
        }
        if (transforms.translate.y) {
          const { start, end } = transforms.translate.y;
          const amplitude = end - start;
          const currentY = decelerate(elapsedTime, end, amplitude, tau);
          transform.push(`translateY(${currentY}px)`);
        }
      }
      
      // Apply transforms
      element.style.transform = transform.join(' ');
      
      // Continue animation
      window.diceAnimations[animationId] = requestAnimationFrame(animateStep);
    } else {
      // Ensure we end at exactly the final values
      const finalTransform = [];
      
      if (transforms.rotation) {
        finalTransform.push(`rotate(${transforms.rotation.end}deg)`);
      }
      if (transforms.translate) {
        if (transforms.translate.x) {
          finalTransform.push(`translateX(${transforms.translate.x.end}px)`);
        }
        if (transforms.translate.y) {
          finalTransform.push(`translateY(${transforms.translate.y.end}px)`);
        }
      }
      
      element.style.transform = finalTransform.join(' ');
      
      // Reset after a brief delay to avoid visual glitch
      setTimeout(() => {
        window.diceAnimations[animationId] = null;
      }, 50);
    }
  }
  
  // Start animation
  window.diceAnimations[animationId] = requestAnimationFrame(animateStep);
  return animationId;
}

/**
 * Animate dice icons spinning with physics-based deceleration
 * @param {Array} diceToAnimate - Array of dice types to animate
 * @returns {number} - Animation duration in milliseconds
 */
export function animateDiceIcons(diceToAnimate) {
  const durationMs = 2000;
  const finalAngle = 360 * 3; // 3 full spins in degrees
  
  diceToAnimate.forEach(dieType => {
    // Special handling for d10/d00
    if (dieType === 'd10' || dieType === 'd00') {
      const d10ButtonEl = document.querySelector(`.die-button[data-die="d10"]`);
      if (d10ButtonEl) {
        if (dieType === 'd00') {
          // For percentile, use animateD10
          animateD10(d10ButtonEl, true, !d10ButtonEl.classList.contains('percentile-active'));
        } else {
          // For standard d10, animate the main die
          const mainDieEl = d10ButtonEl.querySelector('.main-die');
          if (mainDieEl) {
            animateTransform(mainDieEl, {
              duration: durationMs,
              transforms: {
                rotation: {
                  start: 0,
                  end: finalAngle
                }
              }
            });
          }
        }
      }
    } else {
      // Standard dice handling
      const dieButtonsEl = document.querySelectorAll(`.die-button[data-die="${dieType}"] img`);
      dieButtonsEl.forEach(button => {
        animateTransform(button, {
          duration: durationMs,
          transforms: {
            rotation: {
              start: 0,
              end: finalAngle
            }
          }
        });
      });
    }
  });
  
  return durationMs;
}

/**
 * Generate a random number for a specific die type
 * @param {string} dieType - Type of die (e.g., 'd20', 'd6')
 * @returns {number|string} - Random number appropriate for the die type
 */
function getRandomValueForDie(dieType) {
  if (!dieType) {
    console.warn('No die type provided to getRandomValueForDie');
    return 0;
  }

  // Handle percentile special cases
  if (dieType === 'd10-tens') {
    // Returns 00, 10, 20, ..., 90
    const tens = Math.floor(Math.random() * 10);
    return (tens * 10).toString().padStart(2, '0');
  } else if (dieType === 'd10-ones') {
    // Returns 0-9
    return Math.floor(Math.random() * 10);
  }
  
  // Standard dice - ensure we have a valid die type
  const match = dieType.match(/d(\d+)/);
  if (!match) {
    console.warn(`Invalid die type format: ${dieType}`);
    return 0;
  }
  
  const sides = parseInt(match[1], 10);
  if (isNaN(sides) || sides <= 0) {
    console.warn(`Invalid number of sides: ${sides}`);
    return 0;
  }
  
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Animate a single number result with randomization effect
 * @param {HTMLElement} element - Element to animate
 * @param {number|string} finalValue - Final value to display
 * @param {string} dieType - Type of die for styling
 * @param {number} durationMs - Animation duration
 */
function animateNumberResult(element, finalValue, dieType, durationMs) {
  // Ensure element is visible and styled
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.dataset.die = dieType;
  
  // Animation parameters based on rules
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const tau = 325; // Time constant for deceleration
  
  // Animation state tracking
  let startTime = null;
  let lastValue = getRandomValueForDie(dieType);
  let animationFrameId = null;
  
  // Set initial random value
  element.textContent = lastValue;
  
  // Capture initial style state
  const initialState = captureStyleState(element);
  
  function updateNumber(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    
    if (elapsed < numberAnimDuration) {
      // Calculate deceleration progress (0 to 1)
      const progress = decelerate(elapsed, 1, 1, tau);
      
      // Probability of showing final value increases with decelerated progress
      const showFinal = Math.random() < Math.pow(progress, 3);
      
      if (showFinal) {
        if (dieType === 'd10-tens' && typeof finalValue === 'number') {
          element.textContent = finalValue.toString().padStart(2, '0');
        } else {
          element.textContent = finalValue;
        }
      } else {
        // Generate new random value
        let newValue = getRandomValueForDie(dieType);
        
        // Ensure we don't show the same number twice
        while (newValue === lastValue) {
          newValue = getRandomValueForDie(dieType);
        }
        
        // Special formatting for percentile tens
        if (dieType === 'd10-tens') {
          newValue = newValue.toString().padStart(2, '0');
        }
        
        element.textContent = newValue;
        lastValue = newValue;
      }
      
      // Capture style state after update
      const currentState = captureStyleState(element);
      compareStyleStates(initialState, currentState, 'During Animation');
      
      // Continue animation
      animationFrameId = requestAnimationFrame(updateNumber);
    } else {
      // Ensure we end with the final value
      if (dieType === 'd10-tens' && typeof finalValue === 'number') {
        element.textContent = finalValue.toString().padStart(2, '0');
      } else {
        element.textContent = finalValue;
      }
      
      // Final style check
      const finalState = captureStyleState(element);
      compareStyleStates(initialState, finalState, 'Animation Complete');
      
      // Clean up
      animationFrameId = null;
    }
  }
  
  // Start animation
  animationFrameId = requestAnimationFrame(updateNumber);
  
  // Return a cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

/**
 * Track style changes for debugging
 * @param {HTMLElement} element - Element to track
 * @returns {Object} - Style state object
 */
function captureStyleState(element) {
  const computedStyle = window.getComputedStyle(element);
  return {
    fontSize: computedStyle.fontSize,
    fontWeight: computedStyle.fontWeight,
    fontFamily: computedStyle.fontFamily,
    visibility: computedStyle.visibility,
    display: computedStyle.display,
    opacity: computedStyle.opacity,
    transform: computedStyle.transform,
    classes: [...element.classList],
    timestamp: performance.now(),
    elementId: element.id || 'unnamed-element',
    parentClasses: element.parentElement ? [...element.parentElement.classList] : []
  };
}

/**
 * Track a style-related change in the change map
 * @param {Object} change - Change details
 * @param {string} change.description - Description of the change
 * @param {string[]} change.files - Files affected
 * @param {string} change.type - Type of change
 */
function trackStyleChange(change) {
  const changeId = `style_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  
  // Create history entry
  const historyEntry = {
    changeId,
    file: 'src/animations/dice-animations.js',
    type: 'style-change',
    description: change.description,
    context: {
      element: change.element,
      before: change.before,
      after: change.after,
      trigger: change.trigger
    }
  };

  // Log to console during development
  console.log('Style Change:', {
    id: changeId,
    element: change.element,
    changes: compareStyleStates(change.before, change.after, 'Style change detected')
  });

  return changeId;
}

/**
 * Compare two style states and log differences
 * @param {Object} before - Style state before
 * @param {Object} after - Style state after
 * @param {string} context - Description of when comparison occurred
 */
function compareStyleStates(before, after, context) {
  const changes = {
    font: {},
    visibility: {},
    transform: {},
    classes: {
      added: [],
      removed: []
    }
  };

  // Check font changes
  if (before.fontSize !== after.fontSize) {
    changes.font.size = {
      from: before.fontSize,
      to: after.fontSize
    };
  }

  if (before.fontWeight !== after.fontWeight) {
    changes.font.weight = {
      from: before.fontWeight,
      to: after.fontWeight
    };
  }

  if (before.fontFamily !== after.fontFamily) {
    changes.font.family = {
      from: before.fontFamily,
      to: after.fontFamily
    };
  }

  // Check visibility changes
  ['visibility', 'display', 'opacity'].forEach(prop => {
    if (before[prop] !== after[prop]) {
      changes.visibility[prop] = {
        from: before[prop],
        to: after[prop]
      };
    }
  });

  // Check transform changes
  if (before.transform !== after.transform) {
    changes.transform = {
      from: before.transform,
      to: after.transform
    };
  }

  // Check class changes
  const beforeClasses = new Set(before.classes);
  const afterClasses = new Set(after.classes);

  afterClasses.forEach(cls => {
    if (!beforeClasses.has(cls)) {
      changes.classes.added.push(cls);
    }
  });

  beforeClasses.forEach(cls => {
    if (!afterClasses.has(cls)) {
      changes.classes.removed.push(cls);
    }
  });

  // Log significant changes
  if (Object.keys(changes.font).length > 0 || 
      changes.classes.added.includes('roll-value') || 
      changes.classes.removed.includes('roll-value')) {
    console.log(`[Style Change - ${context}]`, {
      timestamp: performance.now(),
      elementId: after.elementId,
      changes
    });
  }

  return changes;
}

/**
 * Animate roll results and total
 * @param {Object} animationData - Data needed for animation
 * @param {Array} animationData.rolls - Array of roll results
 * @param {Array} animationData.diceTypes - Array of corresponding dice types
 * @param {number} animationData.total - Final total to display
 * @param {number} durationMs - Animation duration
 */
export function animateResults({ rolls, diceTypes, total }, durationMs) {
  const resultsRollsEl = document.getElementById('results-rolls');
  const resultsTotalEl = document.getElementById('results-total');
  
  if (!resultsRollsEl || !resultsTotalEl) {
    console.error('Required elements not found');
    return;
  }
  
  // Clear existing results
  resultsRollsEl.innerHTML = '';
  
  // Animation sequence timing
  const numberAnimDuration = 1000; // Numbers animate for 1s
  const totalUpdateDelay = durationMs - 1000;
  
  // Create and animate result boxes
  rolls.forEach((roll, index) => {
    const dieType = diceTypes?.[index] || 'd6';
    
    // Create roll box with proper structure
    const rollBox = document.createElement('div');
    rollBox.className = 'roll-box';
    rollBox.dataset.die = dieType;
    
    // Create number display element
    const numberDisplay = document.createElement('span');
    numberDisplay.className = 'roll-value';
    
    // Capture initial state before DOM insertion
    const initialState = captureStyleState(numberDisplay);
    
    // Add to DOM
    rollBox.appendChild(numberDisplay);
    resultsRollsEl.appendChild(rollBox);
    
    // Capture state after DOM insertion
    const afterInsertionState = captureStyleState(numberDisplay);
    compareStyleStates(initialState, afterInsertionState, 'After DOM Insertion');
    
    // Set critical styles with RAF to ensure proper timing
    requestAnimationFrame(() => {
      // Force FOUC prevention
      numberDisplay.style.opacity = '1';
      numberDisplay.style.visibility = 'visible';
      numberDisplay.style.fontSize = 'var(--font-size-large)';
      numberDisplay.style.fontWeight = 'bold';
      
      // Capture state after style application
      const afterStylesState = captureStyleState(numberDisplay);
      compareStyleStates(afterInsertionState, afterStylesState, 'After Style Application');
      
      // Start animation in next frame to ensure styles are applied
      requestAnimationFrame(() => {
        if (typeof roll === 'object' && roll.type) {
          // Percentile roll handling
          const isPercentile = roll.type.startsWith('d10-');
          if (isPercentile) {
            numberDisplay.dataset.die = roll.type;
            let displayValue = roll.value;
            if (roll.type === 'd10-tens') {
              displayValue = roll.value.toString().padStart(2, '0');
            }
            animateNumberResult(numberDisplay, displayValue, roll.type, durationMs);
          } else {
            animateNumberResult(numberDisplay, roll.value, roll.type, durationMs);
          }
        } else {
          animateNumberResult(numberDisplay, roll, dieType, durationMs);
        }
      });
    });
  });
  
  // Update total with proper timing
  if (resultsTotalEl) {
    setTimeout(() => {
      resultsTotalEl.style.transition = 'opacity 200ms ease-out';
      resultsTotalEl.style.opacity = '0';
      
      setTimeout(() => {
        const totalValue = resultsTotalEl.querySelector('.total-value');
        if (totalValue) {
          totalValue.textContent = total;
        } else {
          console.warn('Could not find .total-value element');
        }
        resultsTotalEl.style.transition = 'opacity 200ms ease-in';
        resultsTotalEl.style.opacity = '1';
      }, 250);
    }, totalUpdateDelay);
  }
}

/**
 * Animate d10 dice with physics-based deceleration
 * @param {HTMLElement} button - The d10 button element
 * @param {boolean} isPercentile - Whether in percentile mode
 * @param {boolean} isFirstActivation - Whether this is the first percentile activation
 * @returns {number} - Animation duration in milliseconds
 */
export function animateD10(button, isPercentile = false, isFirstActivation = false) {
  const durationMs = 2000;
  const finalAngle = 360 * 3; // 3 full spins
  const tau = 325; // Match the tau value from animateTransform
  
  if (!isPercentile) {
    // Standard d10 roll - just spin the main die
    const mainDieEl = button.querySelector('.main-die');
    if (mainDieEl) {
      animateTransform(mainDieEl, {
        duration: durationMs,
        tau,
        transforms: {
          rotation: {
            start: 0,
            end: finalAngle
          }
        }
      });
    }
  } else {
    // Percentile mode
    const coloredDice = button.querySelectorAll('.colored-die');
    
    if (isFirstActivation) {
      // Initial split animation
      coloredDice.forEach((die, index) => {
        const isLeft = die.classList.contains('blue');
        animateTransform(die, {
          duration: durationMs,
          tau,
          transforms: {
            rotation: {
              start: 0,
              end: finalAngle
            },
            translate: {
              x: {
                start: 0,
                end: isLeft ? -15 : 15
              }
            }
          }
        });
        
        // Set opacity with a slight delay to ensure smooth transition
        setTimeout(() => {
          die.style.opacity = '1';
        }, 50);
      });
      
      // Hide main die
      const mainDieEl = button.querySelector('.main-die');
      if (mainDieEl) {
        mainDieEl.style.opacity = '0';
      }
    } else {
      // Subsequent spins - dice are already split
      coloredDice.forEach(die => {
        const isLeft = die.classList.contains('blue');
        const currentX = isLeft ? -15 : 15;
        
        animateTransform(die, {
          duration: durationMs,
          tau,
          transforms: {
            rotation: {
              start: 0,
              end: finalAngle
            },
            translate: {
              x: {
                start: currentX,
                end: currentX
              }
            }
          }
        });
      });
    }
  }
  
  return durationMs;
}

/**
 * Reset d10 button state
 * @param {HTMLElement} button - The d10 button to reset
 */
export function resetD10State(button) {
  if (!button) return;
  
  // Keep the CSS classes for now as fallback
  button.classList.remove('percentile-active', 'first-animation');
  
  const mainDieEl = button.querySelector('.main-die');
  const coloredDice = button.querySelectorAll('.colored-die');
  
  // Reset transforms using animateTransform
  coloredDice.forEach(die => {
    animateTransform(die, {
      duration: 500,
      transforms: {
        rotation: {
          start: parseInt(die.style.transform?.match(/rotate\((.*?)deg\)/)?.[1] || '0', 10),
          end: 0
        },
        translate: {
          x: {
            start: parseInt(die.style.transform?.match(/translateX\((.*?)px\)/)?.[1] || '0', 10),
            end: 0
          }
        }
      }
    });
  });
  
  // Reset main die visibility
  if (mainDieEl) {
    mainDieEl.style.opacity = '1';
    mainDieEl.style.transform = '';
  }
  
  // Reset colored dice visibility
  coloredDice.forEach(die => {
    die.style.opacity = '0';
  });
}

/**
 * Animate a non-standard dice group result
 * @param {HTMLElement} container - Container element for the non-standard result
 * @param {Object} data - Data for the non-standard dice group
 * @param {string} dieType - Type of die (e.g., 'd30')
 * @param {number} durationMs - Animation duration
 */
export function animateNonStandardResult(container, data, dieType, durationMs) {
  console.log('=== DEBUG: animateNonStandardResult ===');
  console.log('Data received:', JSON.stringify(data, null, 2));
  console.log('dieType:', dieType);
  
  // Animation parameters
  const numberAnimDuration = 1000; // Numbers settle after 1000ms
  const initialInterval = 50; // Start updating every 50ms (20fps)
  const maxInterval = 200; // Slow down to updating every 200ms
  
  // Get previous subtotal from state management - for DISPLAY PURPOSES ONLY
  // This value is never used in calculations, just shown during animation
  let previousSubtotal = getAnimationSubtotal(dieType);
  console.log('Previous subtotal from state:', previousSubtotal);
  
  // Clear existing content and prepare elements
  container.innerHTML = '';
  
  const notation = `${data.count}${dieType}`;
  console.log('Notation:', notation);
  
  // Create the subtotal element with the previous value
  const subtotalSpan = document.createElement('span');
  subtotalSpan.className = 'result-notation';
  
  // Use the previous subtotal if available, otherwise use "0"
  subtotalSpan.textContent = `${notation}: ${previousSubtotal}`;
  container.appendChild(subtotalSpan);
  console.log('Set initial display subtotal to:', previousSubtotal);
  
  // Add a space
  container.appendChild(document.createTextNode(' '));
  
  // Create the rolls element (initially with placeholder)
  const rollsSpan = document.createElement('span');
  rollsSpan.className = 'dice-values';
  rollsSpan.textContent = '[...]';
  container.appendChild(rollsSpan);
  
  // Set dataset values
  container.dataset.die = dieType;
  container.dataset.group = notation;
  container.title = `Group of ${data.count} ${dieType} dice`;
  
  // Start animation for individual dice values
  let startTime = Date.now();
  let lastUpdateTime = 0;
  let currentInterval = initialInterval;
  
  // Generate random values for a specific die type
  function getRandomValuesArray(count, sides) {
    const sides_num = parseInt(sides, 10);
    return Array.from({ length: count }, () => Math.floor(Math.random() * sides_num) + 1);
  }
  
  // Animation function for dice values
  function updateDiceValues() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed < numberAnimDuration) {
      // Calculate progress (0 to 1)
      const progress = Math.min(elapsed / numberAnimDuration, 1);
      
      // Slow down updates as we progress
      currentInterval = initialInterval + (maxInterval - initialInterval) * progress;
      
      // Only update if enough time has passed since last update
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate >= currentInterval) {
        // Generate random values for dice
        const sides = dieType.slice(1); // Remove 'd' prefix to get sides
        const randomValues = getRandomValuesArray(data.count, sides);
        
        // Chance of showing final values increases as we progress
        if (Math.random() < Math.pow(progress, 2)) {
          // Show final results
          rollsSpan.textContent = `[${data.results.join(', ')}]`;
        } else {
          // Show random values
          rollsSpan.textContent = `[${randomValues.join(', ')}]`;
        }
        
        lastUpdateTime = Date.now();
      }
      
      // Schedule next frame
      requestAnimationFrame(updateDiceValues);
    } else {
      // Individual dice values have finished animating
      rollsSpan.textContent = `[${data.results.join(', ')}]`;
      
      // After individual dice finish, update the subtotal
      subtotalSpan.textContent = `${notation}: ${data.subtotal}`;
      console.log(`Animation complete: Updating displayed subtotal to ${data.subtotal}`);
      
      // Store the new subtotal in state management - FOR DISPLAY PURPOSES ONLY
      // This is only used to show transitions between rolls in the UI
      setAnimationSubtotal(dieType, data.subtotal);
      console.log(`Stored new animation subtotal in state: ${data.subtotal}`);
    }
  }
  
  // Start animation
  requestAnimationFrame(updateDiceValues);
}

