# Perishable Inventory Server

A stateless api server to manage perishable inventory.

## Setup

##### You need [Node](https://nodejs.org/en/) and [Postgres](https://www.pgadmin.org/download/) DB to run this app

- create a _**.env**_ file off _**.env.sample**_ at the root of this folder
- do `yarn`
- make sure your db server (pgAdmin) is running.
- do `yarn start`

## API Doc

- **local**: after project setup, visit [doc](http://localhost:8000/ai/v1/docs)
- **online**: visit [doc](https://perishable-api.herokuapp.com/api/v1/docs)

### Key Expectations:

- Server should be able to handle highly concurrent workloads - (used clusters to handle this).
- For the database, please use any relational database - (postgres).
- For interacting with the database, use whichever tool you prefer - (sequelize).

### Assumptions

- We are using a single server
- API request is usually above 5000 and 100 concurrent request per day
- API request is low on weekends
- API has no authorization
- API may have a different version in the future
- More endpoints may be created

### Test
_yarn test_
