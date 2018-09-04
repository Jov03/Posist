var express=require('express'),
    mongoose=require('mongoose'),
    methodOverride=require('method-override'),
    path=require('path'),
    bodyParser=require('body-parser'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require("./models/user"),
    NodeModel=require("./Models/NodeModel"),
    flash=require('connect-flash'),
    app=express();

//DB Connect String 
mongoose.connect('mongodb://localhost/Posist');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MiddleWare To provide UserData to all templates
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

//MiddleWare to Restrict access with log In
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect('/login');
}

//Login Page
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.get('/login', (req, res) => {
    res.render('login');
   
});

//Logout Route
app.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged Out");
    res.redirect('/login');
});

//Authenticate User then login 
app.post('/login', passport.authenticate("local", {
    successRedirect: '/AdminView',
    failureRedirect: '/login',
    failureFlash:true
}), (req, res) => {

});

//Restful Routes
//GET ROUTES
app.get('/',function(req,res){
    res.render("/login");

});
app.get('/node',isLoggedIn,function(req,res){
    NodeModel.find({},function(err,node){
        if(err){
            console.log('Error!!');
        }else{
            res.render('index',{node:nodes});
        }
    });
});
app.get('/node/new',isLoggedIn,function(req,res){
    res.render('new');
});

app.get('/node/:id',isLoggedIn,function(req,res){
    NodeModel.findById(req.params.id,function(err,foundNode){
        if(err){
            res.redirect('/');
        }else{
            res.render('show',{node:foundNode});
        }

    })
});

//POST ROUTES
app.post('/node/new',isLoggedIn,function(req,res){
    NodeModel.create(req.body.node,function(err,newNode){
        if(err){
            res.render('/node/new');
        }else{
            console.log(newNode);
            res.redirect('/');
        }
    });
});

//PUT ROUTES
app.put("/Node/:id",isLoggedIn,(req,res)=>{
    NodeModel.findByIdAndUpdate(req.params.id,req.body.Node,(err,newNode)=>{
        if(err){
            console.log(err);
        }else{
            console.log(newNode);
            res.render('home');
        }
    });
});

//DELETE ROUTES
app.delete('/node/:id',isLoggedIn,function(req,res){
    NodeModel.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/');
        }
    });
});


app.listen(3200,function(){
    console.log('Server has started');
});