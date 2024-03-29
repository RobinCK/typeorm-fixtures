import * as Joi from 'joi';

export const jFixturesSchema = Joi.object().keys({
    entity: Joi.string().min(1).required(),
    locale: Joi.string().valid(
        'az',
        'ar',
        'cz',
        'de',
        'de_AT',
        'de_CH',
        'en',
        'en_AU',
        'en_AU_ock',
        'en_BORK',
        'en_CA',
        'en_GB',
        'en_IE',
        'en_IND',
        'en_US',
        'en_Z',
        'es',
        'es_M',
        'fa',
        'fi',
        'fr',
        'fr_CA',
        'fr_CH',
        'ge',
        'id_I',
        'it',
        'ja',
        'ko',
        'nb_NO',
        'nep',
        'nl',
        'nl_B',
        'pl',
        'pt_BR',
        'pt_P',
        'ro',
        'ru',
        'sk',
        'sv',
        'tr',
        'uk',
        'vi',
        'zh_CN',
        'zh_TW',
    ),
    parameters: Joi.object(),
    processor: Joi.string(),
    resolvedFields: Joi.array().items(Joi.string()),
    items: Joi.object().required(),
});
