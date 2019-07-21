import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubMemberObjectValid: function() {
		return {
			LCHMemberID: 'alfa',
			LCHMemberArgs: 'bravo',
			LCHMemberBody: 'charlie',
			LCHMemberCreationDate: new Date('2019-02-23T13:56:36Z'),
			LCHMemberModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('LCHMembersMetalWrite', function testLCHMembersMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, null), /LCHErrorInputInvalid/);
	});

	it('returns object with LCHErrors if not valid', async function() {
		deepEqual((await mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, Object.assign(kTesting.StubMemberObjectValid(), {
			LCHMemberID: null,
		}))).LCHErrors, {
			LCHMemberID: [
				'LCHErrorNotString',
			],
		});
	});

	it('returns LCHMember', async function() {
		let item = await mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, kTesting.StubMemberObjectValid());

		deepEqual(item, Object.assign(kTesting.StubMemberObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('LCHMembersMetalRead', function testLCHMembersMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.LCHMembersMetalRead(LCHTestingStorageClient, 1), /LCHErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.LCHMembersMetalRead(LCHTestingStorageClient, 'alfa'), null);
	});

	it('returns LCHMember', async function() {
		let item = await mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, kTesting.StubMemberObjectValid());

		deepEqual(await mainModule.LCHMembersMetalRead(LCHTestingStorageClient, item.LCHMemberID), item);
	});

});

describe('LCHMembersMetalList', function testLCHMembersMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.LCHMembersMetalList(LCHTestingStorageClient), {});
	});

	it('returns existing LCHMembers', async function() {
		let item = await mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, kTesting.StubMemberObjectValid());
		deepEqual(Object.values(await mainModule.LCHMembersMetalList(LCHTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.LCHMembersMetalList(LCHTestingStorageClient)), [item.LCHMemberID]);
	});

});

describe('LCHMembersMetalDelete', function testLCHMembersMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.LCHMembersMetalDelete(LCHTestingStorageClient, 1), /LCHErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.LCHMembersMetalDelete(LCHTestingStorageClient, (await mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, kTesting.StubMemberObjectValid())).LCHMemberID), {
			statusCode: 200,
		});
	});

	it('deletes LCHMember', async function() {
		await mainModule.LCHMembersMetalDelete(LCHTestingStorageClient, (await mainModule.LCHMembersMetalWrite(LCHTestingStorageClient, kTesting.StubMemberObjectValid())).LCHMemberID);
		deepEqual(await mainModule.LCHMembersMetalList(LCHTestingStorageClient), {});
	});

});
