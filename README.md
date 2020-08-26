# steam-reviews-graph

Configuration notes:

Requires MySQL 8.x

Requires a /db/config.js file containing:
module.exports = {
  host: 'localhost',
  user: 'root',
  password: '{your password}',
  database: 'steam',
};

# reviews-graph

## Related Projects

## Table of Contents
  1. Usage
  2. Endpoints
  3. Proxy Integration

## Usage

- run npm install inside the reviews-graph directory to install dependencies
- run `npm start` to start the server

## Endpoints

### POST /api/reviewcount/:gameId/:date

  Post body:

```
    {
      positive: Number,
      negative: Number
    }
```

Returns status code 201 indicating success or status code 500 in case of failure.

### GET /api/reviewcount/:gameId/date

  Response example:

  ```
    {
        "id": 2,
        "gameid": 1,
        "date": "2020-08-20T07:00:00.000Z",
        "positive": 19,
        "negative": 7
    }

  ```
Returns status code 200 indicating success or status code 500 in case of failure.

### PUT /api/reviewcount/:gameId/:date

  PUT body:

  ```
  {
    positive: Number,
    negative: Number
  }

  ```
  Returns status code 204 indicating success, status code 500 in case of failure and 404 if gameid or date not found.

### DELETE /api/reviewcount/:gameId/:date

  Returns status code 204 indicating success, status code 500 in case of failure and 404 if gameid or date not found.
