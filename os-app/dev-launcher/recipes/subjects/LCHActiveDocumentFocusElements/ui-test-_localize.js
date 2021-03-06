const kDefaultRoute = require('../../../controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
};
	
describe('LCHActiveDocumentFocusElements_Localize-' + OLSKRoutingLanguage, function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			OLSKRoutingLanguage,
			LCHOptionMode: 'LCHModePipe',
		});
	});

	before(function() {
		browser.OLSKFireKeyboardEvent(browser.window, 'LCHActiveDocumentFocusElements');
	});

	it('localizes LCHLauncherPipeItemTitle', function() {
		browser.assert.text(`${ LCHLauncherSubjectPromptItemSelected } ${ LCHLauncherPipeItemTitle }`, uLocalized('LCHStandardRecipeNames').LCHActiveDocumentFocusElements);
	});
	
});

});
