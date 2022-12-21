//IMPORTANT NOTE: CODE FROM T9 DEMO WAS USED FOR THE LOGIN AND REGISTER SYSTEM OF THIS PROJECT

import express from 'express';

const app = express();

import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
let currentArt;
const MongoDBStore = connectMongoDBSession(session);
let checker=false;
let currentReviews;
let newadd={artist:"" ,added:""};
let currentEnroll;
//Defining the location of the sessions data in the database.
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/gallery',
  collection: 'sessions'
});
app.use(session(
    { 
      secret: '010101',
      resave: true,
      saveUninitialized: false,
      store: store 
    })
);
import logger from 'morgan'; 

import pkg from 'mongoose';
const { connect, Types } = pkg;

app.use(express.urlencoded({extended: true}));
import Art from "./artModel.js";
import User from './UserModel.js';
import Review from './reviewModel.js'
import Like from './likeModel.js'
import Follow from './followModel.js'
import Notification from './notificationModel.js'
import Workshop from './workshopModel.js'
import Enroll from './enrollModel.js'
const PORT = process.env.PORT || 3000;
const ROOT_DIR_JS = '/public/js';
let host = ["localhost", "YOUR_OPENSTACK_IP"];
app.use(logger('dev'));
app.use(express.static("." + ROOT_DIR_JS));
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'pug');
//serves the login page which serves as a blank homepage with only the header
app.get(['/', '/login'], (req, res) => {

	res.render('pages/login', { session: req.session });

});
//serves the register page which allows the user to register a new account
app.get("/register", (req, res) => {

	res.render("pages/register", { session: req.session });
     
});
//serves a follwing page so that the user can see who they are following
app.get("/following",async(req,res)=>{
  //gets username of current session
  let username=req.session.username;
  //find every follow that the user has done
  const searchFollow=await Follow.find({username:username});

  res.render("pages/following",{session:req.session,searchFollow:searchFollow});

});
//serves page which displays every "interaction" a user had with an artwork(like or reviews)
app.get("/interacted",async(req,res)=>{
  let username=req.session.username;
  const searchReview=await Review.find({userName:username})
  const searchLike= await Like.find({username:req.session.username})

  res.render("pages/interacted",{searchReview:searchReview,searchLike:searchLike,session:req.session});

});
//serves a page that lets the user know if an artist has made a new workshop or artwork and also lets the user know they are enrolled in a workshop

app.get("/notifications",async(req,res)=>{
  let currentNotifications={}
  let art={}
  let enrollement={}
  //first find if the user has followed this artist in the past or not
  if(await Follow.findOne({$and:[{artist:newadd.artist,username:req.session.username}]})){
      console.log(await Follow.findOne({$and:[{artist:newadd.artist,username:req.session.username}]}))
      //checks if the user is currently following the artist
    if((await Follow.findOne({$and:[{artist:newadd.artist,username:req.session.username}]})).check){
    console.log("hi")
    //finds art that was newly added by checking name of newadd art and does the same with notifications
       art=await Art.findOne({name:newadd.name})
     currentNotifications= await Notification.find({artist:newadd.artist})}
    
  }
  //checks if user is currently enrolled in something and send it to res
  if(currentEnroll!=null){

  enrollement=await Enroll.find(currentEnroll)}
  console.log(currentNotifications); 
  res.render("pages/notifications",{session:req.session,currentNotifications:currentNotifications,art:art,enrollement:enrollement});

});
//serves a search page for the user
app.get("/search",async(req,res)=>{
  const searchResult=await Art.find();
  res.render("pages/search",{gallery:searchResult,session:req.session});

});
//post which takes in the account info the user inputted to register the account 
app.post("/register", async (req, res) => {

  let newUser = {username:req.body.username,password:req.body.password,artist:false}

  try{
    //finds if account is already existing
      const searchResult = await User.findOne({ username: newUser.username});
      if(searchResult == null) {
        //creates new user
          console.log("registering: " + JSON.stringify(newUser));
          await User.create(newUser);
          res.status(200).send();
      } else {
          console.log("Send error.");
          res.status(404).json({'error': 'Exists'});
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error registering" });
  }  

});
//post for login page, checks if crediantials are correct
app.post("/login", async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

    try {
        const searchResult = await User.findOne({ username: username });
        if(searchResult != null) { 
            if(searchResult.password === password) {
                // If we successfully match the username and password
                // then set the session properties.  We add these properties
                // to the session object.
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                req.session.artist=searchResult.artist;
                res.render('pages/login', { session: req.session })
                console.log("SUCCESS")
            } else {
                res.status(401).send("Not authorized. Invalid password.");
            }
        } else {
            res.status(401).send("Not authorized. Invalid password.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }    

});
//the user can logout
app.get("/logout", (req, res) => {

  // Set the session loggedin property to false.
if(req.session.loggedin) {
  req.session.loggedin = false;
}
res.redirect(`http://${host[0]}:3000/login`);

});
//serves the artwork page
app.get("/art/:_id",async(req,res)=>{
  let temp={}
  

  let obj_id=Types.ObjectId(req.params._id);
  currentArt=obj_id;
  
  //finds the art in the database using _id and finds out if user has liked the artwork or not
  const searchResult=await Art.findOne({_id:obj_id});
  const searchLike=await Like.findOne({$and:[{artwork:searchResult.name},{username:req.session.username}]})
  console.log(searchLike);
  if(searchLike){
    searchResult.checked=true;
  }
  

//finds all reviews of artwork
  currentReviews=await Review.find({art:searchResult.name});
  if(currentReviews!=null){
    checker=true;
  }
  
  res.render('pages/artwork',{art:searchResult,session:req.session,checker:checker,currentReviews:currentReviews,count:searchResult.counter})
  
})
//post for search which will filter the displayed results
app.post("/search", async (req, res) => {
  let name=req.body.name;
  let artist=req.body.artist;
  let category=req.body.category;
  console.log(name);
  try{
    const searchResult=await Art.find({$or:[{name:name},{artist:artist},{category:category}]});
        console.log(searchResult)
        res.render('pages/search',{gallery:searchResult, session:req.session,})   
    
  }
  
  catch(err) {
    console.log(err);
    res.status(500).json({ error: "Error."});
}   

})
//post which adds review to database and displays it onto artwork page
app.post("/review",async (req,res)=>{
  
  let review=req.body.review;
  
  let username=req.session.username;
  let current=await Art.findOne({_id:currentArt});
  const searchLike=await Like.findOne({$and:[{artwork:current.name},{username:req.session.username}]})
  console.log(searchLike);
  
  if(searchLike){
    current.checked=true;
  }
  let newReview={review:review,userName:username,art:current.name}
  await Review.create(newReview);
 let name=current.name
  currentReviews=await Review.find({art:name});
 
  
  checker=true;
  res.render('pages/artwork',{art:current,currentReviews:currentReviews,session:req.session,checker:checker,count:current.counter})
})
//post which creates new like in database and checks if user has already liked something or not
app.post("/like",async(req,res)=>{
 
  
 

  let current=await Art.findOne({_id:currentArt});
   current=await Art.findOneAndUpdate({_id:currentArt},{$inc:{counter:1}});
    current.checked=true;
    
    let newLike={username:req.session.username,artwork:current.name, checked:true}
    await Like.create(newLike);
    
  
    res.render('pages/artwork',{art:current,currentReviews:currentReviews,session:req.session,checker:checker,count:current.counter})
  
  
  
})
//post which will delete a like and change artwork like status to false
app.post("/unlike",async(req,res)=>{
  let current=await Art.findOne({_id:currentArt})
  await Like.deleteOne({artwork:current.name})
  current.checked=false;
  current=await Art.findOneAndUpdate({_id:currentArt},{$inc:{counter:-1}});
  

  res.render('pages/artwork',{art:current,currentReviews:currentReviews,session:req.session,checker:checker,count:current.counter})
})

//upgrades user status to artist and redirects user to addart page unless they already have art added
app.post("/upgrade",async(req,res)=>{
    req.session.artist=true;
    let currentUser=await User.findOneAndUpdate({username:req.session.username},{artist:true})
    
    
    if(!(await Art.findOne({artist:req.session.username}))){
      res.redirect(`http://${host[0]}:3000/addart`);
    }
    else{
      res.render('pages/login',{session:req.session});
    }
    console.log(currentUser);
})
//downgrades user to patron
app.post("/downgrade",async(req,res)=>{
  req.session.artist=false;
  
  res.render('pages/login',{session:req.session})

})
//renders the add art page
app.get("/addart",async(req,res)=>{
  res.render('pages/addart',{session:req.session})
})
//post that adds art to database and creates a notification
app.post("/addart",async(req,res)=>{
   newadd=req.body;
  try{
    const searchResult = await Art.findOne({ name: newadd.name});
    if(searchResult == null) {
        console.log("registering: " + JSON.stringify(newadd));
        await Art.create(newadd);
        let newNotification={artist:newadd.artist,added:newadd.name}
        await Notification.create(newNotification);
        

        
        res.status(200).send();
    } else {
        console.log("Send error.");
        res.status(404).json({'error': 'Exists'});
    }
} catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error registering" });
}  
})
//serves page to add workshop
app.get("/addworkshop",async(req,res)=>{
  res.render('pages/addWorkshop',{session:req.session})
})
//will addworkshop to database and create a new notification
app.post("/addworkshop",async(req,res)=>{

  newadd={artist:req.body.artist,name:req.body.name}
  let newNotification={artist:req.body.artist,added:newadd.name}
  try{
  await Workshop.create(newadd);
  await Notification.create(newNotification)
  res.render('pages/addWorkshop',{session:req.session})}
  catch(err) {
    console.log(err);
    res.status(500).json({ error: "Error."});
}})
//serves the artist profile, checks if user has followed artist
app.get("/:id",async(req,res)=>{
  let obj_id=(req.params.id);
  let workshopCollection={}
  const searchResult=await Art.find({artist:obj_id})
  //creates new follow when user loads page but checks it false
  let newFollow={username:req.session.username,artist:obj_id,check:false}
  
  await Follow.create(newFollow);
   workshopCollection=await Workshop.find({artist:obj_id})

  let filter=await Follow.findOne({$and:[{artist:obj_id},{username:req.session.username}]})
  res.render("pages/artProfile",{session:req.session,artist:obj_id,collection:searchResult,filter:filter,workshop:workshopCollection})
})
//will search through follow databaase and check its boolean true, will also load in other art profile stuff such as workshops and art
app.post("/:id/follow",async(req,res)=>{
  let obj_id=(req.params.id)
  
  let workshopCollection={}
  workshopCollection=await Workshop.find({artist:obj_id})
  const searchResult=await Art.find({artist:obj_id})
  let filter= await Follow.findOneAndUpdate({$and:[{artist:obj_id,username:req.session.username}]},{check:true});
  
  res.render("pages/artProfile",{session:req.session,artist:obj_id,collection:searchResult,filter:filter,workshop:workshopCollection})
})

//will turn follow boolean of user to false
app.post("/:id/unfollow",async(req,res)=>{
  let workshopCollection={}
  let obj_id=(req.params.id)
  workshopCollection=await Workshop.find({artist:obj_id})
  const searchResult=await Art.find({artist:obj_id})
 let filter= await Follow.findOneAndUpdate({$and:[{artist:obj_id,username:req.session.username}]},{check:false});
 
 res.render("pages/artProfile",{session:req.session,artist:obj_id,collection:searchResult,filter:filter,workshop:workshopCollection})

})
//will serve a new page to remove review from user
app.get("/:id/delete",async(req,res)=>{
  let obj_id=(req.params.id)
  let delReview=await Review.findOne({$and:[{review:obj_id,userName:req.session.username}]})
    res.render("pages/removeReview",{session:req.session,delReview:delReview});
})
//will remove review from user and redirect to the interacted page
app.post("/:id/delete",async(req,res)=>{
  let obj_id=(req.params.id)
  await Review.deleteOne({review:obj_id})
  res.redirect(`http://${host[0]}:3000/interacted`)
})
//serves the enroll page and gives the option for the user to enroll
app.get("/:id/enroll",async(req,res)=>{
  let obj_id=(req.params.id)
  let newEnroll={username:req.session.username,workshop:obj_id}
  
    res.render("pages/enroll",{session:req.session,enroll:newEnroll});
})
//enrolls the user in the workshop and redirects them to notification page
app.post("/:id/enroll",async(req,res)=>{
  let obj_id=(req.params.id)
  let newEnroll={username:req.session.username,workshop:obj_id}
  currentEnroll= await Enroll.create(newEnroll)
  
  res.redirect(`http://${host[0]}:3000/notifications`)
})
const loadData = async () => {
	
	//Connect to the mongo database
  	const result = await connect('mongodb://localhost:27017/gallery');
    return result;

};
loadData()
  .then(() => {

    app.listen(PORT);
    console.log("Listen on port:", PORT);

  })
  .catch(err => console.log(err));