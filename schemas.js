const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.storeSchema = Joi.object({
    store: Joi.object({
        name: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().required()
    }).required()
});

module.exports.orderSchema = Joi.object({
    order: Joi.object({
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().required()
    }).required()
});