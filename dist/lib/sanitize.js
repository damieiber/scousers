"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = sanitizeHtml;
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
function sanitizeHtml(input) {
    return isomorphic_dompurify_1.default.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: [],
    });
}
