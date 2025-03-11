# Redundant Code to Prune

This document identifies code that is now redundant after our refactoring efforts and can be safely removed.

## ✅ 1. Duplicate Global Keyboard Event Handlers (RESOLVED)

~~Both `event-handlers.js` and `input-handler.js` have very similar global keyboard event handlers. This should be centralized in one place.~~

**Update**: This has been resolved. All keyboard event handling is now centralized in `input-handler.js`. The code in `event-handlers.js` has been removed and that file now focuses exclusively on UI button handlers and click interactions.

## 2. Direct DOM Manipulations of Applet Element

Now that we have centralized applet state management, direct DOM manipulations of the applet element in various files can be pruned.

### In `index.js`:
```javascript
// Set initial state explicitly
applet.style.display = 'none';
```

**Update**: This has been replaced with `minimizeApplet()` function calls in the updated code.

## 3. Commented-Out Functions in `button-handler.js`

The commented-out functions at the bottom of `button-handler.js` that have been moved to `core-functions.js` can be completely removed:

```javascript
// We no longer need these functions as they've been moved to core-functions.js
// - spinPercentileDice
// - rollAndAnimate
// - handlePercentileRoll
```

**Status**: Still needs to be addressed.

## 4. Direct State Manipulations

Now that state management is centralized, direct manipulations of the state in various files can be removed.

### Example in legacy code:
```javascript
// Clear dice pool and set modifier
clearDice();
clearResults();
setModifier(0);
updateDisplay();
```

**Update**: Most instances have been replaced with core function calls, but we should do a final sweep to catch any remaining instances.

## ✅ 5. Redundant Roll Button Setup (RESOLVED)

~~The roll button is set up in two places:~~
~~- `event-handlers.js`~~
~~- `input-handler.js` (in the `setupRollButton` function)~~

**Update**: We've reorganized the code to have clearer responsibilities:
- `event-handlers.js` now handles UI button setup (including the roll button)
- `input-handler.js` handles keyboard interactions

## ✅ 6. Multiple Animation Implementations (RESOLVED)

~~Before our refactoring, there were multiple ways animations were triggered:~~
~~- Direct calls to `animateDiceIcons` and `animateResults`~~
~~- Calls to `rollAndAnimate`~~

**Update**: All animation calls now use the standardized pattern:
```javascript
const rollInfo = rerollAllDice(); // or other roll function
if (rollInfo) {
  animateDiceRoll(rollInfo);
}
```

## Next Steps

As we continue refactoring, these redundancies should be removed to keep the codebase clean and maintainable. The recommended approach is to:

1. First ensure the new approach is working correctly
2. Then remove the redundant code
3. Test thoroughly to ensure functionality is preserved

## Additional Considerations

### Role of event-handlers.js

We've clarified the responsibilities:
- `event-handlers.js` handles UI button events and click interactions 
- `input-handler.js` handles keyboard events and text input
- `core-functions.js` contains the actual functionality

This division makes the codebase easier to understand and maintain. 