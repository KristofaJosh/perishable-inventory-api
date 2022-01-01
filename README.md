# Perishable Inventory Server

A stateless api server to manage perishable inventory.

## Setup
- create a .env file off .env.sample
- do _yarn_
- do _yarn start_

## API Doc

- **local**: after project setup, visit [doc](http://localhost:8000/ai/v1)
- **online**:
  visit [doc](http://localhost:8000/ai/v1)

### Key Expectations:

- Server should be able to handle highly concurrent workloads - (used clusters to handle this).
- For the database, please use any relational database - (postgres).
- For interacting with the database, use whichever tool you prefer - (sequelize).

### Assumptions

- API request is usually above 5000 and 100 concurrent request per day
- API request is low on weekends
- API has no authorization
- API may have a different version in the future
- More endpoints may be created
