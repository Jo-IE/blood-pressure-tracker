var User = require('../models/user');
var {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');


exports.index = function(req, res, next){
    res.render('index', {title:'Welcome to Your Blood Pressure Tracker'})
}
exports.create_user_get = function(req, res, next){
    res.render('user_create', {title: 'Create a New User'})
}

exports.create_user_post = [
    //validate fields
    body('username').isLength({min:1}).trim().withMessage('Username is a required field')
    .isAlphanumeric().withMessage('Username can only contain alphanumeric characters'),
    //sanitize fields
    sanitizeBody('username').escape(),
    function(req, res, next){
    const errors = validationResult(req);
   
    if(!errors.isEmpty()){
        res.render('user_create', {title: 'Create a New User', username:req.body.username, errors: errors.array()})
    }
    else{
        User.findOne({'username': req.body.username}, function(err, foundUser){
            if(err){return next(err)}
            if(foundUser===null){
                var newUser = new User({
                 username: req.body.username,
                })
                newUser.save(function(err){
                    if(err){return next(err)}
                     res.render('user_create_success', {title: "New user created!", user:req.body.username})
                })
                
            }else{
                 res.render('user_create', {title: 'Create a New User', username:req.body.username, msg:'That username is taken'})
            }
        })
    }
}]

exports.update_user_get = function(req, res, next){
    res.render('user_update', {title:'Log your Blood Pressure'})
};

exports.update_user_post = [
    //validate inputs
    body('username').isLength({min:1}).trim().withMessage('Username is a required field')
    .isAlphanumeric().withMessage('Username can only contain alphanumeric characters'),
    body(['systolic', 'diastolic']).isLength({min:1}).trim().withMessage('Both systolic and diastolic blood pressures are required')
    .isNumeric().withMessage('Blood pressures must be numerical values'),
    body('date').isLength({min:1}).withMessage('Date is a required field').isISO8601(),
    body('activity').isLength({min:1}).trim().withMessage('Summarize your most recent activity'),
    
    
    //Sanitize inputs
    sanitizeBody('date').toDate(),
    sanitizeBody('*').escape(),
    
    function(req, res, next){
        const errors = validationResult(req);
        
        var newLog = {systolic:req.body.systolic, diastolic:req.body.diastolic, date:req.body.date, activity:req.body.activity, lemonwater:req.body.lemonwater}
        if(!errors.isEmpty()){
            res.render('user_update', {title: 'Log your blood pressure', log: newLog, username: req.body.username, errors:errors.array()})
        }
        else{
            User.findOne({"username": req.body.username}, function(err, foundUser){
                if(err){return next(err)}
                if(foundUser===null){
                    //no such user exists redirect to create user
                    res.redirect('/track/createuser')
                   
                }else{
                    
                    // user exists, update log
                    foundUser.log.push(newLog)
                    foundUser.save(function(err){
                        if(err){return next(err)}
                    })
                    
                    res.render('user_update_success', {title:'Good Job!', username: foundUser.username})
                }
            })
        }
    }
    
    ];

exports.user_json_get = function(req, res, next){
    
    User.findOne({'username': req.params.username}, function(err, foundUser){
        if(err){return next(err)}
        if(foundUser==null){
            res.redirect('/track/createuser')
        
        }else{
            res.json(foundUser)
        }
    })
}

exports.graph_view_get = function(req,res, next){
    res.render('user_graph_view', {title: 'View your Chart'})
}

exports.graph_view_post = [
    //validate fields
    body('username').isLength({min:1}).trim().withMessage('Username is a required field')
    .isAlphanumeric().withMessage('Username can only contain alphanumeric characters'),
    body(['from', 'to']).isLength({min:1}).withMessage('Date is a required field').isISO8601(),
    
    
    
    //Sanitize inputs
    sanitizeBody(['from', 'to']).toDate(),
    sanitizeBody('username').escape(),
    function(req, res, next){
    const errors = validationResult(req);
   
    if(!errors.isEmpty()){
        res.render('user_graph_view', {title: 'View your Chart', username:req.body.username, errors: errors.array()})
    }
    else{
        User.findOne({'username': req.body.username}, function(err, foundUser){
            if(err){return next(err)}
            if(foundUser==null){
                res.render('user_graph_view', {title: 'View your Chart', username:req.body.username, msg: 'No such user exists'})
            }else{
                var filteredLog = foundUser.log.filter(function(obj){
                    return req.body.from <= obj.date <= req.body.to
                })
                console.log(filteredLog)
                res.render('user_graph', {username:foundUser.username, data:filteredLog})
            }
        })
    }
    
    }
    
    ]

