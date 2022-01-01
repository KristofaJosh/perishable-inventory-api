import { Request, Response } from "express";
import { HttpStatusCode, ItemControllerInterface } from "./types";
import { ItemTableInterface } from "../typings";
const ItemsModel = require("../models/Items");
const { Op } = require("sequelize");

const itemController = {
  /**
   * Add a lot of :item to the system.
   */
  add: function (req: Request, res: Response) {
    const { quantity, expiry: expires }: ItemControllerInterface["add"] = req.body;
    const { item } = req.params;

    if (!quantity || !expires) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "'quantity' and 'expiry' values are required!" });
    }
    if ([typeof quantity, typeof expires].includes("string")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "'quantity' and 'expiry' must be of type 'Number'" });
    }
    if (new Date(expires).getTime() < new Date().getTime()) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: `expiry time: ${new Date(expires).getTime()} can not be less than now - ${new Date().getTime()}` });
    }

    // write to db
    return ItemsModel.create({ lot: item.toLowerCase(), quantity: +quantity, expires: +expires })
      .then(() => {
        res.status(HttpStatusCode.CREATED).json({});
      })
      .catch((error: any) => {
        res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: error });
      });
  },

  /**
   * Sell a quantity of an :item and reduce its inventory from the database.
   */
  sell: function (req: Request, res: Response) {
    const { item } = req.params;
    const { quantity }: ItemControllerInterface["sell"] = req.body;

    if (!quantity) return res.status(HttpStatusCode.BAD_REQUEST).send({ message: "Required key 'quantity' missing" });
    if (typeof quantity === "string") return res.status(HttpStatusCode.BAD_REQUEST).send({ message: `'quantity' is of type Number, type of ${typeof quantity} passed` });

    ItemsModel.findAll({ attributes: ["expires", "quantity", "id"], where: { lot: item.toLowerCase(), expires: { [Op.gt]: new Date().getTime() } }, order: [["expires", "ASC"]] })
      .then((response: any) => {
        if (response.length) {
          let result = { quantity: 0, data: [] as { quantity: number; id: number }[] };
          for (let cur of response) {
            result.quantity += cur.quantity;
            result.data.push(cur!.dataValues);
            if (result.quantity > quantity) break; // break out of long loop if we have enough items for sell
          }

          if (result.quantity >= quantity) {
            let remQuantity = quantity;
            for (let i = 0; i < result.data.length; i++) {
              let obj = result.data[i];
              if (remQuantity > obj.quantity) {
                remQuantity = remQuantity - obj.quantity;
                ItemsModel.update({ quantity: 0 }, { where: { id: obj.id } });
              } else {
                ItemsModel.update({ quantity: obj.quantity - remQuantity }, { where: { id: obj.id } });
                break;
              }
            }
            res.status(HttpStatusCode.OK).json({});
          } else {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: `${quantity} is more than ${result.quantity} in ${item} lot` });
          }
        } else res.status(HttpStatusCode.NOT_FOUND).json({});
      })
      .catch((error: any) => {
        res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: error });
      });
  },

  /**
   * Get non-expired quantity of the item from the system.
   */
  quantity: function (req: Request, res: Response) {
    const { item } = req.params;
    // get all item from db where expiry > now
    ItemsModel.findAll({ attributes: ["expires", "quantity"], where: { lot: item.toLowerCase(), expires: { [Op.gt]: new Date().getTime() } }, order: [["expires", "ASC"]] })
      .then((response: any) => {
        if (response.length) {
          const result = response.reduce(
            (block: any, cur: any) => {
              block.quantity += cur.quantity;
              block.data.push(+cur.dataValues.expires);
              return block;
            },
            { quantity: 0, data: [] },
          );
          res.status(HttpStatusCode.OK).json({ quantity: result.quantity, validTill: result.quantity ? result.data[0] : null });
        } else res.status(HttpStatusCode.NOT_FOUND).json({quantity: 0, validTill: null});
      })
      .catch(() => {
        res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: "Internal Server Error" });
      });
  },

  /**
   * Remove expired items
   */
  removeExpired: function () {
    return new Promise((resolve, reject) => {
      ItemsModel.findAll().then((r: any) => {
        r.forEach((data: ItemTableInterface) => {
          if (data.expires < new Date().getTime()) {
            ItemsModel.destroy({ where: { id: data.id } }).catch(reject);
          }
        });
        resolve("cron done");
      }).catch(reject);
    });
  },
};

module.exports = itemController;
