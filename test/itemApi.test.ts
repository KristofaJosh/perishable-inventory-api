import request from "supertest";
import { Express } from "express-serve-static-core";
import app from "../index";
const db = require("../config/db");
const ItemsModel = require("../models/Items");

let server: Express;

describe("APP should POST and GET", () => {
  beforeAll(() => {
    server = app;
    db.authenticate();
    db.sync();
  });
  
  afterAll((done) => {
    done()
    ItemsModel.drop();
    db.close()
  });
  
  it("should return 200", (done) => {
    request(server)
      .get("/api/v1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  

  it("should create item", (done) => {
    request(server)
      .post("/api/v1/an-item/add")
      .send({ quantity: 10, expiry: new Date().getTime() + 100000 })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({});
        done();
      });
  });

  it("should sell item", (done) => {
    request(server)
      .post("/api/v1/an-item/sell")
      .send({ quantity: 25 })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({});
        done();
      });
  });

  it("should be 10 items", (done) => {
    request(server)
      .get("/api/v1/an-item/quantity")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.quantity).toBe(10);
        done();
      });
  });
});
