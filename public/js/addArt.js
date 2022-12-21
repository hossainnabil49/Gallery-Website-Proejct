//sends information from page to script, forms the object then sends it to server
let host = ["localhost", "YOUR_OPENSTACK_IP"];

window.addEventListener('load', () => { 

    document.getElementById("submit").onclick = save;

});

function save(){
    let name=document.getElementById("name").value;
    let year=document.getElementById("year").value;
    let artist=document.getElementById("artist").value;
    let category=document.getElementById("category").value;
    let medium=document.getElementById("medium").value;
    let description=document.getElementById("description").value;
    let image=document.getElementById("image").value;
    let newArt={name:name,year:year,artist:artist,category:category,medium:medium,description:description,image:image,checked:false, counter:0}
    fetch(`http://localhost:3000/addart`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArt)
    })
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			document.getElementById("name").value = '';
			document.getElementById("artist").value = '';
            document.getElementById("category").value='';
            document.getElementById("medium").value='';
            document.getElementById("description").value='';
            document.getElementById("image").value='';
			document.getElementById("error").innerHTML = "That art name is taken. Please select a new name";
        } else {
			location.href=`http://${host[0]}:3000/login`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));




}