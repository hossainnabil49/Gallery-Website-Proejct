//model for notifications, contains: artist, added:whatever is newly added
//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;


const notificationSchema = Schema({
    
    artist:String,
    added:String,
    
});

//Export the default so it can be imported
export default model("notifications", notificationSchema);