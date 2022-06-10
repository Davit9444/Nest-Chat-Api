"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostShcema = void 0;
const mongoose = require("mongoose");
exports.PostShcema = new mongoose.Schema({
    userID1: { type: String, required: true },
    userID2: { type: String, required: true },
    Messages: { type: String, required: true },
    Date: { type: String, required: true }
});
//# sourceMappingURL=chat.schema.js.map