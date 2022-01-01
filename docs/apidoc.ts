import { addItem, getQuantity, sellItem } from "./item";

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Perishable Inventory Public API",
    description: "A server for managing perishable inventory",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",
    },
    {
      url: "https://perishable-api.herokuapp.com/api/v1",
    },
  ],
  tags: [
    {
      name: 'Item',
    },
  ],
  components: {
    schemas: {
      addItem,
      sellItem,
      getQuantity,
    },
  },
  paths: {
    "/{item}/add": {
      post: addItem,
    },
    "/{item}/sell": {
      post: sellItem,
    },
    "/{item}/quantity": {
      get: getQuantity,
    },
  },
};
