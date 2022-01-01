# Perishable Inventory Server
A stateless api server to manage perishable inventory.

## Endpoints

Base URL: <host:port>/api

Add a lot of :item to the system

```shell
POST {{baseUrl}}/api/:item/add

{"quantity": "Number", "expiry": "Number"}
```
quantity - quantity of item in the lot to be added
expiry - milliseconds-since-epoch representing the expiry time of this lot

  
- POST /:item/sell
sell a quantity of an item and reduce its inventory from the database.
IN: {quantity: Number}
quantity - quantity to be sold.
OUT: {}
  
- GET /:item/quantity
get non-expired quantity of the item from the system
IN: {}
OUT: {quantity: Number, validTill: Number | null}
quantity - non-expired quantity of item
validTill - milliseconds-since-epoch representing the maximum time  till which the returned quantity is valid. should be null if returned quantity is 0
