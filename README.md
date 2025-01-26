# Item Rental Service

This is a backend service using Typescript, node.js, and express.js. This is a simple app that stores all items in memory.
This obviously will not scale to a large user base. I will discuss how we can scale this in the "scaling" section below.

## API's

### POST /item

List an item for rent.

### GET /item

Get a list of available items. The following query parameters can be specified. Not specifying any query parameters will return all results.
 - name: name of the item to search for. Must be an exact match.
 - startPrice: start price of the price range to return results for, includsive.
 - endPrice: end price of the price range to return results for, inclusive.

 ### POST /item/rent

 Request to rent an item for a date range. An error is thrown if the item is not available.

 ### POST /item/return

 Return a rented item.

 ## Further Improvements and optimizations

 This is obviously a very simple application. We are storing data in-memory. We should persist this data in a database, and take advantage of the search capabilities offered by technologies such as Postgres w/ Full Text Search and Elasticsearch. These technologies will scale to millions of data points and allow for efficient fetching of data using complex search queries. Authentication is also not handled in this app. We should have some sort of authentication middleware, and additional authorization checks to ensure that a user has access to the data that they are requesting.

 For feature improvements, we could handled multiple date ranges so that multiple rentals can be stored in the system. Currently, we only allow one rental at a time. We could allow for additional search options and partial text searches. We could have multiple quantities of a particular item. If we are keeping the data in-memory, we could improve the storage of the data to a Binary Search Tree to allow for O(logn) searches instead of O(n). We could implement inverted indexes to allow for quick partial searches. The list goes on.

 ## Running locally

  - Clone the repo
  - Install node
  - `npm i` to install all dependencies
  - `npm run build` to compile the typescript files
  - `npm run start` to start the server

### Testing

Unit tests can be run with `npm run test`. You can also use Postman to hit the API's on your localhost..