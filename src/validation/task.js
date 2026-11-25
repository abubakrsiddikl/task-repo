const TASK_STATUSES = ['pending', 'in-progress', 'done'];
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function validateTaskInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['Request body must be a JSON object'];
  }

  if (typeof input.title !== 'string' || input.title.trim().length === 0) {
    errors.push('title must be a non-empty string');
  }

  if (input.status !== undefined && !TASK_STATUSES.includes(input.status)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}`);
  }

  if (
    input.dueDate !== undefined &&
    (typeof input.dueDate !== 'string' || Number.isNaN(Date.parse(input.dueDate)))
  ) {
    errors.push('dueDate must be a valid date');
  }

  if (
    input.userId !== undefined &&
    (typeof input.userId !== 'string' || !OBJECT_ID_PATTERN.test(input.userId))
  ) {
    errors.push('userId must be a valid MongoDB ObjectId');
  }

  return errors;
}

function validatePaginationValue(value, name, defaultValue, maximum) {
  if (value === undefined) {
    return { value: defaultValue };
  }

  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return { error: `${name} must be a positive integer` };
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || (maximum && parsed > maximum)) {
    return {
      error: maximum
        ? `${name} must be between 1 and ${maximum}`
        : `${name} must be a positive safe integer`
    };
  }

  return { value: parsed };
}

module.exports = { TASK_STATUSES, validatePaginationValue, validateTaskInput };
