# Task API

A Node.js, Express, and MongoDB API for creating and listing tasks.

## Requirements

- Node.js 18 or newer
- MongoDB

## Setup

```sh
npm install
```

Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string. Start the API with:

```sh
npm start
```

The server listens on port `3000` by default.

## Endpoints

### Create a task

`POST /api/tasks`

```json
{
  "title": "Finish assignment",
  "status": "in-progress",
  "dueDate": "2026-12-01T00:00:00.000Z",
  "userId": "507f1f77bcf86cd799439011"
}
```

`title` is required. `status` accepts `pending`, `in-progress`, or `done` and defaults to `pending`. `dueDate` and `userId` are optional; `userId` references a `User` model by MongoDB ObjectId. Success returns `201 Created`; invalid input returns `400 Bad Request`.

### List tasks

`GET /api/tasks?page=1&limit=10&status=done`

`page` defaults to `1`, `limit` defaults to `10` and may not exceed `100`, and `status` is optional. The response has this shape:

```json
{
  "total": 0,
  "page": 1,
  "limit": 10,
  "data": []
}
```

Run the input validation tests with `npm test`.
