const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end(`getting all the promotions for you!`);
})
.post((req,res,next) => {
    res.end(`adding a promotion with name = ${req.body.name} and description = ${req.body.description}`);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('put operation not supported');
})
.delete((req,res,next) => {
    res.end(`deleting all the promotions for you!`);
});

promotionRouter.route('/:promoId')
.get((req,res) => {
    res.end(`getting the promotion = ${req.params.promoId} for you!`);
})
.post((req,res) => {
    res.statusCode = 403;
    res.end('post operation not supported on promotion '+ req.params.promoId);
})
.put((req,res) => {
    res.write(`writing to the promotion ${req.params.promoId}\n`);
    res.end(`updating the promotion = ${req.body.name} and description = ${req.body.description}`);
})
.delete((req,res) => {
    res.end(`deleting the promotion = ${req.params.promoId} for you!`);
});

module.exports = promotionRouter;