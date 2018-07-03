const 
express         = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
app             = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//MONGOOSE/MODEL/CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created : {
        type: Date,
        default: Date.now
        
    }
});
const Blog = mongoose.model("Blog", blogSchema);

/*Blog.create({
    title: "test blog",
    image: "https://images.unsplash.com/photo-1519612535780-b5d7d96c36f3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5b3b0ca68331151669a9d282c8c808ef&auto=format&fit=crop&w=800&q=60",
    body: "HELLO THIS A BLOG POST!"
    
})*/

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
})

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    })
})

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})
//CREATE ROUTE
app.post("/blogs", function(req,res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //then redirect to the index
            res.redirect("/blogs");
        }
    })
    
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog : foundBlog});        
        }
    })
    
    
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
})