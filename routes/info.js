const express = require("express")
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const infos = require('../models/info')

router.get('/add' , ensureAuth, (req,res) => {
    res.render('infos/add')
}); 

router.post('/' , ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await infos.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
        res.render('error/500')
    }
});

router.get('/' , ensureAuth, async (req,res) => {
    try {
        const info = await infos.find({status : 'public'})
            .populate('user')
            .sort({createdAt : 'desc'})
            .lean()
            res.render("infos/index" , {info})
    } catch (err) {
        console.log(err);
        res.render('error/500')
    }
});

router.get('/:id' , ensureAuth , async (req,res) => {
    try {
        let info = await infos.findById(req.params.id)
            .populate('user')
            .lean()

        if(!info){
            return res.render('error/404')
        }

        res.render('infos/expand' , {info}) 
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
});

router.get('/user/:userId' ,ensureAuth, async (req,res) => {
    try {
        const info = await infos.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('infos/index' , {info})
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
});

router.get('/edit/:id' , ensureAuth, async (req,res) => {
    try {
        const info = await infos.findOne({
            _id :req.params.id
        }).lean()
    
        if(!info){
            return res.render('error/404')
        }
    
        if(info.user !=req.user.id){
            res.redirect('/infos')
        }
        else{
            res.render('infos/edit', {info} )
        }
    } catch (error) {
        console.log(err)
        return res.render('error/500') 
    }
    
});

router.put('/:id' , ensureAuth, async (req,res) => {
    try {
        let info = await infos.findById(req.params.id).lean()

        if(!info){
            return res.render('error/404')
        }
    
        if(info.user != req.user.id){
            res.redirect('/infos')
        }
        else{
            info = await infos.findOneAndUpdate({ _id: req.params.id } , req.body ,{ 
                new : true,
                runValidators :true
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }

});

router.delete('/:id' , ensureAuth, async (req,res) => {
    try {
        await infos.remove( { _id:req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
       console.log(err)
       return res.render('error/500')
    }
}); 

module.exports = router