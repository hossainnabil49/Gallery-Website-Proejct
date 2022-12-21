
//model for follow, username:name of user, artist, check:checks if user is currently following or not
//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;


const followSchema = Schema({
    username:String,
    artist: String,
    
    check:Boolean,
    
});

//Export the default so it can be imported
export default model("follows", followSchema);