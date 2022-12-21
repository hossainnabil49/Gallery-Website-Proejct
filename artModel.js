//art model that has the following name:name of artwork, artist:name of artist,year:year made,category,medium,desc,checked:checks if artworked is liked or not, image, counter:counts the number of likes
import pkg from 'mongoose';
const { Schema, model} = pkg;
const artSchema = Schema({
    name: String,
    artist: String,
    year:String,
    category:String,
    medium:String,
    description:String,
    checked:Boolean,
    image:String,
    counter:Number
});
export default model("art", artSchema);