

// #purge
// describe('LCHLauncherTestConvertTypeServiceSearch', function () {

// 	before(function() {
// 		return browser.visit(OLSKTestingCanonicalFor(kDefaultRoute.OLSKRoutePath, {
	// LCHLauncherTestConvertTypeServiceSearch: 'alfa',
// }));
// 	});

// 	it('shows one item', async function() {
// 		browser.fill(LCHLauncherFilterInput, 'LCHLauncherTestConvertTypeServiceSearch');
// 		await browser.wait({element: LCHLauncherListItem});

// 		browser.assert.elements(LCHLauncherListItem, 1);
// 	});

// });


// #purge
// context('LCHLauncherTestConvertTypeServiceSearch', function () {

// 	before(function() {
// 		return browser.visit(`${ kDefaultRoute.OLSKRoutePath }?LCHLauncherTestConvertTypeServiceSearch`);
// 	});

// 	it('converts recipe', async function() {
// 		browser.fill(LCHLauncherFilterInput, 'LCHLauncherTestConvertTypeServiceSearch');
// 		await browser.wait({element: LCHLauncherListItem});

// 		browser.assert.text(LCHLauncherListItem, uFormatted(uLocalized('LCHLauncherTestConvertTypeServiceSearchTextFormat'), 'LCHLauncherTestConvertTypeServiceSearch'));
// 	});

// });