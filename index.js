/* Brew Serverside Code */
const express = require('express'), app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); 
const port = process.env.port || 3000;
//navigation object
pages = {
	home: '/html/index.html'
}

//middlewares
app.use(express.static(path.join(__dirname, "/public/")));

//routing
app.get('/Extraction', (req,res)=>{ 
	console.log(path.join(__dirname))
	res.sendFile( path.join(__dirname, pages.home));
});

app.get(/html/, (req,res)=>{
	res.sendFile( path.join(__dirname, req.url));
})

app.get(/server-images/, (req,res)=>{
	res.sendFile(path.join(__dirname, req.url));
});

//listen for
app.listen(port, (err)=>{
	if(err) throw err;
	console.log(`Server initialized, listening on port ${port}`);	
})