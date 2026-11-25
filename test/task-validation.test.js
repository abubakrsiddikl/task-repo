const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validatePaginationValue,
  validateTaskInput
} = require('../src/validation/task');

test('accepts a valid task and optional fields', () => {
  assert.deepEqual(
    validateTaskInput({
      title: '  Finish assignment ',
      status: 'in-progress',
      dueDate: '2026-12-01',
      userId: '507f1f77bcf86cd799439011'
    }),
    []
  );
});

test('rejects invalid task fields', () => {
  assert.deepEqual(
    validateTaskInput({
      title: ' ',
      status: 'blocked',
      dueDate: 'not-a-date',
      userId: 'invalid'
    }),
    [
      'title must be a non-empty string',
      'status must be one of: pending, in-progress, done',
      'dueDate must be a valid date',
      'userId must be a valid MongoDB ObjectId'
    ]
  );
});

test('requires dueDate to be a date string', () => {
  assert.deepEqual(validateTaskInput({ title: 'Task', dueDate: 20261201 }), [
    'dueDate must be a valid date'
  ]);
});

test('uses defaults and rejects unsafe pagination values', () => {
  assert.deepEqual(validatePaginationValue(undefined, 'page', 1), { value: 1 });
  assert.deepEqual(validatePaginationValue('0', 'page', 1), {
    error: 'page must be a positive integer'
  });
  assert.deepEqual(validatePaginationValue('101', 'limit', 10, 100), {
    error: 'limit must be between 1 and 100'
  });
});
