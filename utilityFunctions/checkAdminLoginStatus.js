module.exports = (req,res,next)=>{
    if(req.session.admin === 1){
        next();
    }else{
        req.flash('error','Please login first');
        console.log("Without login accessing admin dashboard!");
        res.redirect('/admin')
    }
}