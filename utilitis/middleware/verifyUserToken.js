const {verifyJwt}=require("../utilitis")

function verifyUserToken(req,res,next){
    try {
        const token=req.headers?.authorization?.replace("Bearer ", "");
        const user=verifyJwt(token);

        if(!user)
            return res.status(401).send("unautorised!")
        else{
            req.user=user
            next()
        }
        
    } catch (e) {
        console.error("error while authenticating the user from token",e)
        return res.status(401).send("unauthorised!")
        
    }
}

module.exports=verifyUserToken