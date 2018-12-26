import * as Joi from 'joi';

export const jFixturesSchema = Joi
    .object()
    .keys({
        entity: Joi.string().alphanum().min(1).required(),
        parameters: Joi.object(),
        transformer: Joi.string(),
        items: Joi.object().required(),
    })
;
