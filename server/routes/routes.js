const {ObjectId} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

const {mongoose} = require('../db/mongoose');
const {Todo} = require('../models/todo');


router.route('/todos')
  .get((req, res) => {
    Todo.find().then((todos) => {
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    });
  })
  .post((req, res) => {
    let todo = new Todo({
      title: req.body.title,
      completed: req.body.completed,
      completedAt: new Date().getTime()
    });

    todo.save().then((doc) => {

      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });

router.route('/todos/:id')
  .get((req, res) => {
    let id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).send('ID is not valid');
    }

    Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  })
  .delete((req, res) => {
    let id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  })
  .patch((req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['title', 'completed']);

    if (!ObjectId.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findOneAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  });

module.exports = router;
