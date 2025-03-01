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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDiceIcons: () => (/* binding */ animateDiceIcons),\n/* harmony export */   animateResults: () => (/* binding */ animateResults)\n/* harmony export */ });\nfunction animateDiceIcons(dice) {\n  // Animation logic for dice icons\n  var durationMs = 1000; // Example duration\n  // Implement the animation logic here\n  return durationMs;\n}\nfunction animateResults(rolls, total, durationMs) {\n  // Animation logic for results\n  // Implement the animation logic here\n}\n\n//# sourceURL=webpack://dice_roller/./src/animations/dice-animations.js?");

/***/ }),

/***/ "./src/dice-logic.js":
/*!***************************!*\
  !*** ./src/dice-logic.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   computeNotation: () => (/* binding */ computeNotation),\n/* harmony export */   computeTotal: () => (/* binding */ computeTotal),\n/* harmony export */   parseDiceNotation: () => (/* binding */ parseDiceNotation),\n/* harmony export */   rollAllDice: () => (/* binding */ rollAllDice)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\n// Roll a single die\nfunction rollDie(sides) {\n  return Math.floor(Math.random() * sides) + 1;\n}\n\n// Roll all selected dice\nfunction rollAllDice() {\n  _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.map(function (die) {\n    var sides = parseInt(die.slice(1), 10);\n    return rollDie(sides);\n  });\n}\n\n// Compute the current dice notation\nfunction computeNotation() {\n  var diceCounts = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.reduce(function (acc, die) {\n    acc[die] = (acc[die] || 0) + 1;\n    return acc;\n  }, {});\n\n  // Always include the count—even if it is 1\n  return Object.entries(diceCounts).map(function (_ref) {\n    var _ref2 = _slicedToArray(_ref, 2),\n      die = _ref2[0],\n      count = _ref2[1];\n    return \"\".concat(count).concat(die);\n  }).join(' + ');\n}\n\n// Compute total of current rolls plus modifier\nfunction computeTotal() {\n  if (!_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls.length) return 0;\n  return _state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls.reduce(function (sum, roll) {\n    return sum + roll;\n  }, 0) + _state__WEBPACK_IMPORTED_MODULE_0__.state.modifier;\n}\n\n// Parse input notation and return dice configuration and modifier\nfunction parseDiceNotation(input) {\n  // Match both \"NdS\" (or variation with spaces) and modifiers like \"+2\"\n  var regex = /(\\d*)\\s*[dD]\\s*(\\d+)|([+-]\\s*\\d+)/g;\n  var matches = input.match(regex);\n  if (!matches) return null;\n  var dice = [];\n  var modifier = 0;\n  matches.forEach(function (match) {\n    if (match.toLowerCase().includes('d')) {\n      // Handle dice notation; if count is missing, default to 1\n      var _match$toLowerCase$sp = match.toLowerCase().split(/\\s*d\\s*/),\n        _match$toLowerCase$sp2 = _slicedToArray(_match$toLowerCase$sp, 2),\n        count = _match$toLowerCase$sp2[0],\n        sides = _match$toLowerCase$sp2[1];\n      var diceCount = count === '' ? 1 : parseInt(count, 10);\n      for (var i = 0; i < diceCount; i++) {\n        dice.push(\"d\".concat(sides));\n      }\n    } else {\n      // Handle modifiers\n      modifier += parseInt(match.replace(/\\s+/g, ''), 10);\n    }\n  });\n  return {\n    dice: dice,\n    modifier: modifier\n  };\n}\n\n//# sourceURL=webpack://dice_roller/./src/dice-logic.js?");

/***/ }),

/***/ "./src/event-handlers.js":
/*!*******************************!*\
  !*** ./src/event-handlers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupEventListeners: () => (/* binding */ setupEventListeners)\n/* harmony export */ });\n/* harmony import */ var _ui_updates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui-updates */ \"./src/ui-updates.js\");\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./animations/dice-animations */ \"./src/animations/dice-animations.js\");\n\n\n\n\nfunction setupEventListeners() {\n  console.log('Setting up event listeners');\n\n  // Add event listeners for dice input, buttons, etc.\n  var diceInput = document.getElementById('dice-input');\n  diceInput.addEventListener('keydown', handleKeyDown);\n  console.log('Added keydown event listener to dice input');\n  var clearButton = document.getElementById('clear-button');\n  clearButton.addEventListener('click', function () {\n    console.log('Clear button clicked');\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearDice)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearResults)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(0);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  console.log('Added click event listener to clear button');\n  var rollButton = document.getElementById('roll-button');\n  rollButton.addEventListener('click', function () {\n    console.log('Roll button clicked');\n    (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.rollAllDice)();\n    var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__.animateDiceIcons)(_state__WEBPACK_IMPORTED_MODULE_1__.state.currentRolls);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_1__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.computeTotal)(), durationMs);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  console.log('Added click event listener to roll button');\n  var increaseButton = document.getElementById('modify-button-increase');\n  increaseButton.addEventListener('click', function () {\n    console.log('Increase button clicked');\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(_state__WEBPACK_IMPORTED_MODULE_1__.state.modifier + 1);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  console.log('Added click event listener to increase button');\n  var decreaseButton = document.getElementById('modify-button-decrease');\n  decreaseButton.addEventListener('click', function () {\n    console.log('Decrease button clicked');\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(_state__WEBPACK_IMPORTED_MODULE_1__.state.modifier - 1);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n  });\n  console.log('Added click event listener to decrease button');\n\n  // Add event listener for closing the applet\n  var closeButton = document.getElementById('close-applet');\n  closeButton.addEventListener('click', function () {\n    console.log('Close button clicked');\n    document.getElementById('dice-applet').style.display = 'none';\n  });\n  console.log('Added click event listener to close button');\n\n  // Add event listener for clicking outside the applet\n  document.addEventListener('click', function (event) {\n    var applet = document.getElementById('dice-applet');\n    if (!applet.contains(event.target) && event.target.id !== 'dice-roller-button') {\n      console.log('Clicked outside the applet');\n      applet.style.display = 'none';\n    }\n  });\n  console.log('Added click event listener for clicking outside the applet');\n\n  // Add event listener for pressing ESC key\n  document.addEventListener('keydown', function (event) {\n    if (event.key === 'Escape') {\n      console.log('ESC key pressed');\n      document.getElementById('dice-applet').style.display = 'none';\n    }\n  });\n  console.log('Added keydown event listener for ESC key');\n}\nfunction handleKeyDown(e) {\n  if (e.key !== 'Enter') return;\n  e.preventDefault();\n  var input = e.target.textContent.trim();\n  if (!input) {\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearDice)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearResults)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(0);\n    (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n    return;\n  }\n  var parsed = (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.parseDiceNotation)(input);\n  if (parsed) {\n    processValidInput(parsed);\n  }\n}\nfunction processValidInput(parsed) {\n  (0,_state__WEBPACK_IMPORTED_MODULE_1__.clearDice)();\n  parsed.dice.forEach(function (die) {\n    return (0,_state__WEBPACK_IMPORTED_MODULE_1__.addDie)(die);\n  });\n  (0,_state__WEBPACK_IMPORTED_MODULE_1__.setModifier)(parsed.modifier);\n  (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.rollAllDice)();\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_3__.animateDiceIcons)(parsed.dice);\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_1__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_2__.computeTotal)(), durationMs);\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_0__.updateDisplay)();\n}\n\n//# sourceURL=webpack://dice_roller/./src/event-handlers.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDice: () => (/* binding */ animateDice),\n/* harmony export */   animateResults: () => (/* binding */ animateResults),\n/* harmony export */   setupDiceButtons: () => (/* binding */ setupDiceButtons),\n/* harmony export */   setupDiceInput: () => (/* binding */ setupDiceInput),\n/* harmony export */   updateDisplay: () => (/* binding */ updateDisplay),\n/* harmony export */   updateResults: () => (/* binding */ updateResults)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./animations/dice-animations */ \"./src/animations/dice-animations.js\");\nfunction updateResults(total, rolls, modifier) {\n  var resultsTotal = document.getElementById('results-total');\n  var resultsRolls = document.getElementById('results-rolls');\n  resultsTotal.querySelector('div:nth-child(2)').textContent = total + modifier;\n  resultsRolls.textContent = rolls.join(', ');\n}\nfunction animateDice(button) {\n  button.classList.add('spin');\n  setTimeout(function () {\n    button.classList.remove('spin');\n  }, 1000);\n}\n\n\n\nfunction setupDiceInput() {\n  var diceInput = document.getElementById('dice-input');\n  diceInput.contentEditable = 'true';\n  diceInput.draggable = false;\n  diceInput.addEventListener('input', function () {});\n  diceInput.addEventListener('keydown', handleKeyDown);\n  diceInput.addEventListener('blur', function () {\n    return updateDisplay();\n  });\n}\nfunction handleKeyDown(e) {\n  if (e.key !== 'Enter') return;\n  e.preventDefault();\n  var input = e.target.textContent.trim();\n  if (!input) {\n    (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearResults)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(0);\n    updateDisplay();\n    return;\n  }\n  var parsed = (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.parseDiceNotation)(input);\n  if (parsed) {\n    processValidInput(parsed);\n  }\n}\nfunction processValidInput(parsed) {\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n  parsed.dice.forEach(function (die) {\n    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.addDie)(die);\n  });\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(parsed.modifier);\n  (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateDiceIcons)(parsed.dice);\n  animateResults(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), durationMs);\n  updateDisplay();\n}\nfunction setupDiceButtons() {\n  console.log('Setting up dice button event listeners');\n  var dieButtons = document.querySelectorAll('.die-button');\n  dieButtons.forEach(function (button) {\n    button.addEventListener('click', handleDieClick);\n    console.log(\"Added click event listener to \".concat(button.dataset.die, \" button\"));\n  });\n}\nfunction handleDieClick(e) {\n  var button = e.currentTarget;\n  var dieType = button.dataset.die;\n  console.log(\"\".concat(dieType, \" button clicked\"));\n  var count = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.filter(function (die) {\n    return die === dieType;\n  }).length;\n  if (count === 0) return;\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateDiceIcons)([dieType]);\n  setTimeout(function () {\n    (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n    animateResults(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), durationMs);\n    updateDisplay();\n  }, durationMs);\n}\nfunction updateDisplay() {\n  // Implement the logic to update the display\n}\nfunction animateResults(rolls, total, durationMs) {\n  var resultsTotal = document.getElementById('results-total');\n  var resultsRolls = document.getElementById('results-rolls');\n  setTimeout(function () {\n    resultsTotal.querySelector('div:nth-child(2)').textContent = total;\n    resultsRolls.textContent = rolls.join(', ');\n  }, durationMs);\n}\n\n//# sourceURL=webpack://dice_roller/./src/ui-updates.js?");

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