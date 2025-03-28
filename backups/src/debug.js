// Debug configuration
const DEBUG = {
  enabled: false,
  categories: {
    initialization: false,
    state: false,
    animation: false,
    style: false,
    roll: false,
    input: false
  }
};

// Enable specific debug categories
export function enableDebug(categories = []) {
  DEBUG.enabled = true;
  if (categories.length === 0) {
    // Enable all categories if none specified
    Object.keys(DEBUG.categories).forEach(cat => DEBUG.categories[cat] = true);
  } else {
    categories.forEach(cat => {
      if (cat in DEBUG.categories) {
        DEBUG.categories[cat] = true;
      }
    });
  }
}

// Disable debug output
export function disableDebug() {
  DEBUG.enabled = false;
  Object.keys(DEBUG.categories).forEach(cat => DEBUG.categories[cat] = false);
}

// Main debug log function
export function debugLog(category, ...args) {
  if (DEBUG.enabled && DEBUG.categories[category]) {
    console.log(`[${category.toUpperCase()}]`, ...args);
  }
}

// Specialized debug functions for each category
export const debug = {
  init: (...args) => debugLog('initialization', ...args),
  state: (...args) => debugLog('state', ...args),
  anim: (...args) => debugLog('animation', ...args),
  style: (...args) => debugLog('style', ...args),
  roll: (...args) => debugLog('roll', ...args),
  input: (...args) => debugLog('input', ...args)
};

// Toggle debug borders
export function toggleDebugBorders(enable) {
  const appletEl = document.getElementById('dice-applet');
  if (appletEl) {
    if (enable) {
      appletEl.classList.add('debug-borders');
    } else {
      appletEl.classList.remove('debug-borders');
    }
  }
}

// Initialize debug keyboard shortcuts
export function initializeDebugControls() {
  document.addEventListener('keydown', (e) => {
    // Toggle all debug output with Command/Ctrl + D
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (DEBUG.enabled) {
        disableDebug();
        console.log('Debug output: OFF');
      } else {
        enableDebug();
        console.log('Debug output: ON');
      }
    }
    
    // Toggle debug borders with Command/Ctrl + B
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      const appletEl = document.getElementById('dice-applet');
      appletEl.classList.toggle('debug-borders');
      console.log('Debug borders:', appletEl.classList.contains('debug-borders') ? 'ON' : 'OFF');
    }
  });
} 