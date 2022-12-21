//user model,contains: username,password,artist:boolean which checks if user is artist or not
//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;


const userSchema = Schema({
    username: String,
    password: String,
    artist:Boolean,
    
});

//Export the default so it can be imported
export default model("users", userSchema);