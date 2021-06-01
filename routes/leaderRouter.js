const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end(`getting all the leaders for you!`);
})
.post((req,res,next) => {
    res.end(`adding a leader with name = ${req.body.name} and description = ${req.body.description}`);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('put operation not supported');
})
.delete((req,res,next) => {
    res.end(`deleting all the leaders for you!`);
});

leaderRouter.route('/:leaderId')
.get((req,res) => {
    res.end(`getting the leader = ${req.params.leaderId} for you!`);
})
.post((req,res) => {
    res.statusCode = 403;
    res.end('post operation not supported on leader '+ req.params.leaderId);
})
.put((req,res) => {
    res.write(`writing to the leader ${req.params.leaderId}\n`);
    res.end(`updating the leader = ${req.body.name} and description = ${req.body.description}`);
})
.delete((req,res) => {
    res.end(`deleting the leader = ${req.params.leaderId} for you!`);
});

module.exports = leaderRouter;