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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDiceIcons: () => (/* binding */ animateDiceIcons),\n/* harmony export */   animateResults: () => (/* binding */ animateResults)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/state.js\");\n/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/formatting */ \"./src/utils/formatting.js\");\nfunction _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _iterableToArray(r) { if (\"undefined\" != typeof Symbol && null != r[Symbol.iterator] || null != r[\"@@iterator\"]) return Array.from(r); }\nfunction _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\n\n\nfunction animateDiceIcons(diceConfig) {\n  var baseTime = 0.2;\n  var diceCount = diceConfig.reduce(function (acc, die) {\n    acc[die] = (acc[die] || 0) + 1;\n    return acc;\n  }, {});\n  Object.keys(diceCount).forEach(function (dieType) {\n    var spins = diceCount[dieType];\n    var durationSec = spins * baseTime;\n    var durationMs = durationSec * 1000;\n    document.querySelectorAll(\".die-button[data-die=\\\"\".concat(dieType, \"\\\"]\")).forEach(function (button) {\n      var img = button.querySelector('img');\n      img.style.setProperty('--rotations', spins);\n      img.style.animation = 'none';\n      img.offsetHeight;\n      img.style.animation = \"spin \".concat(durationSec, \"s cubic-bezier(0.0, 0.0, 0.2, 1) forwards\");\n      setTimeout(function () {\n        return img.style.animation = '';\n      }, durationMs);\n    });\n  });\n  return Math.max.apply(Math, _toConsumableArray(Object.values(diceCount))) * baseTime * 1000;\n}\nfunction animateResults(finalResults, finalTotal, durationMs) {\n  var resultsRollsEl = document.getElementById('results-rolls');\n  var resultsTotalEl = document.getElementById('results-total');\n  var intervalTime = 50;\n  var iterations = Math.floor(durationMs / intervalTime);\n  var counter = 0;\n  var interval = setInterval(function () {\n    var tempResults = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.map(function (die) {\n      var sides = parseInt(die.slice(1), 10);\n      return Math.floor(Math.random() * sides) + 1;\n    });\n    resultsRollsEl.innerHTML = tempResults.join(' + ');\n    counter++;\n    if (counter >= iterations) {\n      clearInterval(interval);\n      resultsRollsEl.innerHTML = finalResults.join(' + ') + (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_1__.formatModifier)(_state__WEBPACK_IMPORTED_MODULE_0__.state.modifier);\n      resultsTotalEl.innerHTML = \"\\n        <div style=\\\"font-weight:bold; font-size:16px; text-align:center;\\\">TOTAL:</div>\\n        <div style=\\\"font-weight:bold; font-size:18px; text-align:center; margin-top:2px;\\\">\\n          \".concat(finalTotal, \"\\n        </div>\");\n    }\n  }, intervalTime);\n}\n\n//# sourceURL=webpack://dice_roller/./src/animations/dice-animations.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupEventListeners: () => (/* binding */ setupEventListeners)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _ui_updates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-updates */ \"./src/ui-updates.js\");\n\n\n\nfunction minimizeAndReset(container) {\n  container.style.display = 'none';\n  container.style.top = '50%';\n  container.style.left = '50%';\n  container.style.transform = 'translate(-50%, -50%)';\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearResults)();\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(0);\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n}\nfunction setupEventListeners() {\n  var rollButton = document.getElementById('roll-button');\n  var clearButton = document.getElementById('clear-button');\n  var addModifierBtn = document.getElementById('add-modifier');\n  var subtractModifierBtn = document.getElementById('subtract-modifier');\n  var dieButtons = document.querySelectorAll('.die-button');\n  var diceInput = document.getElementById('dice-input');\n  var toggleAppletBtn = document.getElementById('dice-roller-button');\n  var closeAppletBtn = document.getElementById('close-applet');\n  var diceContainer = document.getElementById('dice-applet');\n\n  // Handle clicking outside\n  document.addEventListener('click', function (e) {\n    if (diceContainer && !diceContainer.contains(e.target) && e.target !== toggleAppletBtn) {\n      minimizeAndReset(diceContainer);\n    }\n  });\n\n  // Global keyboard events\n  document.addEventListener('keydown', function (e) {\n    if (!diceContainer || diceContainer.style.display === 'none') return;\n    switch (e.key) {\n      case 'Enter':\n        e.preventDefault();\n        (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n        (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), 500);\n        (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n        break;\n      case 'Backspace':\n      case 'Delete':\n        e.preventDefault();\n        (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n        (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearResults)();\n        (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(0);\n        (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n        break;\n      case 'Escape':\n        e.preventDefault();\n        minimizeAndReset(diceContainer);\n        break;\n    }\n  });\n  if (toggleAppletBtn) {\n    toggleAppletBtn.addEventListener('click', function (e) {\n      e.preventDefault();\n      e.stopPropagation();\n      if (diceContainer) {\n        if (diceContainer.style.display === 'none' || diceContainer.style.display === '') {\n          diceContainer.style.display = 'flex';\n        } else {\n          minimizeAndReset(diceContainer);\n        }\n      }\n    });\n  }\n  if (closeAppletBtn) {\n    closeAppletBtn.addEventListener('click', function () {\n      minimizeAndReset(diceContainer);\n    });\n  }\n  if (rollButton) {\n    rollButton.addEventListener('click', function () {\n      (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), 500);\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n    });\n  }\n  if (clearButton) {\n    clearButton.addEventListener('click', function () {\n      (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n      (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearResults)();\n      (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(0);\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n    });\n  }\n  if (addModifierBtn) {\n    addModifierBtn.addEventListener('click', function () {\n      (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(_state__WEBPACK_IMPORTED_MODULE_0__.state.modifier + 1);\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n    });\n  }\n  if (subtractModifierBtn) {\n    subtractModifierBtn.addEventListener('click', function () {\n      (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(_state__WEBPACK_IMPORTED_MODULE_0__.state.modifier - 1);\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n    });\n  }\n  dieButtons.forEach(function (button) {\n    button.addEventListener('click', function () {\n      var die = button.dataset.die;\n      (0,_state__WEBPACK_IMPORTED_MODULE_0__.addDie)(die);\n      (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), 500);\n      (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n    });\n  });\n\n  // Handle dice notation input\n  diceInput.addEventListener('keydown', function (e) {\n    if (e.key === 'Enter') {\n      e.preventDefault();\n      var parsed = (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.parseDiceNotation)(diceInput.value);\n      if (parsed) {\n        (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n        parsed.dice.forEach(function (die) {\n          return (0,_state__WEBPACK_IMPORTED_MODULE_0__.addDie)(die);\n        });\n        (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(parsed.modifier);\n        (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n        (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), 500);\n        (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n      }\n    }\n  });\n}\n\n//# sourceURL=webpack://dice_roller/./src/event-handlers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animateDiceIcons: () => (/* reexport safe */ _animations_dice_animations__WEBPACK_IMPORTED_MODULE_4__.animateDiceIcons),\n/* harmony export */   animateResults: () => (/* reexport safe */ _animations_dice_animations__WEBPACK_IMPORTED_MODULE_4__.animateResults),\n/* harmony export */   formatDiceInput: () => (/* reexport safe */ _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.formatDiceInput),\n/* harmony export */   formatModifier: () => (/* reexport safe */ _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.formatModifier),\n/* harmony export */   setupDiceButtons: () => (/* reexport safe */ _ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceButtons),\n/* harmony export */   setupDiceInput: () => (/* reexport safe */ _ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceInput),\n/* harmony export */   updateDisplay: () => (/* reexport safe */ _ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)\n/* harmony export */ });\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ \"./src/styles.css\");\n/* harmony import */ var _event_handlers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handlers */ \"./src/event-handlers.js\");\n/* harmony import */ var _ui_updates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-updates */ \"./src/ui-updates.js\");\n/* harmony import */ var _make_draggable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./make-draggable */ \"./src/make-draggable.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./animations/dice-animations */ \"./src/animations/dice-animations.js\");\n/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/formatting */ \"./src/utils/formatting.js\");\n\n\n\n\n\n// Initialize all UI components when the document is ready\ndocument.addEventListener('DOMContentLoaded', function () {\n  // Set up core UI event listeners\n  (0,_event_handlers__WEBPACK_IMPORTED_MODULE_1__.setupEventListeners)();\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceInput)();\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.setupDiceButtons)();\n\n  // Initialize draggable functionality\n  var applet = document.getElementById('dice-applet');\n  if (applet) {\n    (0,_make_draggable__WEBPACK_IMPORTED_MODULE_3__.makeDraggable)(applet);\n    // Set initial state of applet to hidden\n    applet.style.display = 'none';\n  }\n\n  // Initialize the display\n  (0,_ui_updates__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)();\n});\n\n// Export UI functions for potential use in other modules\n\n\n\n\n//# sourceURL=webpack://dice_roller/./src/index.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addDie: () => (/* binding */ addDie),\n/* harmony export */   addResult: () => (/* binding */ addResult),\n/* harmony export */   clearDice: () => (/* binding */ clearDice),\n/* harmony export */   clearResults: () => (/* binding */ clearResults),\n/* harmony export */   setModifier: () => (/* binding */ setModifier),\n/* harmony export */   state: () => (/* binding */ state)\n/* harmony export */ });\nvar state = {\n  selectedDice: [],\n  // Array of selected dice (e.g., [\"d4\", \"d6\", \"d6\"])\n  currentRolls: [],\n  // Array of current roll results\n  modifier: 0 // Modifier to add to the total\n};\n\n// Add a die to the selectedDice array\nfunction addDie(die) {\n  state.selectedDice.push(die);\n}\n\n// Clear all selected dice\nfunction clearDice() {\n  state.selectedDice = [];\n}\n\n// Set the modifier value\nfunction setModifier(mod) {\n  state.modifier = mod;\n}\n\n// Add a roll result to the currentRolls array\nfunction addResult(result) {\n  state.currentRolls.push(result);\n}\n\n// Clear all roll results\nfunction clearResults() {\n  state.currentRolls = [];\n}\n\n//# sourceURL=webpack://dice_roller/./src/state.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupDiceButtons: () => (/* reexport safe */ _ui_button_handler__WEBPACK_IMPORTED_MODULE_1__.setupDiceButtons),\n/* harmony export */   setupDiceInput: () => (/* reexport safe */ _ui_input_handler__WEBPACK_IMPORTED_MODULE_0__.setupDiceInput),\n/* harmony export */   updateDisplay: () => (/* reexport safe */ _ui_display__WEBPACK_IMPORTED_MODULE_2__.updateDisplay)\n/* harmony export */ });\n/* harmony import */ var _ui_input_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui/input-handler */ \"./src/ui/input-handler.js\");\n/* harmony import */ var _ui_button_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/button-handler */ \"./src/ui/button-handler.js\");\n/* harmony import */ var _ui_display__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/display */ \"./src/ui/display.js\");\n// Re-export UI components from their modular locations\n\n\n\n\n//# sourceURL=webpack://dice_roller/./src/ui-updates.js?");

/***/ }),

/***/ "./src/ui/button-handler.js":
/*!**********************************!*\
  !*** ./src/ui/button-handler.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupDiceButtons: () => (/* binding */ setupDiceButtons)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animations/dice-animations */ \"./src/animations/dice-animations.js\");\n/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./display */ \"./src/ui/display.js\");\n\n\n\n\nfunction setupDiceButtons() {\n  var dieButtons = document.querySelectorAll('.die-button');\n  dieButtons.forEach(function (button) {\n    button.addEventListener('click', handleDieClick);\n  });\n}\nfunction handleDieClick(e) {\n  var button = e.currentTarget;\n  var dieType = button.dataset.die;\n  var count = _state__WEBPACK_IMPORTED_MODULE_0__.state.selectedDice.filter(function (die) {\n    return die === dieType;\n  }).length;\n  if (count === 0) return;\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateDiceIcons)([dieType]);\n  setTimeout(function () {\n    (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n    (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), durationMs);\n    (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n  }, durationMs);\n}\n\n//# sourceURL=webpack://dice_roller/./src/ui/button-handler.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupDiceInput: () => (/* binding */ setupDiceInput)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/state.js\");\n/* harmony import */ var _dice_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dice-logic */ \"./src/dice-logic.js\");\n/* harmony import */ var _animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animations/dice-animations */ \"./src/animations/dice-animations.js\");\n/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./display */ \"./src/ui/display.js\");\n\n\n\n\nfunction setupDiceInput() {\n  var diceInput = document.getElementById('dice-input');\n  diceInput.contentEditable = 'true';\n  diceInput.draggable = false;\n  diceInput.addEventListener('input', function () {});\n  diceInput.addEventListener('keydown', handleKeyDown);\n  diceInput.addEventListener('blur', function () {\n    return (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n  });\n}\nfunction handleKeyDown(e) {\n  if (e.key !== 'Enter') return;\n  e.preventDefault();\n  var input = e.target.textContent.trim();\n  if (!input) {\n    (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearResults)();\n    (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(0);\n    (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n    return;\n  }\n  var parsed = (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.parseDiceNotation)(input);\n  if (parsed) {\n    processValidInput(parsed);\n  }\n}\nfunction processValidInput(parsed) {\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.clearDice)();\n  parsed.dice.forEach(function (die) {\n    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.addDie)(die);\n  });\n  (0,_state__WEBPACK_IMPORTED_MODULE_0__.setModifier)(parsed.modifier);\n  (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.rollAllDice)();\n  var durationMs = (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateDiceIcons)(parsed.dice);\n  (0,_animations_dice_animations__WEBPACK_IMPORTED_MODULE_2__.animateResults)(_state__WEBPACK_IMPORTED_MODULE_0__.state.currentRolls, (0,_dice_logic__WEBPACK_IMPORTED_MODULE_1__.computeTotal)(), durationMs);\n  (0,_display__WEBPACK_IMPORTED_MODULE_3__.updateDisplay)();\n}\n\n//# sourceURL=webpack://dice_roller/./src/ui/input-handler.js?");

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