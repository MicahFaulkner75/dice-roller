/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animations/dice-animations.js":
/*!*******************************************!*\
  !*** ./src/animations/dice-animations.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDiceIcons: () => (/* binding */ animateDiceIcons),\n/* harmony export */   animateResults: () => (/* binding */ animateResults)\n/* harmony export */ });\nfunction animateDiceIcons(dice) {\n  // Get all dice buttons that need to be animated\n  var diceToAnimate = dice || [];\n  var durationMs = 500; // Reduced from 1000ms to feel more responsive\n\n  console.log(\"Animating dice:\", diceToAnimate);\n\n  // Apply spin animation to matching dice buttons\n  diceToAnimate.forEach(function (dieType) {\n    var button = document.querySelector(\".die-button[data-die=\\\"\".concat(dieType, \"\\\"]\"));\n    console.log(\"Looking for button with [data-die=\\\"\".concat(dieType, \"\\\"]\"), button);\n    if (button) {\n      var img = button.querySelector('img');\n      console.log(\"Found image in button:\", img);\n      if (img) {\n        // Add and remove the spin class to trigger CSS animation\n        img.classList.add('spin');\n        console.log(\"Added spin class to \".concat(dieType, \" image\"));\n        setTimeout(function () {\n          img.classList.remove('spin');\n          console.log(\"Removed spin class from \".concat(dieType, \" image\"));\n        }, durationMs);\n      }\n    }\n  });\n  return durationMs;\n}\nfunction animateResults(rolls, total, durationMs) {\n  var resultsRollsEl = document.getElementById('results-rolls');\n  var resultsTotalEl = document.getElementById('results-total').querySelector('div:nth-child(2)');\n  console.log(\"Animating results:\", rolls, total);\n  if (!resultsRollsEl || !resultsTotalEl) {\n    console.log(\"Could not find results elements\");\n    return;\n  }\n\n  // Add a temporary class for animation\n  resultsRollsEl.classList.add('animating');\n  resultsTotalEl.classList.add('animating');\n\n  // Set the final values after animation duration\n  setTimeout(function () {\n    resultsRollsEl.classList.remove('animating');\n    resultsTotalEl.classList.remove('animating');\n  }, durationMs);\n}\n\n//# sourceURL=webpack://dice_roller/./src/animations/dice-animations.js?");

/***/ }),

/***/ "./src/dice-logic.js":
/*!***************************!*\
  !*** ./src/dice-logic.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   computeNotation: () => (/* binding */ computeNotation),\n/* harmony export */   computeTotal: () => (/* binding */ computeTotal),\n/* harmony export */   parseDiceNotation: () => (/* binding */ parseDiceNotation),\n/* harmony export */   rollAllDice: () => (/* binding */ rollAllDice)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\n// Roll a single die given the number of sides.\nfunction rollDie(sides) {\n  return Math.floor(Math.random() * sides) + 1;\n}\n\n// Deceleration function\nfunction decelerate(t, p_f, A, tau) {\n  return p_f - A * Math.exp(-t / tau);\n}\n\n// Animate the dice spin with deceleration\nfunction animateSpin(button, duration, finalAngle) {\n  var startTime = performance.now();\n  var initialAngle = 0;\n  var amplitude = finalAngle - initialAngle;\n  var tau = 325; // Time constant in milliseconds\n\n  function step(currentTime) {\n    var elapsedTime = currentTime - startTime;\n    if (elapsedTime < duration) {\n      var angle = decelerate(elapsedTime, finalAngle, amplitude, tau);\n      button.style.transform = \"rotate(\".concat(angle, \"deg)\");\n      requestAnimationFrame(step);\n    } else {\n      button.style.transform = \"rotate(\".concat(finalAngle, \"deg)\");\n    }\n  }\n  requestAnimationFrame(step);\n}\n\n// Roll all dice currently in state.selectedDice and update state.currentRolls.\nfunction rollAllDice() {\n  _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.map(function (die) {\n    // Assumes die is in the form \"dX\" (e.g., \"d6\", \"d20\").\n    var sides = parseInt(die.slice(1), 10);\n    return rollDie(sides);\n  });\n\n  // Trigger the spin animation for each die\n  _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.forEach(function (die) {\n    var dieButtons = document.querySelectorAll(\".die-button[data-die=\\\"\".concat(die, \"\\\"] img\"));\n    dieButtons.forEach(function (button) {\n      var finalAngle = 360 * 3; // 3 full spins to end right-side up\n      var duration = 2000; // Total duration in milliseconds\n      animateSpin(button, duration, finalAngle);\n    });\n  });\n}\n\n// Compute the current dice notation (e.g., \"2d20 + 1d6\")\nfunction computeNotation() {\n  var diceCounts = {};\n\n  // Count occurrences of each die type\n  _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.forEach(function (die) {\n    diceCounts[die] = (diceCounts[die] || 0) + 1;\n  });\n\n  // Convert to notation format\n  var parts = Object.entries(diceCounts).map(function (_ref) {\n    var _ref2 = _slicedToArray(_ref, 2),\n      die = _ref2[0],\n      count = _ref2[1];\n    return \"\".concat(count).concat(die);\n  });\n  return parts.join(' + ');\n}\n\n// Compute total of current rolls plus modifier\nfunction computeTotal() {\n  if (!_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls.length) return 0;\n\n  // Sum all roll results and add the modifier\n  var sum = _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls.reduce(function (total, roll) {\n    return total + roll;\n  }, 0);\n  return sum + _state__WEBPACK_IMPORTED_MODULE_0__.state.modifier;\n}\n\n// Replace the existing parseDiceNotation with this improved version:\nfunction parseDiceNotation(input) {\n  console.log(\"Parsing notation:\", input);\n\n  // Clean up the input - remove spaces around + and -\n  var cleanInput = input.replace(/\\s*([+-])\\s*/g, '$1');\n  console.log(\"Cleaned input:\", cleanInput);\n\n  // Extract all dice notations like \"2d10\" or \"d20\" or \"+2\" or \"-1\"\n  var diceRegex = /([+-]?)(\\d*)d(\\d+)|([+-]\\d+)/gi;\n  var match;\n  var results = [];\n  while ((match = diceRegex.exec(cleanInput)) !== null) {\n    console.log(\"Match found:\", match);\n    if (match[0].includes('d')) {\n      // This is a dice notation\n      var sign = match[1] || '+'; // Default to + if no sign\n      var count = match[2] === '' ? 1 : parseInt(match[2], 10); // Default to 1 if no count\n      var sides = parseInt(match[3], 10);\n      results.push({\n        type: 'dice',\n        sign: sign,\n        count: count,\n        sides: sides\n      });\n    } else {\n      // This is a modifier\n      var _modifier = parseInt(match[0], 10); // Already includes sign\n      results.push({\n        type: 'modifier',\n        value: _modifier\n      });\n    }\n  }\n  console.log(\"Parsed results:\", results);\n\n  // Process the results\n  var dice = [];\n  var modifier = 0;\n  results.forEach(function (item) {\n    if (item.type === 'dice') {\n      // For dice, add the appropriate number based on sign\n      var diceType = \"d\".concat(item.sides);\n      var actualCount = item.sign === '-' ? -item.count : item.count;\n\n      // Add or remove dice based on sign\n      if (actualCount > 0) {\n        for (var i = 0; i < actualCount; i++) {\n          dice.push(diceType);\n        }\n      }\n    } else {\n      // For modifiers, just add to the total modifier\n      modifier += item.value;\n    }\n  });\n  console.log(\"Final parsed result:\", {\n    dice: dice,\n    modifier: modifier\n  });\n  return {\n    dice: dice,\n    modifier: modifier\n  };\n}\n\n//# sourceURL=webpack://dice_roller/./src/dice-logic.js?");

/***/ }),

/***/ "./src/event-handlers.js":
/*!*******************************!*\
  !*** ./src/event-handlers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupEventListeners: () => (/* binding */ setupEventListeners)\n/* harmony export */ });\n/* harmony import */ var _ui_updates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui-updates */ \"./src/ui-updates.js\");\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./animations/dice-animations */ \"./src/animations/dice-animations.js\");\n\n\n\n\nfunction setupEventListeners() {\n  // Add event listeners for dice input, buttons, etc.\n  var diceInput = document.getElementById('dice-input');\n  diceInput.addEventListener('keydown', handleKeyDown);\n  var clearButton = document.getElementById('clear-button');\n  clearButton.addEventListener('click', function () {\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearDice)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearResults)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(0);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  var rollButton = document.getElementById('roll-button');\n  rollButton.addEventListener('click', function () {\n    (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.rollAllDice)();\n    var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__.animateDiceIcons)(_state__WEBPACK_IMPORTED_MODULE_1__.state.currentRolls);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_1__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.computeTotal)(), durationMs);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  var increaseButton = document.getElementById('modify-button-increase');\n  increaseButton.addEventListener('click', function () {\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(_state__WEBPACK_IMPORTED_MODULE_1__.state.modifier + 1);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  var decreaseButton = document.getElementById('modify-button-decrease');\n  decreaseButton.addEventListener('click', function () {\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(_state__WEBPACK_IMPORTED_MODULE_1__.state.modifier - 1);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  // Add this new code for the X button\n  var closeButton = document.getElementById('close-applet');\n  if (closeButton) {\n    closeButton.addEventListener('click', function () {\n      var applet = document.getElementById('dice-applet');\n      if (applet) {\n        applet.style.display = 'none';\n      }\n    });\n  }\n\n  // Add this new code for clicking outside to close\n  document.addEventListener('click', function (e) {\n    var applet = document.getElementById('dice-applet');\n    var launchButton = document.getElementById('dice-roller-button');\n\n    // Only process if applet is visible\n    if (applet && applet.style.display !== 'none') {\n      // Check if click is outside applet and not on launch button\n      if (!applet.contains(e.target) && !launchButton.contains(e.target)) {\n        applet.style.display = 'none';\n      }\n    }\n  });\n}\nfunction handleKeyDown(e) {\n  if (e.key !== 'Enter') return;\n  e.preventDefault();\n  var input = e.target.textContent.trim();\n  if (!input) {\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearDice)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearResults)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(0);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n    return;\n  }\n  var parsed = (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.parseDiceNotation)(input);\n  if (parsed) {\n    processValidInput(parsed);\n  }\n}\nfunction processValidInput(parsed) {\n  (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearDice)();\n  parsed.dice.forEach(function (die) {\n    return (0,_state__WEBPACK_IMPORTED_MODULE_1__.addDie)(die);\n  });\n  (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(parsed.modifier);\n  (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.rollAllDice)();\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__.animateDiceIcons)(parsed.dice);\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_1__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.computeTotal)(), durationMs);\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n}\n\n//# sourceURL=webpack://dice_roller/./src/event-handlers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDiceIcons: () => (/* reexport safe */ _animations_dice_animations__WEBPACK_IMPORTED_MODULE_4__.animateDiceIcons),\n/* harmony export */   animateResults: () => (/* reexport safe */ _animations_dice_animations__WEBPACK_IMPORTED_MODULE_4__.animateResults),\n/* harmony export */   formatDiceInput: () => (/* reexport safe */ _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.formatDiceInput),\n/* harmony export */   formatModifier: () => (/* reexport safe */ _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.formatModifier),\n/* harmony export */   setupDiceButtons: () => (/* reexport safe */ _ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceButtons),\n/* harmony export */   setupDiceInput: () => (/* reexport safe */ _ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceInput),\n/* harmony export */   updateDisplay: () => (/* reexport safe */ _ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)\n/* harmony export */ });\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ \"./src/styles.css\");\n/* harmony import */ var _event_handlers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handlers */ \"./src/event-handlers.js\");\n/* harmony import */ var _ui_updates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-updates */ \"./src/ui-updates.js\");\n/* harmony import */ var _make_draggable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./make-draggable */ \"./src/make-draggable.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./animations/dice-animations */ \"./src/animations/dice-animations.js\");\n/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/formatting */ \"./src/utils/formatting.js\");\n\n\n\n\n\n// Initialize all UI components when the document is ready\ndocument.addEventListener('DOMContentLoaded', function () {\n  // Initial setup\n  (0,_event_handlers__WEBPACK_IMPORTED_MODULE_1__.setupEventListeners)();\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceInput)();\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceButtons)();\n\n  // Get the launch button and applet\n  var launchButton = document.getElementById('dice-roller-button');\n  var applet = document.getElementById('dice-applet');\n\n  // Set initial state explicitly\n  applet.style.display = 'none';\n\n  // Add click handler for launch button\n  launchButton.addEventListener('click', function () {\n    var isHidden = applet.style.display === 'none';\n    applet.style.display = isHidden ? 'flex' : 'none';\n  });\n\n  // Make the applet draggable\n  (0,_make_draggable__WEBPACK_IMPORTED_MODULE_3__.makeDraggable)(applet);\n});\n\n// Export UI functions for potential use in other modules\n\n\n\n\n//# sourceURL=webpack://dice_roller/./src/index.js?");

/***/ }),

/***/ "./src/make-draggable.js":
/*!*******************************!*\
  !*** ./src/make-draggable.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   makeDraggable: () => (/* binding */ makeDraggable)\n/* harmony export */ });\nfunction makeDraggable(applet) {\n  var isDragging = false;\n  var offsetX = 0;\n  var offsetY = 0;\n  applet.addEventListener('mousedown', function (e) {\n    if (e.target.closest('button')) return;\n    isDragging = true;\n    offsetX = e.clientX - applet.offsetLeft;\n    offsetY = e.clientY - applet.offsetTop;\n  });\n  document.addEventListener('mousemove', function (e) {\n    if (!isDragging) return;\n    applet.style.left = \"\".concat(e.clientX - offsetX, \"px\");\n    applet.style.top = \"\".concat(e.clientY - offsetY, \"px\");\n  });\n  document.addEventListener('mouseup', function () {\n    isDragging = false;\n  });\n  applet.addEventListener('touchstart', function (e) {\n    if (e.target.closest('button')) return;\n    e.preventDefault();\n    isDragging = true;\n    var touch = e.touches[0];\n    offsetX = touch.clientX - applet.offsetLeft;\n    offsetY = touch.clientY - applet.offsetTop;\n  }, {\n    passive: false\n  });\n  document.addEventListener('touchmove', function (e) {\n    if (!isDragging) return;\n    e.preventDefault();\n    var touch = e.touches[0];\n    applet.style.left = \"\".concat(touch.clientX - offsetX, \"px\");\n    applet.style.top = \"\".concat(touch.clientY - offsetY, \"px\");\n  }, {\n    passive: false\n  });\n  document.addEventListener('touchend', function () {\n    isDragging = false;\n  });\n}\n\n//# sourceURL=webpack://dice_roller/./src/make-draggable.js?");

/***/ }),

/***/ "./src/state.js":
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addDie: () => (/* binding */ addDie),\n/* harmony export */   clearDice: () => (/* binding */ clearDice),\n/* harmony export */   clearResults: () => (/* binding */ clearResults),\n/* harmony export */   setModifier: () => (/* binding */ setModifier),\n/* harmony export */   state: () => (/* binding */ state)\n/* harmony export */ });\nvar state = {\n  selectedDice: [],\n  currentRolls: [],\n  modifier: 0\n};\nfunction setModifier(value) {\n  state.modifier = value;\n}\nfunction clearDice() {\n  state.selectedDice = [];\n}\nfunction clearResults() {\n  state.currentRolls = [];\n}\nfunction addDie(die) {\n  state.selectedDice.push(die);\n}\n\n//# sourceURL=webpack://dice_roller/./src/state.js?");

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://dice_roller/./src/styles.css?");

/***/ }),

/***/ "./src/ui-updates.js":
/*!***************************!*\
  !*** ./src/ui-updates.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDiceIcons: () => (/* reexport safe */ _animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__.animateDiceIcons),\n/* harmony export */   animateResults: () => (/* reexport safe */ _animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__.animateResults),\n/* harmony export */   setupDiceButtons: () => (/* reexport safe */ _ui_button_handler__WEBPACK_IMPORTED_MODULE_1__.setupDiceButtons),\n/* harmony export */   setupDiceInput: () => (/* reexport safe */ _ui_input_handler__WEBPACK_IMPORTED_MODULE_0__.setupDiceInput),\n/* harmony export */   updateDisplay: () => (/* reexport safe */ _ui_display__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)\n/* harmony export */ });\n/* harmony import */ var _ui_input_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui/input-handler */ \"./src/ui/input-handler.js\");\n/* harmony import */ var _ui_button_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/button-handler */ \"./src/ui/button-handler.js\");\n/* harmony import */ var _ui_display__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/display */ \"./src/ui/display.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./animations/dice-animations */ \"./src/animations/dice-animations.js\");\n// Re-export UI components from their modular locations\n\n\n\n\n\n//# sourceURL=webpack://dice_roller/./src/ui-updates.js?");

/***/ }),

/***/ "./src/ui/button-handler.js":
/*!**********************************!*\
  !*** ./src/ui/button-handler.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupDiceButtons: () => (/* binding */ setupDiceButtons)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animations/dice-animations */ \"./src/animations/dice-animations.js\");\n/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./display */ \"./src/ui/display.js\");\n\n\n\n\nfunction setupDiceButtons() {\n  var dieButtons = document.querySelectorAll('.die-button');\n  dieButtons.forEach(function (button) {\n    button.addEventListener('click', handleDieClick);\n  });\n}\nfunction handleDieClick(e) {\n  var button = e.currentTarget;\n  var dieType = button.dataset.die;\n  console.log(\"\".concat(dieType, \" button clicked\"));\n\n  // Always add the clicked die to the pool\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.addDie)(dieType);\n\n  // Local fallback function in case import fails\n  function localRollAllDice() {\n    _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.map(function (die) {\n      var sides = parseInt(die.slice(1), 10);\n      return Math.floor(Math.random() * sides) + 1;\n    });\n  }\n  try {\n    // Try to use imported function\n    (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n  } catch (error) {\n    // Fallback to local function if import fails\n    console.error(\"Error using imported rollAllDice, using fallback\", error);\n    localRollAllDice();\n  }\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateDiceIcons)([dieType]);\n\n  // Update display after animation completes\n  setTimeout(function () {\n    try {\n      (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), durationMs);\n    } catch (error) {\n      // Fallback for compute total\n      console.error(\"Error in computeTotal, using fallback\", error);\n      var total = _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls.reduce(function (sum, roll) {\n        return sum + roll;\n      }, 0) + _state__WEBPACK_IMPORTED_MODULE_0__.state.modifier;\n      (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, total, durationMs);\n    }\n    (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n  }, durationMs);\n}\n\n//# sourceURL=webpack://dice_roller/./src/ui/button-handler.js?");

/***/ }),

/***/ "./src/ui/display.js":
/*!***************************!*\
  !*** ./src/ui/display.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   updateDisplay: () => (/* binding */ updateDisplay)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/formatting */ \"./src/utils/formatting.js\");\n\n\n\nfunction updateDisplay() {\n  var notation = (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeNotation)();\n  var diceInput = document.getElementById('dice-input');\n  var modifierOverlay = document.getElementById('modifier-overlay');\n  if (diceInput) {\n    diceInput.innerHTML = notation ? (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_2__.formatDiceInput)(notation, _state__WEBPACK_IMPORTED_MODULE_0__.state.modifier) : '';\n  }\n  if (modifierOverlay) {\n    modifierOverlay.textContent = _state__WEBPACK_IMPORTED_MODULE_0__.state.modifier > 0 ? \"+\".concat(_state__WEBPACK_IMPORTED_MODULE_0__.state.modifier) : _state__WEBPACK_IMPORTED_MODULE_0__.state.modifier || '0';\n  }\n  updateResults();\n}\nfunction updateResults() {\n  var resultsRollsEl = document.getElementById('results-rolls');\n  var resultsTotalEl = document.getElementById('results-total');\n  if (resultsRollsEl) {\n    resultsRollsEl.innerHTML = _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls.join(' + ') + (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_2__.formatModifier)(_state__WEBPACK_IMPORTED_MODULE_0__.state.modifier);\n  }\n  if (resultsTotalEl) {\n    resultsTotalEl.innerHTML = \"\\n      <div style=\\\"font-weight:bold; font-size:16px; text-align:center;\\\">TOTAL:</div>\\n      <div style=\\\"font-weight:bold; font-size:18px; text-align:center; margin-top:2px;\\\">\\n        \".concat((0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), \"\\n      </div>\");\n  }\n}\n\n//# sourceURL=webpack://dice_roller/./src/ui/display.js?");

/***/ }),

/***/ "./src/ui/input-handler.js":
/*!*********************************!*\
  !*** ./src/ui/input-handler.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupDiceInput: () => (/* binding */ setupDiceInput)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animations/dice-animations */ \"./src/animations/dice-animations.js\");\n/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./display */ \"./src/ui/display.js\");\n\n\n\n\nfunction setupDiceInput() {\n  var diceInput = document.getElementById('dice-input');\n  diceInput.contentEditable = 'true';\n  diceInput.draggable = false;\n  diceInput.addEventListener('keydown', handleInputKeyDown);\n  diceInput.addEventListener('blur', function () {\n    return (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n  });\n\n  // Global key handling\n  document.addEventListener('keydown', function (e) {\n    // Skip if we're inside the input field\n    if (document.activeElement === diceInput) return;\n    if (e.key === 'Enter') {\n      e.preventDefault();\n      // Trigger roll button\n      var rollButton = document.getElementById('roll-button');\n      if (rollButton) {\n        var clickEvent = new MouseEvent('click', {\n          bubbles: true,\n          cancelable: true,\n          view: window\n        });\n        rollButton.dispatchEvent(clickEvent);\n      }\n    } else if (e.key === 'Backspace') {\n      e.preventDefault();\n      // Trigger clear button\n      var clearButton = document.getElementById('clear-button');\n      if (clearButton) {\n        var _clickEvent = new MouseEvent('click', {\n          bubbles: true,\n          cancelable: true,\n          view: window\n        });\n        clearButton.dispatchEvent(_clickEvent);\n      }\n    } else if (e.key === 'Escape') {\n      e.preventDefault();\n      // Clear dice and hide applet\n      var _clearButton = document.getElementById('clear-button');\n      var applet = document.getElementById('dice-applet');\n      if (_clearButton) {\n        // First clear the dice\n        var _clickEvent2 = new MouseEvent('click', {\n          bubbles: true,\n          cancelable: true,\n          view: window\n        });\n        _clearButton.dispatchEvent(_clickEvent2);\n      }\n\n      // Then reset position and hide applet\n      if (applet) {\n        // Reset to center position\n        applet.style.left = '50%';\n        applet.style.top = '50%';\n        applet.style.transform = 'translate(-50%, -50%)';\n        // Hide applet\n        applet.style.display = 'none';\n      }\n    }\n  });\n}\n\n// Rename the existing handleKeyDown to handleInputKeyDown\nfunction handleInputKeyDown(e) {\n  // This only runs when the input field has focus\n  if (e.key === 'Enter') {\n    // Existing Enter key handler for input field\n    // ...rest of your existing code...\n  } else if (e.key === 'Escape') {\n    e.preventDefault();\n    (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n    e.target.blur();\n  }\n}\n\n//# sourceURL=webpack://dice_roller/./src/ui/input-handler.js?");

/***/ }),

/***/ "./src/utils/formatting.js":
/*!*********************************!*\
  !*** ./src/utils/formatting.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   formatDiceInput: () => (/* binding */ formatDiceInput),\n/* harmony export */   formatModifier: () => (/* binding */ formatModifier)\n/* harmony export */ });\nfunction formatModifier(modifier) {\n  if (modifier === 0) return '';\n  return \" <span class=\\\"modifier-display\\\">\".concat(modifier > 0 ? '+' + modifier : modifier, \"</span>\");\n}\nfunction formatDiceInput(notation, modifier) {\n  return notation + formatModifier(modifier);\n}\n\n//# sourceURL=webpack://dice_roller/./src/utils/formatting.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;