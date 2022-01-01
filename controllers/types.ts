export interface ItemControllerInterface {
  add: {
    /**
     * quantity of item in the lot to be added
     */
    quantity: number;
    /**
     * milliseconds-since-epoch representing the expiry time of this lot
     */
    expiry: number;
  };
  sell: {
    /**
     * quantity to be sold.
     */
    quantity: number;
  };
  quantity:{
    /**
     * non-expired quantity of item
     */
    quantity: number;
    /**
     * milliseconds-since-epoch representing the maximum time till which the returned quantity is valid.
     */
    validTill: number
  }
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}
