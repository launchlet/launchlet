<script>
export let LRTOptions = {};
export let LRTDidFinish = null;

import { OLSK_SPEC_UI } from 'OLSKSpec'

import LCHLauncherLogic from './ui-logic.js';
import LCHLauncherAPI from './api.js';

LRTOptions = LCHLauncherLogic.LCHLauncherOptions(LRTOptions, OLSK_SPEC_UI() ? undefined : console.warn);

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[LRTOptions.LCHOptionLanguage]);
};

import fuzzysort from 'fuzzysort';
function ActivePromptFilterTextShouldUpdate (inputData) {
	(function SetFilterText() {
		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText = inputData;
	})();

	(function ClearFilterTextOnSubsequentPrompts() {
		for (var i = 0; i < mod._ValuePromptObjects.length; i++) {
			if (!i) {
				continue;
			}

			if (i === mod._ValuePromptActiveIndex) {
				continue;
			}

			mod._ValuePromptObjects[i].LCHPromptFilterText = '';
			mod._ValuePromptObjects[i].LCHPromptMatchStop = false;
		}
	})();

	(function SetMatchStop() {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptInputThrottle === false) {
			mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptMatchStop = false;
		}

		if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText) {
			mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptMatchStop = false;
		}
	})();

	(function ThrottleInput() {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText) {
			return;
		}

		const inputData = mod._ValuePromptActiveIndex;

		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValuePromptObjects[inputData], 'LCHPromptInputThrottle', {
			OLSKThrottleDuration: LCHLauncherLogic.LCHLauncherThrottleDuration,
			OLSKThrottleCallback () {
				setTimeout(function () {
					mod._ValuePromptObjects[inputData].LCHPromptInputThrottle = false;
				});
			},
		});
	})();

	(function ThrottleResults() {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}
		
		if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText) {
			return;
		}

		const inputData = mod._ValuePromptActiveIndex;

		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValuePromptObjects[inputData], 'LCHPromptResultsThrottle', {
			OLSKThrottleDuration: LCHLauncherLogic.LCHLauncherThrottleDuration,
			OLSKThrottleCallback () {
				setTimeout(function () {
					mod._ValuePromptObjects[inputData].LCHPromptResultsThrottle = false;
				});
			},
		});
	})();

	(function SetItems() {
		ActivePromptItemsShouldUpdate((function() {
			if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe() && !mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText && mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle === false) {
				return mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsVisible;
			}
			
			if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText) {
				return LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePreview() ? mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsAll : [];
			}

			const visibleRecipes = mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsAll.filter(function (e) {
				return e.LCHRecipeIsExcluded ? !e.LCHRecipeIsExcluded() : true;
			});

			let results = fuzzysort.go(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText, visibleRecipes, {
				key: 'LCHRecipeName',
			});

			if (!results.length && OLSK_SPEC_UI() && !mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText.slice(0, 3).match(/[^A-Z]/)) {
				return visibleRecipes.filter(function (e) {
					return e.LCHRecipeSignature === mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText;
				});
			};

			if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe() && mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsVisible.length && !results.length) {
				if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle) {
					OLSKThrottle.OLSKThrottleSkip(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle);
				}

				mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptMatchStop = true;

				return mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsVisible;
			}

			return results.sort(function (a, b) {
				return a.score < b.score ? 1 : (a.score > b.score ? -1 : 0);
			}).map(function (e) {
				return e.obj;
			});
		})());
	})();
}

function ActivePromptItemsShouldUpdate (inputData) {
	(function SetItems() {
		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsVisible = inputData;
	})();

	(function SetItemSelected() {
		ActivePromptItemSelectedShouldUpdate(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemsVisible[0]);
	})();
}

function ActivePromptItemSelectedShouldUpdate (inputData) {
	(function SetItemSelected() {
		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemSelected = inputData;

		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePreview()) {
			return;
		}

		mod.ControlRun(mod._ValuePromptObjects[0].LCHPromptItemSelected);
	})();

	if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
		return;
	}

	(function UpdateActionsForSubject() {
		if (mod._ValuePromptActiveIndex !== 0) {
			return;
		}

		if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptItemSelected) {
			mod._ValuePromptObjects[1].LCHPromptItemsVisible = mod._ValuePromptObjects[1].LCHPromptItemsAll = [];
			delete mod._ValuePromptObjects[1].LCHPromptItemSelected;

			return;
		}

		mod._ValuePromptObjects[1].LCHPromptItemsAll = mod._ValueAllActions.filter(function (e) {
			return mod._ValueTypeEquivalenceMap[inputData.LCHRecipeOutputType || 'Command'].filter(function (type) {
				return LCHRuntime.LCHRuntimeInputTypes(e.LCHRecipeInputTypes).shift() === type;
			}).length;
		}).sort(LCHLauncherLogic.LCHLauncherActionComparator(inputData.LCHRecipeOutputType || 'Command'));

		mod._ValuePromptObjects[1].LCHPromptItemsVisible = mod._ValuePromptObjects[1].LCHPromptItemsAll;

		mod._ValuePromptObjects[1].LCHPromptItemSelected = mod._ValuePromptObjects[1].LCHPromptItemsVisible[0];
	})();

	(function UpdateObjectsForAction() {
		if (mod._ValuePromptActiveIndex > 1) {
			return;
		}

		if (!mod._ValuePromptObjects[1].LCHPromptItemSelected) {
			return;
		}

		mod._ValuePromptObjects[2].LCHPromptIsVisible = LCHLauncherAPI.LCHRecipesActionTakesObject(mod._ValuePromptObjects[1].LCHPromptItemSelected);

		mod._ValuePromptObjects[2].LCHPromptItemsAll = !mod._ValuePromptObjects[2].LCHPromptIsVisible || LCHRuntime.LCHRuntimeInputTypes(mod._ValuePromptObjects[1].LCHPromptItemSelected.LCHRecipeInputTypes).pop() === 'String' ? [] : mod._ValueAllSubjects.filter(function (e) {
			return mod._ValueTypeEquivalenceMap[LCHRuntime.LCHRuntimeInputTypes(mod._ValuePromptObjects[1].LCHPromptItemSelected.LCHRecipeInputTypes).pop()].includes(e.LCHRecipeOutputType);
		});

		mod._ValuePromptObjects[2].LCHPromptItemsVisible = mod._ValuePromptObjects[2].LCHPromptItemsAll;

		mod._ValuePromptObjects[2].LCHPromptItemSelected = mod._ValuePromptObjects[2].LCHPromptItemsVisible[0];
	})();
}

const refactorDependancies = function () {};

import OLSKThrottle from 'OLSKThrottle';

import LCHRuntime from '../_shared/LCHRuntime/main.js'
import { LCHLauncherStandardRecipes } from './recipes/_aggregate.js';

import { LCHRunCommandRecipe } from './recipes/actions/LCHRunCommand/main.js';
import { LCHPrimitiveURLCallback } from './recipes/primitives/URL/main.js';

import * as apiComponents from './recipes/_components.js';

const mod = {

	// VALUE

	_ValuePromptActiveIndex: 0,

	_ValuePromptObjects: [],

	_ValueAllPromptRecipes: [],

	_ValueAllSubjects: [],
	_ValueAllActions: [],

	ValuePromptActiveIndex (inputData) {
		if (typeof inputData === 'undefined') {
			return mod._ValuePromptActiveIndex;
		}

		(function CancelThrottle() {
			if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
				return;
			}

			if (OLSKThrottle.OLSKThrottleIsValid(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptInputThrottle)) {
				clearTimeout(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptInputThrottle._OLSKThrottleTimeoutID);
			}
			
			mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptInputThrottle = undefined;

			if (OLSKThrottle.OLSKThrottleIsValid(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle)) {
				clearTimeout(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle._OLSKThrottleTimeoutID);
			}
			
			mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle = undefined;
		})();

		if (!mod._ValuePromptObjects[1].LCHPromptItemsAll.length) {
			return;
		}

		(function SetIndexActive() {
			mod._ValuePromptActiveIndex = inputData;
		})();

		(function ActivateDotMode() {
			if (mod._ValuePromptActiveIndex !== 2) {
				return;
			}

			if (LCHRuntime.LCHRuntimeInputTypes(mod._ValuePromptObjects[1].LCHPromptItemSelected.LCHRecipeInputTypes).pop() !== 'String') {
				return;
			}

			mod.ValuePromptDotModeEnabled(true);
			mod.ValuePromptDotModeText(mod.ValuePromptDotModeText());
		})();
	},
	ValuePromptDotModeEnabled (inputData) {
		if (typeof inputData === 'undefined') {
			return mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeEnabled;
		}

		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeEnabled = inputData;
	},
	ValuePromptDotModeText(inputData) {
		if (typeof inputData === 'undefined') {
			return mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeText;
		}

		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeText = inputData;

		ActivePromptItemsShouldUpdate(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeText ? [{
			LCHRecipeName: mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeText,
			LCHRecipeCallback () {
				return inputData;
			},
			LCHRecipeOutputType: LCHPrimitiveURLCallback(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeText) ? 'URL' : 'String',
		}] : []);
	},
	ValuePromptResultsIsVisible (inputData) {
		if (typeof inputData === 'undefined') {
			return mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle === false;
		}

		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle = inputData ? false : undefined;
	},

	// DATA

	DataComposition () {
		if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe()) {
			return {
				LCHCompositionAction: mod._ValuePromptObjects[1].LCHPromptItemSelected,
				LCHCompositionSubjectPrimary: mod._ValuePromptObjects[0].LCHPromptItemSelected,
				LCHCompositionSubjectSecondary: mod._ValuePromptObjects[2].LCHPromptItemSelected,
			};
		}

		return {
			LCHCompositionAction: Object.assign(LCHRunCommandRecipe(), {
				LCHRecipeName: OLSKLocalized('LCHStandardRecipeNames')[LCHRunCommandRecipe().LCHRecipeSignature],
			}),
			LCHCompositionSubjectPrimary: mod._ValuePromptObjects[0].LCHPromptItemSelected,
		};
	},

	// INTERFACE

	InterfaceBodyDidClick (event) {
		if (!mod._ValueComponentDidMount) {
			return;
		};
		
		if (mod._ValueRootElementInstance.contains(event.target)) {
	  	return;
		}

		mod.ControlExit();
	},

	interfaceDidClickPrompt (inputData) {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		mod.ValuePromptActiveIndex(mod._ValuePromptObjects.indexOf(inputData));
	},
	interfaceDidKeydown (event) {
		mod.ControlHandleEventKeydown(event);
	},

	InterfaceDotModeFieldDidInput (event) {
		mod.ValuePromptDotModeText(this.value);
	},

	// CONTROL
	
	_ControlHandleEventKeydownModeDotMode (event) {
		const handlerFunctions = {
			Escape () {
				event.preventDefault();
				event.stopPropagation();

				return mod.ValuePromptDotModeEnabled(false) || true;
			},
			Tab () {
				event.preventDefault();
				event.stopPropagation();
				
				if (!mod.ValuePromptDotModeText()) {
					return true;
				}
				
				return mod.ValuePromptDotModeEnabled(false);
			},
			Enter () {
				return mod.ValuePromptDotModeEnabled(false);
			},
		};

		if (!handlerFunctions[event.key]) {
			return true;
		}

		return handlerFunctions[event.key]();
	},
	_ControlHandleEventKeydownEscape (event) {
		event.preventDefault();
		event.stopPropagation();

		if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe() && mod.ValuePromptResultsIsVisible()) {
			return mod.ValuePromptResultsIsVisible(false);
		}

		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe() && mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText) {
			return ActivePromptFilterTextShouldUpdate('');
		}

		mod.ControlExit();
	},
	_ControlHandleEventKeydownTab (event) {
		event.preventDefault();

		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		mod.ValuePromptActiveIndex(LCHLauncherLogic.LCHLauncherConstrainIndex(mod._ValuePromptObjects.filter(function (e) {
			return e.LCHPromptIsVisible;
		}), mod._ValuePromptActiveIndex + (event.shiftKey ? -1 : 1) * (function () {
			if (!mod._ValuePromptActiveIndex && mod._ValuePromptObjects[2].LCHPromptIsVisible && mod._ValuePromptObjects[1].LCHPromptItemsAll.length === 1) {
				return 2;
			}

			return 1;
		})()));
	},
	_ControlHandleEventKeydownEnter (event) {
		event.preventDefault();
		event.stopPropagation();

		if (LCHLauncherAPI.LCHCompositionErrors(mod.DataComposition())) {
			return;
		}

		mod.ControlTerminate();
	},
	_ControlHandleEventKeydownArrow (event) {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		event.preventDefault();

		if (!mod.ValuePromptResultsIsVisible()) {
			return mod.ValuePromptResultsIsVisible(true);
		}

		if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle) {
			return;
		}

		OLSKThrottle.OLSKThrottleSkip(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle);
	},
	_ControlHandleEventKeydownArrowDown (event) {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		event.preventDefault();

		if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle === undefined) {
			mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle = false;
			return;
		}

		if (!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle) {
			return;
		}

		OLSKThrottle.OLSKThrottleSkip(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle);
	},
	_ControlHandleEventKeydownDot (event) {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		event.preventDefault();

		if (mod._ValuePromptActiveIndex !== 0) {
			return;
		}
		
		if (OLSKThrottle.OLSKThrottleIsValid(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle)) {
			clearTimeout(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle._OLSKThrottleTimeoutID);
		}

		mod.ValuePromptResultsIsVisible(false);
		mod.ValuePromptDotModeEnabled(true);
		ActivePromptFilterTextShouldUpdate('');
		mod.ValuePromptDotModeText(mod.ValuePromptDotModeText());

		if (mod.ValuePromptDotModeText()) {
			return;
		}

		mod._ValuePromptObjects[1].LCHPromptItemsAll = [];
		mod._ValuePromptObjects[1].LCHPromptItemsVisible = [];
		delete mod._ValuePromptObjects[1].LCHPromptItemSelected;
	},
	_ControlHandleEventKeydownBackspace (event) {
		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		event.preventDefault();

		if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle) {
			return ActivePromptFilterTextShouldUpdate(mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText.slice(0, -1));
		}

		if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText) {
			mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptMatchStop = false;
			return ActivePromptFilterTextShouldUpdate('');
		}

		ActivePromptItemsShouldUpdate([]);

		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptResultsThrottle = undefined;

		mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeText = '';
	},
	ControlHandleEventKeydown (event) {
		if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeEnabled && mod._ControlHandleEventKeydownModeDotMode(event)) {
			return;
		}

		const handlerFunctions = {
			Escape: mod._ControlHandleEventKeydownEscape,
			Tab: mod._ControlHandleEventKeydownTab,
			'.': mod._ControlHandleEventKeydownDot,
			Enter: mod._ControlHandleEventKeydownEnter,
			ArrowUp: mod._ControlHandleEventKeydownArrow,
			ArrowDown: mod._ControlHandleEventKeydownArrowDown,
			Backspace: mod._ControlHandleEventKeydownBackspace,
		};

		if (handlerFunctions[event.key]) {
			return handlerFunctions[event.key](event);
		}

		if (mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptDotModeEnabled) {
			return;
		}

		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}

		event.preventDefault();

		if (!LCHLauncherLogic.LCHLauncherKeyboardEventIsTextInput(event)) {
			return;
		}

		ActivePromptFilterTextShouldUpdate(!mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptInputThrottle ? event.key : mod._ValuePromptObjects[mod._ValuePromptActiveIndex].LCHPromptFilterText + event.key);
	},
	ControlReloadSubjects (inputData) {
		let reloadSubjects = LCHLauncherLogic.LCHLauncherReloadableSubjects([inputData]);
		
		if (!reloadSubjects.length) {
			return false;
		};

		mod._ValuePromptObjects[0].LCHPromptItemsVisible = [];
		mod._ValuePromptObjects[0].LCHPromptItemsAll = reloadSubjects;

		mod.ValuePromptActiveIndex(0);

		ActivePromptItemSelectedShouldUpdate(reloadSubjects[0]);
		
		return true;
	},
	async ControlTerminate () {
		if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe()) {
			if (mod.ControlReloadSubjects(await mod.ControlRun(mod.DataComposition()))) {
				return;
			};
		}

		if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModeCommit()) {
			await mod.ControlRun(mod._ValuePromptObjects[0].LCHPromptItemSelected);
		}

		mod.ControlExit();
	},

	async ControlRun(inputData) {
		return mod._ControlRun(inputData.LCHCompositionAction ? await LCHLauncherAPI.LCHAPIExecuteComposition(inputData, mod._ValueSharedAPI) : await LCHLauncherAPI.LCHAPIExecuteRecipe(inputData, [], mod._ValueSharedAPI));
	},

	async _ControlRun(inputData) {
		if (!inputData) {
			return Promise.resolve(inputData);
		}

		if (typeof inputData !== 'object') {
			return Promise.resolve(inputData);
		}

		if (LCHLauncherAPI.LCHComponentDescriptorsErrors(inputData)) {
			return Promise.resolve(inputData);
		}

		return new Promise(function (resolve, reject) {
			let LCHInstanceProps = inputData.LCHComponentDescriptorProps;

			if (inputData.LCHComponentDescriptorOLSKLocalized) {
				Object.assign(LCHInstanceProps, {
					OLSKLocalized,
				});
			};

			LCHInstanceProps[inputData.LCHComponentDescriptorCompletionHandlerSignature] = function () {
				delete mod._ValueSecondaryComponentDescriptor;

				mod.ControlExit();
			};

			mod._ValueSecondaryComponentDescriptor = {
				LCHInstanceClass: apiComponents[inputData.LCHComponentDescriptorName],
				LCHInstanceProps,
			};
		});
	},

	ControlExit () {
		if (mod._ValueFilterInputInstance === document.activeElement) {
			mod._ValueFilterInputInstance.blur();
		};

		if (typeof LRTDidFinish !== 'function') {
			return;
		}

		return LRTDidFinish();
	},

	// REACT

	ReactFocusFilterInput () {
		if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe()) {
			return;
		}
		
		setTimeout(function () {
			mod._ValueFilterInputInstance.focus();
		}, 20);
	},

	ReactScrollSelectedItemIntoView() {
		if (OLSK_SPEC_UI()) {
			return;
		}

		/* OLSKResultsListCapAndScroll */
		let element = document.querySelector('.OLSKResultsListItemSelected');

		if (!element) {
			return;
		}

		element.scrollIntoView({
			block: 'nearest',
			inline: 'nearest',
		});
	},

	// SETUP

	async SetupEverything() {
		mod.SetupSharedRecipes();

		await mod.SetupPageRecipes();

		mod.SetupSharedAPI();

		mod.SetupTasks();

		mod.SetupPromptObjects();
	},

	SetupSharedRecipes() {
		mod._ValueSharedRecipes = LCHLauncherStandardRecipes().map(function (e) {
			return Object.assign(e, {
				LCHRecipeName: e.LCHRecipeName || OLSKLocalized('LCHStandardRecipeNames')[e.LCHRecipeSignature], // #purge
			})
		}).concat(LCHLauncherAPI.LCHRuntimeFilteredRecipes(LRTOptions.LCHOptionRecipes, window.location.href));
	},

	async SetupPageRecipes() {
		if (!LRTOptions.LCHOptionIncludePageRecipes) {
			return;
		};

		let inputData = window.LCHPageRecipes;

		if (!inputData) {
			inputData = (window.wrappedJSObject || {}).LCHPageRecipes;
		};

		if (!inputData && window.location.origin && window.location.origin !== 'null') { // about:blank has no origin
			await (new Promise(function (resolve, reject) {
				function receiveMessage(event) {
					if (event.source !== window && !OLSK_SPEC_UI()) {
					  return console.log('not window');
					}

					if (event.data === 'LCHPageRecipes') {
					  return;
					}

					if (!Array.isArray(event.data)) {
						return;
					}

					window.removeEventListener('message', receiveMessage);

					inputData = event.data.filter(function (e) {
						return !LCHLauncherAPI.LCHRecipeProxyErrors(e);
					}).map(function (e) {
						return {
							LCHRecipeName: e.LCHRecipeProxyName,
							LCHRecipeSignature: e.LCHRecipeProxySignature,
							LCHRecipeCallback () {
								window.postMessage(e.LCHRecipeProxySignature, window.location.origin);
							},
						};
					});

					resolve();
				};

				window.addEventListener('message', receiveMessage, false);

				window.postMessage('LCHPageRecipes', window.location.origin);

				setTimeout(resolve, 20);
			}))
		};

		if (!Array.isArray(inputData)) {
			return;
		}

		mod._ValueSharedRecipes.push(...Array.from(inputData).map(function (e) {
			delete e.LCHRecipeURLFilter;
			delete e.LCHRecipeIsAutomatic;

			e._LCHRecipeSource = window.location.host;
			
			return e;
		}).filter(function(e) {
			return !LCHLauncherAPI.LCHRecipesErrors(e);
		}));
	},

	SetupSharedAPI() {
		mod._ValueSharedAPI = LCHRuntime.LCHRuntimeAPI(mod._ValueSharedRecipes);
	},

	SetupTasks() {
		if (!LRTOptions.LCHOptionRunAutomaticRecipes) {
			return;
		};

		LCHLauncherAPI.LCHAPIRunTasks(mod._ValueSharedRecipes, window.location.href);
	},

	SetupPromptObjects () {
		mod._ValueAllPromptRecipes = LCHLauncherLogic.LCHLauncherUIRecipesForMode(mod._ValueSharedRecipes, LRTOptions.LCHOptionMode);

		if (LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe()) {
			mod._ValueTypeEquivalenceMap = LCHLauncherAPI.LCHAPITypeEquivalenceMapForRecipes(mod._ValueSharedRecipes);
			
			const typeNameMap = LCHLauncherAPI.LCHAPITypeNameMap(mod._ValueSharedRecipes);

			mod._ValueAllSubjects = mod._ValueAllPromptRecipes.filter(function (e) {
				if (LCHLauncherAPI.LCHRecipesIsSubject(e)) {
					return true;
				};

				if (LCHLauncherAPI.LCHRecipesIsCommand(e)) {
					return true;
				};

				return false;
			}).filter(function (e) {
				return !e.LCHRecipeOutputType || Object.keys(mod._ValueTypeEquivalenceMap).includes(e.LCHRecipeOutputType);
			}).map(function (e) {
				return Object.assign(e, {
					_LCHRecipeOutputTypeName: typeNameMap[e.LCHRecipeOutputType],
				})
			});

			mod._ValueAllActions = mod._ValueAllPromptRecipes.filter(LCHLauncherAPI.LCHRecipesIsAction);

			const _ActionableTypesForPrimarySubject = Object.keys(mod._ValueTypeEquivalenceMap).filter(function (type) {
				return mod._ValueAllActions.filter(function (e) {
					return LCHRuntime.LCHRuntimeInputTypes(e.LCHRecipeInputTypes).shift() === type;
				}).length;
			});

			return mod._ValuePromptObjects.push(...[{
				LCHPromptClass: 'LCHLauncherSubjectPrompt',
				LCHPromptHeading: OLSKLocalized('LCHLauncherSubjectPromptHeadingText'),
				LCHPromptItemsVisible: [],
				LCHPromptItemsAll: mod._ValueAllSubjects.filter(function (e) {
					return !e.LCHRecipeOutputType || _ActionableTypesForPrimarySubject.includes(e.LCHRecipeOutputType);
				}),
				// LCHPromptItemSelected: null,
				LCHPromptInputThrottle: undefined,
				LCHPromptFilterText: '',
				LCHPromptMatchStop: false,
				LCHPromptResultsThrottle: undefined,
				LCHPromptDotModeText: '',
				LCHPromptIsVisible: true,
			}, {
				LCHPromptClass: 'LCHLauncherActionPrompt',
				LCHPromptHeading: OLSKLocalized('LCHLauncherActionPromptHeadingText'),
				LCHPromptItemsVisible: [],
				LCHPromptItemsAll: [],
				// LCHPromptItemSelected: null,
				LCHPromptInputThrottle: undefined,
				LCHPromptFilterText: '',
				LCHPromptMatchStop: false,
				LCHPromptResultsThrottle: undefined,
				LCHPromptIsVisible: true,
			}, {
				LCHPromptClass: 'LCHLauncherObjectPrompt',
				LCHPromptHeading: OLSKLocalized('LCHLauncherObjectPromptHeadingText'),
				LCHPromptItemsVisible: [],
				LCHPromptItemsAll: [],
				// LCHPromptItemSelected: null,
				LCHPromptInputThrottle: undefined,
				LCHPromptFilterText: '',
				LCHPromptMatchStop: false,
				LCHPromptResultsThrottle: undefined,
				LCHPromptDotModeText: '',
				LCHPromptIsVisible: false,
			}]);
		}

		mod._ValuePromptObjects.push({
			LCHPromptClass: 'LCHLauncherFilterPrompt',
			LCHPromptItemsVisible: [],
			LCHPromptItemsAll: mod._ValueAllPromptRecipes,
			LCHPromptFilterText: '',
			LCHPromptResultsThrottle: false,
			LCHPromptIsVisible: true,
		 });

		if (LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePreview()) {
			return;
		}

		mod._ValuePromptObjects[0].LCHPromptItemsVisible = mod._ValuePromptObjects[0].LCHPromptItemsAll;

		mod._ValuePromptObjects[0].LCHPromptItemSelected = mod._ValuePromptObjects[0].LCHPromptItemsAll.filter(function (e) {
			return e._LCHRecipeIsSelected;
		}).shift();
	},

	// LIFECYCLE

	LifecycleModuleWillMount() {
		mod.SetupEverything();
	},

	LifecycleModuleDidMount() {
		setTimeout(function () {
			mod._ValueComponentDidMount = true;
		}, 100)
		// mod.ReactFocusFilterInput();
	},

	LifecycleModuleDidUpdate() {
		mod.ReactScrollSelectedItemIntoView();
	},

};

mod.LifecycleModuleWillMount();

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleDidMount);

import { afterUpdate } from 'svelte';
afterUpdate(mod.LifecycleModuleDidUpdate);

import LCHLauncherPrompt from './submodules/LCHLauncherPrompt/main.svelte';
import LCHLauncherPipeItem from './submodules/LCHLauncherPipeItem/main.svelte';
</script>
<svelte:window on:keydown={ mod.interfaceDidKeydown } on:click={ mod.InterfaceBodyDidClick } on:touchstart={ mod.InterfaceBodyDidClick }/>

<div class="Container LCHLauncher" bind:this={ mod._ValueRootElementInstance }>

{#each mod._ValuePromptObjects as e}

{#if e.LCHPromptIsVisible}

<div class={ e.LCHPromptClass } class:LCHLauncherPromptSelected={ mod._ValuePromptObjects[mod._ValuePromptActiveIndex] === e } on:click={ () => mod.interfaceDidClickPrompt(e) }>
	{#if LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePipe()}
		<strong class="LCHLauncherPromptHeading" class:LCHLauncherPromptHeadingMatchStop={ e.LCHPromptMatchStop }>{ e.LCHPromptFilterText && e.LCHPromptFilterText.toUpperCase() || e.LCHPromptHeading }</strong>
	{/if}

	<LCHLauncherPrompt
		PromptItems={ e.LCHPromptItemsVisible }
		ItemSelected={ e.LCHPromptItemSelected }
		ItemSelectedHidden={ LRTOptions.LCHOptionMode !== LCHLauncherLogic.LCHLauncherModePipe() || e.LCHPromptDotModeEnabled }
		ResultsHidden={ e.LCHPromptResultsThrottle !== false }
		on:ResultListDispatchArrow={ (event) => ActivePromptItemSelectedShouldUpdate(event.detail) }
		on:ResultListDispatchClick={ (event) => ActivePromptItemSelectedShouldUpdate(event.detail) || mod.ControlTerminate() }
		>
		{#if e.LCHPromptClass === 'LCHLauncherSubjectPrompt' && !e.LCHPromptDotModeEnabled }
			<span class="LCHLauncherSubjectPromptPlaceholder">{ OLSKLocalized('LCHLauncherSubjectPromptPlaceholderText') }</span>
		{/if}

		{#if e.LCHPromptClass === 'LCHLauncherFilterPrompt' }
			<input class="LCHLauncherFilterInput" placeholder="{ LRTOptions.LCHOptionMode === LCHLauncherLogic.LCHLauncherModePreview() ? OLSKLocalized('LCHLauncherInputPlaceholderPreview') : OLSKLocalized('LCHLauncherInputPlaceholderDefault') }" bind:value={ mod._ValuePromptObjects[0].LCHPromptFilterText } bind:this={ mod._ValueFilterInputInstance } on:input={ () => ActivePromptFilterTextShouldUpdate(mod._ValueFilterInputInstance.value) } autofocus />
		{/if}

		{#if !['LCHLauncherFilterPrompt', 'LCHLauncherActionPrompt'].includes(e.LCHPromptClass) && e.LCHPromptDotModeEnabled }
			<input bind:value={ e.LCHPromptDotModeText } on:input={ mod.InterfaceDotModeFieldDidInput } class="LCHLauncherPromptDotModeInput" autofocus />
		{/if}
	</LCHLauncherPrompt>
</div>

{/if}

{/each}

{#if OLSK_SPEC_UI() }
	<button id="TestLCHDebugCloseButton" on:click={ mod.ControlExit }></button>
{/if}

</div>
	
{#if mod._ValueSecondaryComponentDescriptor}
	<svelte:component this={ mod._ValueSecondaryComponentDescriptor.LCHInstanceClass } {...mod._ValueSecondaryComponentDescriptor.LCHInstanceProps} />
{/if}

<style src="./ui-style.css"></style>
