//post route
//Index route
app.get("/posts",(req,res)=>{
  res.send("GET for posts");
})
//Show route
app.get("/posts/:id",(req,res)=>{
  res.send("GET for show posts");
})
//Post request
app.post("/posts",(req,res)=>{
  res.send("Post for posts");
})
//Delete route
app.delete("/posts/:id",(req,res)=>{
  res.send("Delete for posts");
})