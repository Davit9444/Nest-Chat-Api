import * as mongoose from "mongoose";

export const PostShcema = new mongoose.Schema({
    userID1: {type: String, required: true},
    userID2: {type: String, required: true},
    Messages: {type: String, required: true},
    Date: {type: String, required: true}
})