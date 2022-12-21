//-workshop model which contains artist and name of workshop
//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;


const workshopSchema = Schema({
    artist: String,
    name:String,
    
});

//Export the default so it can be imported
export default model("Worksho", workshopSchema);