import { throws, deepEqual } from 'assert';

import * as mainModule from './api.js';

const kTesting = {
	StubRecipeObjectValid: function() {
		return {
			LCHRecipeCallback () {},
		};
	},
};

describe('LCHRecipesModelErrorsFor', function testLCHRecipesModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.LCHRecipesModelErrorsFor(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns object if LCHRecipeCallback not function', function() {
		deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
			LCHRecipeCallback: null,
		})), {
			LCHRecipeCallback: [
				'LCHErrorNotFunction',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.LCHRecipesModelErrorsFor(kTesting.StubRecipeObjectValid()), null);
	});

	context('LCHRecipeName', function() {

		it('returns object if LCHRecipeName not string', function() {
			deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeName: null,
			})), {
				LCHRecipeName: [
					'LCHErrorNotString',
				],
			});
		});

		it('returns object if LCHRecipeName contains untrimmed whitespace', function() {
			deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeName: ' alfa',
			})), {
				LCHRecipeName: [
					'LCHErrorNotTrimmed',
				],
			});
			deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeName: 'alfa ',
			})), {
				LCHRecipeName: [
					'LCHErrorNotTrimmed',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeName: 'alfa',
			})), null);
		});

	});

	context('signature', function() {

		it('returns object if signature not string', function() {
			deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
				signature: null,
			})), {
				signature: [
					'LCHErrorNotString',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mainModule.LCHRecipesModelErrorsFor(Object.assign(kTesting.StubRecipeObjectValid(), {
				signature: 'alfa',
			})), null);
		});

	});

});

describe('LCHAPIObjectFor', function testLCHAPIObjectFor() {

	it('throws error if not array', function() {
		throws(function() {
			mainModule.LCHAPIObjectFor(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns object', function() {
		deepEqual(typeof mainModule.LCHAPIObjectFor([]), 'object');
	});

	context('fn', function() {

		it('throws error if not string', function() {
			throws(function() {
				mainModule.LCHAPIObjectFor([]).fn(null);
			}, /LCHErrorIdentifierNotString/);
		});

		it('throws error if blank', function() {
			throws(function() {
				mainModule.LCHAPIObjectFor([]).fn('');
			}, /LCHErrorIdentifierBlank/);
		});

		it('throws error if contains untrimmed whitespace', function() {
			throws(function() {
				mainModule.LCHAPIObjectFor([]).fn(' alfa');
			}, /LCHErrorIdentifierContainsUntrimmedWhitespace/);
			throws(function() {
				mainModule.LCHAPIObjectFor([]).fn('alfa ');
			}, /LCHErrorIdentifierContainsUntrimmedWhitespace/);
		});

		it('throws error if not defined', function() {
			throws(function() {
				mainModule.LCHAPIObjectFor([]).fn('alfa');
			}, /LCHErrorIdentifierNotDefined/);
		});

		it('returns LCHRecipeCallback output', function() {
			deepEqual(mainModule.LCHAPIObjectFor([Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeCallback() {
					return 'bravo';
				},
				signature: 'alfa',
			})]).fn('alfa')(), 'bravo');
		});

		it('populates this.api.fn', function() {
			deepEqual(mainModule.LCHAPIObjectFor([Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeCallback(inputData) {
					return `hello ${ inputData }`;
				},
				signature: 'alfa',
			}), Object.assign(kTesting.StubRecipeObjectValid(), {
				LCHRecipeCallback() {
					return this.api.fn('alfa')('bravo');
				},
				signature: 'charlie',
			})]).fn('charlie')(), 'hello bravo');
		});

	});

});
