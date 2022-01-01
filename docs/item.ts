const has500 = {
  "500": {
    description: "internal server error",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

const has404 = {
  "404": {
    description: "Not found",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {},
        },
      },
    },
  },
};

const addItem = {
  tags:['Item'],
  description: "Add a lot of :item to the system",
  operationId: "addItem",
  parameters: [
    {
      name: "item",
      in: "path",
      description: "name of item to add to lot",
      required: true,
      type: "string",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/addItem",
        },
      },
    },
    required: true,
  },
  properties: {
    expiry: {
      type: "number",
      description: "milliseconds-since-epoch representing the expiry time of this lot",
      example: "1640997325875",
    },
    quantity: {
      type: "number",
      description: "quantity of item in the lot to be added",
      example: "20",
    },
  },
  responses: {
    "201": {
      description: "item added successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {},
          },
        },
      },
    },
    ...has500,
  },
};

const sellItem = {
  tags:['Item'],
  operationId: "sellItem",
  description: "sell a quantity of an item and reduce its inventory from the database.",
  parameters: [
    {
      name: "item",
      in: "path",
      description: "name of item to sell from lot",
      required: true,
      type: "string",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/sellItem",
        },
      },
    },
  },
  properties: {
    quantity: {
      type: "number",
      description: "quantity to be sold",
      example: "20",
    },
  },
  responses: {
    "200": {
      description: "item sold successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {},
          },
        },
      },
    },
    ...has500, ...has404
  },
};

const getQuantity = {
  tags:['Item'],
  operationId: "getQuantity",
  description: "get non-expired quantity of the item from the system",
  parameters: [
    {
      name: "item",
      in: "path",
      description: "name of item to review",
      required: true,
      type: "string",
    },
  ],
  responses: {
    "200": {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              quantity: {
                description: "non-expired quantity of item",
                type: "number",
                example: 0,
              },
              validTill: {
                description: "milliseconds-since-epoch representing the maximum time  till which the returned quantity is valid. should be null if returned quantity is 0",
                type: "number",
                nullable: true,
                example: "null",
              },
            },
          },
        },
      },
    },
    ...has500, ...has404
  },
};

export { sellItem, addItem, getQuantity };
