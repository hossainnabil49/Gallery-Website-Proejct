
//initializes the database with loaded in artworks
import pkg from 'mongoose';
import fs from "fs";

let rawdata=fs.readFileSync('./gallery.json');
let gallery=JSON.parse(rawdata);
console.log(gallery);
const { connect, connection } = pkg;
import Art from "./artModel.js";

const loadData=async()=>{

	await connect('mongodb://localhost:27017/gallery');
	await connection.dropDatabase();
	let artGallery = gallery.map( art => new Art(art));
	await Art.create(artGallery);
	
}
loadData()
  .then((result) => {
	console.log("Closing database connection.");
 	connection.close();
  })
  .catch(err => console.log(err));