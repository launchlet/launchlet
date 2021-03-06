const kDefaultRoute = require('../../controller.js').OLSKControllerRoutes().shift();

Object.entries({
	LCHLauncherPipe: '.LCHLauncherPipe',
	
	LCHLauncherPipeSubjectPrompt: '.LCHLauncherPipeSubject .LCHLauncherPrompt',
	
	LCHLauncherPipeActionPrompt: '.LCHLauncherPipeAction .LCHLauncherPrompt',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('LCHLauncherPipe_Access', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute, {
			TestLauncherInput: uStubStringifyAll({
				LCHOptionMode: 'kLCHLauncherModePipe',
			}),
		});
	});

	it('shows LCHLauncherPipe', function () {
		browser.assert.elements(LCHLauncherPipe, 1);
	});

	it('shows LCHLauncherPipeSubjectPrompt', function () {
		browser.assert.elements(LCHLauncherPipeSubjectPrompt, 1);
	});

	it('shows LCHLauncherPipeActionPrompt', function () {
		browser.assert.elements(LCHLauncherPipeActionPrompt, 1);
	});

});
