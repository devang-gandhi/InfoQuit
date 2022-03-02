const express = require("express")
const router = express.Router()
const {ensureAuth , ensureGuest} = require('../middleware/auth')
const infos = require('../models/info')

router.get('/' , ensureGuest, (req,res) => {
    res.render('login' , {layout : 'login'})
})

router.get('/dashboard' , ensureAuth, async (req,res) => {
    try {
        const info = await infos.find( {user : req.user.id}).lean()
        res.render('dashboard' , {
            name : req.user.firstname,
            info
        })
    } catch (err) {
        console.log(err);
        res.render('error/500')
    }
    
})

module.exports = router