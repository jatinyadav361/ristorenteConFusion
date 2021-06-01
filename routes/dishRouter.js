const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end(`getting all the dishes for you!`);
})
.post((req,res,next) => {
    res.end(`adding a dish with name = ${req.body.name} and description = ${req.body.description}`);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('put operation not supported');
})
.delete((req,res,next) => {
    res.end(`deleting all the dishes for you!`);
});

dishRouter.route('/:dishId')
.get((req,res) => {
    res.end(`getting the dish = ${req.params.dishId} for you!`);
})
.post((req,res) => {
    res.statusCode = 403;
    res.end('post operation not supported on dish '+ req.params.dishId);
})
.put((req,res) => {
    res.write(`writing to the dish ${req.params.dishId}\n`);
    res.end(`updating the dish = ${req.body.name} and description = ${req.body.description}`);
})
.delete((req,res) => {
    res.end(`deleting the dish = ${req.params.dishId} for you!`);
});

module.exports = dishRouter;