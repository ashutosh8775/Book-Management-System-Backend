const {sign, verify} = require("jsonwebtoken");

const createToken=(user)=>{
   
    const accessToken= sign({username:user[0].username,id:user[0].id},process.env.SECRET_KEY);
     return accessToken;
};

const validateToken = (request,response,next) =>{
   const accessToken = request.headers["authorization"];
   if(!accessToken)
   return response.status(401).json({error:"user is not athenticated"});
   try{
       const validateToken = verify(accessToken,process.env.SECRET_KEY);
       if(validateToken){
           request.authenticated = true;
           return next();
       }

   }catch(err){
       return response.status(400).json({error:err});

   }
}


module.exports={createToken,validateToken};