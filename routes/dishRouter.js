const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Currency = mongoose.Types.Currency;

const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, error => next(error))
    .catch((error) => next(error));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Dishes.create(req.body).then((dish) => {
        console.log("Dish created ",dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('put operation not supported on /dishes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Dishes.remove({}).then((resp) => {
        res.statusCode = 200,
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req,res) => {
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set : req.body
    }, { new : true }).then((dish) => {
        console.log("Updated dish ",dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, err => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else {
            var err = new Error('dish '+req.params.dishId+' not found');
            err.status = 404;
            return next(err);
        }
    }, error => next(error))
    .catch((error) => next(error));
})
.post(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save().then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                }, err => next(err))
            }, err => next(err));
        }
        else {
            var err = new Error('dish '+req.params.dishId+' not found');
            err.status = 404;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('put operation not supported on /dishes/'+req.params.dishId+'/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            for(var i=0;i< dish.comments.length;i++) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then((dish) => {
                res.statusCode = 200,
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, err => next(err));
        }
        else {
            var error = new Error('dish '+req.params.dishId+' does not exist');
            error.status = 404;
            return next(error);
        }
    }, err => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            var err = new Error(`dish ${req.params.dishId} is null`);
            err.status = 404;
            return next(err);
        }
        else {
            var err = new Error(`comment ${req.params.commentId} is null`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req,res) => {
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/'+ req.params.dishId+'/comments/'+req.params.commentId);
})
.put(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            if(dish.comments.id(req.params.commentId).author.toString() == req.user._id.toString()) {
                if(req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save().then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    }, err => next(err))
                }, err => next(err));
            }
            else {
                var err = new Error(`you are not authorised to edit this comment as you did not posted this!, posted by 
                    ${dish.comments.id(req.params.commentId).author} and you are ${req.user._id}`);
                err.status = 403;
                return next(err);
            }
        }
        else if (dish == null) {
            var err = new Error(`dish ${req.params.dishId} is null`);
            err.status = 404;
            return next(err);
        }
        else {
            var err = new Error(`comment ${req.params.commentId} is null`);
            err.status = 404;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            if(dish.comments.id(req.params.commentId).author.toString() == req.user._id.toString()) {
                dish.comments.id(req.params.commentId).remove();
                dish.save().then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    }, err => next(err))
                }, err => next(err));
            }
            else {
                var err = new Error(`you are not authorised to delete this comment as you did not posted this!, posted by 
                    ${dish.comments.id(req.params.commentId).author} and you are ${req.user._id}`);
                err.status = 403;
                return next(err);
            }
        }
        else if (dish == null) {
            var err = new Error(`dish ${req.params.dishId} is null`);
            err.status = 404;
            return next(err);
        }
        else {
            var err = new Error(`comment ${req.params.commentId} is null`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;