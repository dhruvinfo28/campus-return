module.exports = (req,res,next)=>{
    console.log("Reached login status check for /dashboard");
    if(req.session.student){
        next();
    }else{
        req.flash('error','Please login first');
        console.log("Without login accessing dashboard!");
        res.redirect('/');
    }
}