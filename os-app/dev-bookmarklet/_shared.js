let _LCHOptionsObject = {};
import { LCHLauncherOptions } from './ui-logic.js';
export const LCHOptionsObject = function(inputData) {
	return !inputData ? _LCHOptionsObject : (_LCHOptionsObject = LCHLauncherOptions(inputData));
};

import OLSKInternational from 'OLSKInternational';
let localizationDictionary = JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`);
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, localizationDictionary[LCHOptionsObject().languageCode]);
};
