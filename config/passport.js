const GoogleStrategy = require("passport-google-oauth20")
const mongoose = require("mongoose")
const User = require("../models/users")
const UserInfoError = require("passport-google-oauth20/lib/errors/userinfoerror")

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID : process.env.CLIENT_ID,
        clientSecret : process.env.CLIENT_SECRET,
        callbackURL : '/auth/google/callback'
    }, 
    async (accesstoken , refershtoken, profile, done) => {
        console.log(profile);
        const newuser = {
            googleid : profile.id,
            displayname : profile.displayName,
            firstname : profile.name.givenName,
            lastname : profile.name.familyName,
            image : profile.photos[0].value
        }
        try {
            let user = await User.findOne({ googleid : profile.id})

            if(user){
                done(null , user)
            }else{
                user = await User.create(newuser)
                done(null , user)
            } 
        } catch (err) {
            console.log(err);
        }
    }))

    passport.serializeUser(function (user, done){
        done(null , user.id)
    })

    passport.deserializeUser(function(id, done){
        User.findById(id, function (err, user){
            done(err, user)
        })
    })
}