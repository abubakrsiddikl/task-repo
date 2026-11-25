const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const {
  TASK_STATUSES,
  validatePaginationValue,
  validateTaskInput
} = require('../validation/task');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const errors = validateTaskInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const task = await Task.create({
      title: req.body.title.trim(),
      ...(req.body.status !== undefined && { status: req.body.status }),
      ...(req.body.dueDate !== undefined && { dueDate: new Date(req.body.dueDate) }),
      ...(req.body.userId !== undefined && {
        userId: new mongoose.Types.ObjectId(req.body.userId)
      })
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  const pageResult = validatePaginationValue(req.query.page, 'page', 1);
  const limitResult = validatePaginationValue(req.query.limit, 'limit', 10, 100);
  const errors = [pageResult.error, limitResult.error].filter(Boolean);

  if (req.query.status !== undefined && !TASK_STATUSES.includes(req.query.status)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { value: page } = pageResult;
  const { value: limit } = limitResult;
  const skip = (page - 1) * limit;
  if (!Number.isSafeInteger(skip)) {
    return res.status(400).json({ errors: ['page and limit exceed the supported range'] });
  }

  const filter = req.query.status ? { status: req.query.status } : {};

  try {
    const [total, data] = await Promise.all([
      Task.countDocuments(filter),
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    return res.json({ total, page, limit, data });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
