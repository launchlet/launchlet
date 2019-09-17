import { throws, rejects, deepEqual } from 'assert';

import * as mainModule from './main.js';

describe('_LCHFlags', function test_LCHFlags() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule._LCHFlags(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns array', function() {
		deepEqual(mainModule._LCHFlags(''), []);
	});

	it('returns error string if not valid', function() {
		deepEqual(mainModule._LCHFlags('eval()'), ['LCHFlagEvaluatesString']);
	});

	context('LCHFlagEvaluatesString', function () {

		// Evaluating JavaScript code via eval() and new Function() https://2ality.com/2014/01/eval.html

		it('flags if eval direct', function() {
			deepEqual(mainModule._LCHFlags('eval()'), ['LCHFlagEvaluatesString']);
		});
		
		it('flags if eval indirect variable', function() {
			deepEqual(mainModule._LCHFlags('(function () { alfa = eval; alfa() })'), ['LCHFlagEvaluatesString']);
		});
		
		it('flags if eval indirect call', function() {
			deepEqual(mainModule._LCHFlags('eval.call(null)'), ['LCHFlagEvaluatesString']);
		});
		
		it('flags if eval indirect window', function() {
			deepEqual(mainModule._LCHFlags('window.eval(null)'), ['LCHFlagEvaluatesString']);
		});
		
		it('flags if eval indirect reference', function() {
			deepEqual(mainModule._LCHFlags('(1, eval)(null)'), ['LCHFlagEvaluatesString']);
		});
		
		it.skip('ignores if eval other', function() {
			deepEqual(mainModule._LCHFlags('(function () { eval = console.log; eval() })'), []);
		});
		
		it('flags if Function Identifier', function() {
			deepEqual(mainModule._LCHFlags('new Function()'), ['LCHFlagEvaluatesString']);
		});
		
		it('flags if Function MemberExpression', function() {
			deepEqual(mainModule._LCHFlags('window.Function(null)'), ['LCHFlagEvaluatesString']);
		});
	
	});

	context('LCHFlagMultipleExpressions', function () {

		it('flags if multiple expressions at top-level', function() {
			deepEqual(mainModule._LCHFlags('(function () {});({})'), ['LCHFlagMultipleExpressions']);
		});

		it('flags if multiple expressions at second-level', function() {
			deepEqual(mainModule._LCHFlags('(function () {},{})'), ['LCHFlagMultipleExpressions']);
		});
		
		it('ignores if single expression', function() {
			deepEqual(mainModule._LCHFlags('(function () {})'), []);
		});
	
	});

});

describe('LCHFlags', function testLCHFlags() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.LCHFlags(null);
		}, /LCHErrorInputInvalid/);
	});

	it('returns null', function() {
		deepEqual(mainModule.LCHFlags({
			alfa: 'bravo',
		}), null);
	});

	it('returns object if not valid', function() {
		deepEqual(mainModule.LCHFlags({
			alfa: 'eval'
		}), {
			alfa: ['LCHFlagEvaluatesString'],
		});
	});

	it('ignores if not string', function() {
		deepEqual(mainModule.LCHFlags({
			alfa: new Date(),
		}), null);
	});

});
