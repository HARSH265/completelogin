const jwt=require('jsonwebtoken')
const secret = process.env.JWT_SECRET || "LKDFMFMPEFEMGPIEM"

const genrateToken = (user) =>{
    const payload={
        id:user._id,
        email:user.email,
        isAdmin:user.isAdmin
    };
    return jwt.sign(payload,secret, {expiresIn:'1h'})
}
const verifyToken =(token) =>{
    return jwt.verify(token, secret);
};
module.exports=(genrateToken,verifyToken)