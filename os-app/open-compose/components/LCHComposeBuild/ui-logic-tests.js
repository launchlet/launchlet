import { throws, doesNotThrow, deepEqual } from 'assert';

import * as mainModule from './ui-logic.js';

describe('LCHComposeBuildValidCompileTokens', function testLCHComposeBuildValidCompileTokens() {

	it('returns array', function() {
		deepEqual(mainModule.LCHComposeBuildValidCompileTokens(), [
			'LCHComposeBuildToken_AppBehaviour',
			'LCHComposeBuildToken_AppStyle',
			'LCHComposeBuildToken_DocumentObjects',
			'LCHComposeBuildToken_AppLanguageCode',
			'LCHComposeBuildToken_LCHLauncherMode',
			'LCHComposeBuildToken_LCHComposeRecipeName',
			'LCHComposeBuildToken_LCHComposeRecipeCallbackOutput',
		]);
	});

});

describe('LCHComposeBuildBoomarkletTemplate', function testLCHComposeBuildBoomarkletTemplate() {

	it('contains LCHComposeBuildValidCompileTokens', function() {
		deepEqual(mainModule.LCHComposeBuildValidCompileTokens().filter(function (e) {
			return mainModule.LCHComposeBuildBoomarkletTemplate.toString().match(e);
		}), mainModule.LCHComposeBuildValidCompileTokens());
	});

});

describe('LCHComposeBuildBoomarkletStringFor', function testLCHComposeBuildBoomarkletStringFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.LCHComposeBuildBoomarkletStringFor(null);
		}, /LCHErrorInputInvalid/);
	});

	it('throws error if without all tokens', function() {
		throws(function() {
			mainModule.LCHComposeBuildBoomarkletStringFor(mainModule.LCHComposeBuildValidCompileTokens().reduce(function (coll, item) {
				if (item !== 'LCHComposeBuildToken_DocumentObjects') {
					coll[item] = '';
				}

				return coll;
			}, {}));
		}, /LCHErrorInputInvalid/);
	});

	it('replaces all tokens', function() {
		let item = mainModule.LCHComposeBuildBoomarkletStringFor(mainModule.LCHComposeBuildValidCompileTokens().reduce(function (coll, item) {
			coll[item] = item === 'LCHComposeBuildToken_DocumentObjects' ? [] : '';

			return coll;
		}, {}));
		deepEqual(mainModule.LCHComposeBuildValidCompileTokens().filter(function (e) {
			return !item.match(e);
		}), mainModule.LCHComposeBuildValidCompileTokens());
	});

	it('throws no error if OLSK_TESTING', function() {
		doesNotThrow(function() {
			mainModule.LCHComposeBuildBoomarkletStringFor({}, 'OLSK_TESTING');
		}, /LCHErrorInputInvalid/);
	});

	it('replaces wraps', function() {
		deepEqual(mainModule.LCHComposeBuildBoomarkletStringFor({}, 'OLSK_TESTING'), mainModule.LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2'));
	});

	it('replaces LCHComposeBuildToken_AppBehaviour', function() {
		deepEqual(mainModule.LCHComposeBuildBoomarkletStringFor({
			LCHComposeBuildToken_AppBehaviour: 'alfa',
		}, 'OLSK_TESTING'), mainModule.LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2').replace('LCHComposeBuildToken_AppBehaviour', 'alfa'));
	});

	it('replaces LCHComposeBuildToken_DocumentObjects', function() {
		deepEqual(mainModule.LCHComposeBuildBoomarkletStringFor({
			LCHComposeBuildToken_DocumentObjects: [],
		}, 'OLSK_TESTING'), mainModule.LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2').replace('LCHComposeBuildToken_DocumentObjects', '[]'));
	});

	it('replaces LCHComposeBuildToken_AppLanguageCode', function() {
		deepEqual(mainModule.LCHComposeBuildBoomarkletStringFor({
			LCHComposeBuildToken_AppLanguageCode: 'alfa',
		}, 'OLSK_TESTING'), mainModule.LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2').replace('LCHComposeBuildToken_AppLanguageCode', 'alfa'));
	});

	it('strips sourceMap js', function () {
		deepEqual(mainModule.LCHComposeBuildBoomarkletStringFor({
			LCHComposeBuildToken_AppBehaviour: `alfa//# sourceMappingURL=ui-behaviour.js.mapbravo`,
		}, 'OLSK_TESTING'), mainModule.LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2').replace('LCHComposeBuildToken_AppBehaviour', 'alfabravo'));
	});

	it('strips livereload', function () {
		deepEqual(mainModule.LCHComposeBuildBoomarkletStringFor({
			LCHComposeBuildToken_AppBehaviour: `alfa(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':1234567890/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');bravo`,
		}, 'OLSK_TESTING'), mainModule.LCHComposeBuildBoomarkletTemplate.toString().replace(/_protectFromCompiler\(\u0060(.*)\u0060\)(,)?;?/g, '$1$2').replace('LCHComposeBuildToken_AppBehaviour', 'alfabravo'));
	});

});

describe('_LCHClosureString', function test_LCHClosureString() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule._LCHClosureString(null);
		}, /LCHErrorInputInvalid/);
	});

	it('throws error if LCHDocumentBody not string', function() {
		throws(function() {
			mainModule._LCHClosureString({});
		}, /LCHErrorInputInvalid/);
	});

	it('returns string', function() {
		deepEqual(mainModule._LCHClosureString({
			LCHDocumentBody: 'alfa',
		}), 'function () { alfa }');
	});

	context('LCHDocumentArgs', function() {

		it('populates LCHClosureString', function() {
			deepEqual(mainModule._LCHClosureString({
				LCHDocumentBody: 'alfa',
				LCHDocumentArgs: 'bravo',
			}), 'function (bravo) { alfa }');
		});

	});

});

describe('_LCHComposeBuildRecipeJSON', function test_LCHComposeBuildRecipeJSON() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule._LCHComposeBuildRecipeJSON(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns string', function() {
		deepEqual(mainModule._LCHComposeBuildRecipeJSON({}), '{}');
	});

	it('stringifies inputData', function() {
		deepEqual(mainModule._LCHComposeBuildRecipeJSON({
			alfa: 'bravo',
			charlie: true,
		}), '{"alfa":"bravo","charlie":true}');
	});

	it('prints LCHRecipeCallback directly', function() {
		deepEqual(mainModule._LCHComposeBuildRecipeJSON({
			LCHRecipeCallback: 'function () { alfa }',
		}), '{"LCHRecipeCallback":function () { alfa }}');
	});

	it('prints LCHRecipeCallback with line breaks', function() {
		deepEqual(mainModule._LCHComposeBuildRecipeJSON({
			LCHRecipeCallback: `
bravo
`,
		}), `{"LCHRecipeCallback":\nbravo\n}`);
	});

	it('prints LCHRecipeCanonicalExampleCallback directly', function() {
		deepEqual(mainModule._LCHComposeBuildRecipeJSON({
			LCHRecipeCanonicalExampleCallback: 'function () { alfa }',
		}), '{"LCHRecipeCanonicalExampleCallback":function () { alfa }}');
	});

});

describe('_LCHComposeRecipeStub', function test_LCHComposeRecipeStub() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule._LCHComposeRecipeStub(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns object', function() {
		deepEqual(mainModule._LCHComposeRecipeStub({}), {});
	});

	it('converts formula fields', function() {
		deepEqual(mainModule._LCHComposeRecipeStub({
			LCHDocumentName: '',
		}), {
			LCHRecipeName: '',
		});
	});

	it('ignores others', function() {
		deepEqual(mainModule._LCHComposeRecipeStub({
			alfa: '',
		}), {});
	});

	it('wraps LCHDocumentBody in closure', function() {
		deepEqual(mainModule._LCHComposeRecipeStub({
			LCHDocumentBody: 'alfa',
		}), {
			LCHRecipeCallback: 'function () { alfa }',
		});
	});

	it('wraps LCHDocumentCanonicalExampleBody in closure', function() {
		deepEqual(mainModule._LCHComposeRecipeStub({
			LCHDocumentCanonicalExampleBody: 'alfa',
		}), {
			LCHRecipeCanonicalExampleCallback: 'function () { alfa }',
		});
	});

});

describe('LCHComposeBuildBookmarkletBinaryFor', function testLCHComposeBuildBookmarkletBinaryFor() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.LCHComposeBuildBookmarkletBinaryFor(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.LCHComposeBuildBookmarkletBinaryFor('function() { return; }'), 'javascript:(function()%20%7B%20return%3B%20%7D)();');
	});

});
