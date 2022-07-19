const { describe, it } = require('mocha');
const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);

const requestBody = {
        "ID": 13092,
        "Amount": 4500,
        "Currency": "NGN",
        "CustomerEmail": "anon8@customers.io",
        "SplitInfo": [
            {
                "SplitType": "FLAT",
                "SplitValue": 450,
                "SplitEntityId": "LNPYACC0019"
            },
            {
                "SplitType": "RATIO",
                "SplitValue": 3,
                "SplitEntityId": "LNPYACC0011"
            },
            {
                "SplitType": "PERCENTAGE",
                "SplitValue": 3,
                "SplitEntityId": "LNPYACC0015"
            },
            {
                "SplitType": "RATIO",
                "SplitValue": 2,
                "SplitEntityId": "LNPYACC0016"
            },
            {
                "SplitType": "FLAT",
                "SplitValue": 2450,
                "SplitEntityId": "LNPYACC0029"
            },
            {
                "SplitType": "PERCENTAGE",
                "SplitValue": 10,
                "SplitEntityId": "LNPYACC0215"
            },
        ]
    }


describe('TEST API', () =>{
    describe("POST /split-payments/compute", () => {

        it("Should Return status Response of 200 and not have error", (done) =>{
            chai.request(app)
                .post("/split-payments/compute")
                .send(requestBody)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.haveOwnProperty('ID');
                    expect(res.body.data).to.haveOwnProperty('Balance');
                    expect(res.body.data).to.haveOwnProperty('SplitBreakdown');
                    expect(res.body.data.SplitBreakdown).to.be.an('array');
                    done();
                })
        })

        it("Should Return success as false if ID isn't number", (done) =>{
            chai.request(app)
                .post("/split-payments/compute")
                .send({
                    "ID": "LA123",
                    "Amount": 4500,
                    "Currency": "NGN",
                    "CustomerEmail": "anon8@customers.io",
                    "SplitInfo": [
                    {
                        "SplitType": "FLAT",
                        "SplitValue": 450,
                        "SplitEntityId": "LNPYACC0019"
                    },
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eql(false);
                    expect(res.body.message).to.be.eql("\"ID\" must be a number");

                    done();
                })
        })

        it("Should Return success as false if email is not provided", (done) =>{
            chai.request(app)
                .post("/split-payments/compute")
                .send({
                    "ID": "12123",
                    "Amount": 4500,
                    "Currency": "NGN",
                    "SplitInfo": [
                    {
                        "SplitType": "FLAT",
                        "SplitValue": 450,
                        "SplitEntityId": "LNPYACC0019"
                    },
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eql(false);
                    expect(res.body.message).to.be.eql("\"CustomerEmail\" is required");

                    done();
                })
        })

        it("Should Return success as false if email SplitType is not the valid type", (done) =>{
            chai.request(app)
                .post("/split-payments/compute")
                .send({
                    "ID": "12123",
                    "Amount": 4500,
                    "Currency": "NGN",
                    "CustomerEmail": "anon8@customers.io",
                    "SplitInfo": [
                    {
                        "SplitType": "LAT",
                        "SplitValue": 450,
                        "SplitEntityId": "LNPYACC0019"
                    },
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eql(false);
                    expect(res.body.message).to.be.eql("\"SplitInfo[0].SplitType\" must be one of [FLAT, PERCENTAGE, RATIO]");

                    done();
                })
        })

        it("Should Return a response type of 400 if TotalSplitValue is greater tha Balance ", (done) =>{
            chai.request(app)
                .post("/split-payments/compute")
                .send({
                    "ID": "12123",
                    "Amount": 400,
                    "Currency": "NGN",
                    "CustomerEmail": "anon8@customers.io",
                    "SplitInfo": [
                    {
                        "SplitType": "FLAT",
                        "SplitValue": 850,
                        "SplitEntityId": "LNPYACC0019"
                    },
                    {
                        "SplitType": "FLAT",
                        "SplitValue": 450,
                        "SplitEntityId": "LNPYACC0019"
                    }
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eql(false);
                    expect(res.body.message).to.be.eql("Total split values cant be greater than Balance");

                    done();
                })
        })

        it("Should Return success as false if SplitEntityId is not inputed", (done) =>{
            chai.request(app)
                .post("/split-payments/compute")
                .send({
                    "ID": "12123",
                    "Amount": 400,
                    "Currency": "NGN",
                    "CustomerEmail": "anon8@customers.io",
                    "SplitInfo": [
                    {
                        "SplitType": "FLAT",
                        "SplitValue": 100,
                        
                    }
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eql(false);
                    expect(res.body.message).to.be.eql("\"SplitInfo[0].SplitEntityId\" is required");
                    done();
                })
        })
      
    })
})