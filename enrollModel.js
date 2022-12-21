//enroll model used to save and check enrollments of workshops, contains, username, workshop name
//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;


const enrollSchema = Schema({
    username: String,
    workshop:String,
    
});

//Export the default so it can be imported
export default model("enrolls", enrollSchema);