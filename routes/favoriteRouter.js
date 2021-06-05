var express = require('express');
var bodyParser = require('body-parser');
var Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
var cors = require('./cors');
const Dishes = require('../models/dishes');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .populate('dishes')
    .populate('user')
    .then((doc) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(doc);
    }, err => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then((fav) => {
        if(fav) {
            req.body.forEach(dish => {
                fav.dishes.push(dish._id);
            });
            fav.save()
            .then((doc) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(doc);
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            Favorites.create({
                user : req.user._id,
                dishes : req.body.map((dish) => dish._id)
            })
            .then((fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(fav);
            }, err => next(err))
            .catch((err) => next(err));
        }
    },err => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then((dish) => {
        if(dish) {
            dish.remove()
            .then((prod) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(prod);
            },err => next(err))
            .catch((err) => next(err));
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({status : "You don't have any favorites to delete!"});
        }
    },err => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Dishes.findOne({_id : req.params.dishId})
    .then((dish) => {
        if(dish) {
            Favorites.findOne({user : req.user._id})
            .then((fav) => {
                if(fav) {
                    if(fav.dishes.indexOf(req.params.dishId) == -1) {
                        fav.dishes.push(req.params.dishId);
                        fav.save()
                        .then((favDoc) => {
                            Favorites.findById(favDoc.id)
                            .populate('user')
                            .populate('dishes')
                            .then((result) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(result);
                            });
                        },err => next(err));
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json({status : "This dish is already added to your favorites!"});
                    }
                }
                else {
                    Favorites.create({
                        user : req.user._id,
                        dishes : [req.params.dishId]
                    })
                    .then((doc) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(doc);
                    },err => next(err))
                    .catch((err) => next(err));
                }
            }, err => next(err))
            .catch((err) => next(err));
        }
        else {
            var err = new Error('Requested dish does not exist on /dishes!');
            err.status = 404;
            return next(err);
        }
    })
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then((fav) => {
        if(fav) {
            if(fav.dishes.indexOf(req.params.dishId) == -1) {
                var err = new Error("The requested dish is not added to your favorites!");
                err.status = 404;
                return next(err);
            }
            else {
                fav.dishes = fav.dishes.filter((dish) => dish != req.params.dishId);
                fav.save()
                .then((favDoc) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favDoc);
                },err => next(err))
                .catch((err) => next(err));
            }
        }
        else {
            var err = new Error("You have added nothing to the favorites!");
            err.status = 403;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;