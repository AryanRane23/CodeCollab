import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type: String,default: null},
    email:{type: String, required:true, unique:true},
    passwordHash:{type: String, default: null},
});

// Remove the old model if it exists
mongoose.models = {};

export default mongoose.models.User || mongoose.model("User", UserSchema);