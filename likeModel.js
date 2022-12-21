//model for likes, contains: username, artwork
//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;


const likeSchema = Schema({
    username: String,
    artwork:String,
    
});

//Export the default so it can be imported
export default model("likes", likeSchema);