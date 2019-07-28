export const LCHLauncherOptions = function (inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('LCHErrorInputInvalid');
	}

	return {
		languageCode: !inputData.languageCode ? 'en' : inputData.languageCode,
		runMode: LCHLauncherModes().indexOf(inputData.runMode) === -1 ? LCHLauncherModes().shift() : inputData.runMode,
	};
};

export const LCHLauncherModes = function () {
	return [
		'default',
		'jump',
	];
}

export const LCHBookmarkletLogicFilter = function (inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('LCHErrorInputInvalid');
	}

	return function (e) {
		return [].concat([e.name]).concat(e.labels).filter(function (e) {
			if (!e) {
				return false;
			}

			return e.match(new RegExp(inputData, 'i'));
		}).length > 0;
	};
};
