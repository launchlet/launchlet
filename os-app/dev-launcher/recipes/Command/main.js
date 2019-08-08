export const LCHTypeCommandCallback = function(inputData) {
	// if (LCHRecipesModelErrorsFor(inputData)) {
	// 	throw new Error('LCHErrorInputInvalid');
	// }

	if (!inputData.LCHRecipeTitle) {
		return false;
	}
	
	if (inputData.LCHRecipeCallback.length) {
		return false;
	}

	return true;
};

export const LCHTypeStringCanonicalExampleCallback = function() {
	return {
		LCHRecipeCallback () {},
		LCHRecipeTitle: 'alfa',
	};
};

export const LCHTypeCommandRecipe = function() {
	return {
		LCHRecipeName: 'Command',
		LCHRecipeSignature: 'Command',
		LCHRecipeCallback: LCHTypeCommandCallback,
		LCHRecipeOutputType: 'Bool',
		LCHRecipeOutputTypeCanonicalExampleCallback: LCHTypeStringCanonicalExampleCallback,
	};
};