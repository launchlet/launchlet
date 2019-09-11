export const LCHComposeBuildValidBuildTokens = function () {
	return [
		'LCHComposeBuildToken_AppBehaviour',
		'LCHComposeBuildToken_AppStyle',
		'LCHComposeBuildToken_DocumentObjects',
		'LCHComposeBuildToken_AppLanguageCode',
		'LCHComposeBuildToken_LCHLauncherMode',
		'LCHComposeBuildToken_LCHComposeRecipeName',
		'LCHComposeBuildToken_LCHComposeRecipeCallbackOutput',
	];
};

export const LCHComposeBuildBoomarkletTemplate = function () {
	let _protectFromCompiler = console.log;

	window.LCHBookmarklet = {
		uiStyle: function () {
			return _protectFromCompiler(`LCHComposeBuildToken_AppStyle`);
		},
		uiBehaviour: function () {
			_protectFromCompiler(`LCHComposeBuildToken_AppBehaviour`);

			return this.Main;
		},
		instanceCreate: function () {
			if (window.LCHBookmarklet.AppInstance) {
				window.LCHBookmarklet.instanceDestroy();
			}

			let sandboxContainer = document.createElement('div');
			sandboxContainer.className = 'ProofSvelteBookmarketSandbox'
			document.body.appendChild(sandboxContainer);
			
			sandboxContainer.appendChild(document.createElement('style')).innerHTML = window.LCHBookmarklet.uiStyle();
			
			window.LCHBookmarklet.AppInstance = new (window.LCHBookmarklet.uiBehaviour())({
				target: sandboxContainer,
				props: {
					dataObjects: _protectFromCompiler(`LCHComposeBuildToken_DocumentObjects`).concat({
						LCHRecipeName: 'LCHComposeBuildToken_LCHComposeRecipeName',
						LCHRecipeCallback () {
							return 'LCHComposeBuildToken_LCHComposeRecipeCallbackOutput';
						},
						LCHRecipeOutputType: 'URL',
					}),
					completionHandler () {
						return window.LCHBookmarklet.instanceDestroy();
					},
					optionsObject: {
						languageCode: 'LCHComposeBuildToken_AppLanguageCode',
						runMode: 'LCHComposeBuildToken_LCHLauncherMode',
					},
				}
			});
		},
		instanceDestroy: function () {
			window.LCHBookmarklet.AppInstance.$destroy();
			
			delete window.LCHBookmarklet.AppInstance;

			[].slice.call(document.querySelectorAll('.ProofSvelteBookmarketSandbox')).forEach((e) => e.remove());
		},
	};

	window.LCHBookmarklet.instanceCreate();
};

export const LCHComposeBuildBoomarkletStringFor = function (inputData, OLSK_TESTING) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('LCHErrorInputInvalid');
	}

	if (!OLSK_TESTING && LCHComposeBuildValidBuildTokens().filter(function (e) {
		return typeof inputData[e] === 'undefined';
	}).length) {
		throw new Error('LCHErrorInputInvalid');
	}

	return Object.keys(inputData).reduce(function (coll, item) {
		let itemReplacement = inputData[item];

		if (item === 'LCHComposeBuildToken_DocumentObjects') {
			itemReplacement = `[${ inputData[item].map(_LCHComposeRecipeStub).map(_LCHComposeBuildRecipeJSON) }]`;
		}

		if (item === 'LCHComposeBuildToken_AppStyle') {
			itemReplacement = `\`${ inputData[item] }\``;
		}

		return coll.replace(item,  itemReplacement);
	}, LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2'))
			.replace(`(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':`, '__LIVERELOADSTART__')
			.replace(`/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');`, '__LIVERELOADEND__')
			.replace(/__LIVERELOADSTART__.*__LIVERELOADEND__/, '')
			.replace(`//# sourceMappingURL=ui-behaviour.js.map`, '');
};

import { LCHFormulaModelErrorsFor, LCHFormulaFrom, LCHFormulaTo } from '../../../_shared/LCHFormula/main.js';

export const _LCHComposeRecipeStub = function (inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('LCHErrorInputInvalid');
	}

	const validKeys = Object.keys(LCHFormulaTo(LCHFormulaModelErrorsFor(LCHFormulaFrom(Object.keys(inputData).reduce(function (coll, item) {
		return (coll[item] = Symbol('ForceInvalid')) && coll;
	}, {}))) || {}, 'LCHRecipe'));

	return Object.assign(validKeys.reduce(function (coll, item) {
		coll[item] = LCHFormulaTo(LCHFormulaFrom(inputData), 'LCHRecipe')[item];

		return coll;
	}, {}), inputData.LCHDocumentBody ? {
		LCHRecipeCallback: _LCHClosureString(inputData),
	} : {}, inputData.LCHDocumentCanonicalExampleBody ? {
		LCHRecipeCanonicalExampleCallback: _LCHClosureString({
			LCHDocumentBody: inputData.LCHDocumentCanonicalExampleBody,
		}),
	} : {});
};

export const _LCHClosureString = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('LCHErrorInputInvalid');
	}

	if (typeof inputData.LCHDocumentBody !== 'string') {
		throw new Error('LCHErrorInputInvalid');
	}

	return `function (${ inputData.LCHDocumentArgs || '' }) { ${ inputData.LCHDocumentBody } }`;
};

export const _LCHComposeBuildRecipeJSON = function (inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('LCHErrorInputInvalid');
	}

	const outputData = Object.assign({}, inputData);

	if (inputData.LCHRecipeCallback) {
		outputData.LCHRecipeCallback = '__LCHRecipeCallback__';
	}

	if (inputData.LCHRecipeCanonicalExampleCallback) {
		outputData.LCHRecipeCanonicalExampleCallback = '__LCHRecipeCanonicalExampleCallback__';
	}

	return JSON.stringify(outputData).replace('"__LCHRecipeCallback__"', inputData.LCHRecipeCallback).replace('"__LCHRecipeCanonicalExampleCallback__"', inputData.LCHRecipeCanonicalExampleCallback);
};

export const LCHComposeBuildBookmarkletBinaryFor = function (inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('LCHErrorInputInvalid');
	}

	return `javascript:(${ encodeURIComponent(inputData) })();`;
};