import { throws, deepEqual } from 'assert';

import * as mainModule from './main.js';

describe('LCHTypeStringCallback', function testLCHTypeStringCallback() {

	it('returns false if not string', function() {
		deepEqual(mainModule.LCHTypeStringCallback(null), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.LCHTypeStringCallback(''), true);
	});

});

describe('LCHTypeStringCanonicalExampleCallback', function testLCHTypeStringCanonicalExampleCallback() {

	it('returns string', function() {
		deepEqual(mainModule.LCHTypeStringCanonicalExampleCallback(), '');
	});

});

describe('LCHTypeStringRecipe', function testLCHTypeStringRecipe() {

	it('returns LCHRecipe', function() {
		deepEqual(mainModule.LCHTypeStringRecipe(), {
			LCHRecipeTitle: 'String',
			LCHRecipeSignature: 'String',
			LCHRecipeCallback: mainModule.LCHTypeStringCallback,
			LCHRecipeOutputType: 'Bool',
			LCHRecipeOutputTypeCanonicalExampleCallback: mainModule.LCHTypeStringCanonicalExampleCallback,
		});
	});

});
