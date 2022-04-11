const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DutchAuction no judge", function() {

    let DutchAuction;
    let dutchAuction;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        DutchAuction = await ethers.getContractFactory("DutchAuction");
        [owner, addr1, addr2] = await ethers.getSigners();
        const arr = [500, ethers.constants.AddressZero, 10, 25];
        dutchAuction = await DutchAuction.deploy(...arr);
    });

    it("creates a dutch auction", async function() {
        await expect(await dutchAuction.ownerAddress()).to.equal(owner.address);
    });

    it("rejects a low bid", async function() {
        await expect(dutchAuction.connect(addr1).bid({value: 450})).to.be.reverted;//.to.changeEtherBalance(addr1, -450);
    });

    it("accepts good bid", async function() {
        await expect(await dutchAuction.connect(addr1).bid({value: 750}));//.to.changeEtherBalance(addr1, -750);
    });

    it("rejects second bid", async function() {
        await expect(await dutchAuction.connect(addr1).bid({value: 725}));
        await expect(dutchAuction.connect(addr2).bid({value: 750})).to.be.reverted;
    });
    
    it("valid bid, early finalize", async function() {
        await expect(await dutchAuction.connect(addr1).bid({value: 725}));
        await expect(dutchAuction.connect(addr1).finalize()).to.be.reverted;
    });

    it("no bid, early finalize", async function() {
        await expect(dutchAuction.connect(addr1).finalize()).to.be.reverted;
    });

    it("invalid bid, early finalize", async function() {
        await expect(dutchAuction.connect(addr1).bid({value: 500})).to.be.reverted;
        await expect(dutchAuction.connect(addr1).finalize()).to.be.reverted;
    });
});

describe("DutchAuction with judge", function() {

    let DutchAuction;
    let dutchAuction;
    let owner;
    let judge;
    let addr1;
    let addr2;

    beforeEach(async function() {
        DutchAuction = await ethers.getContractFactory("DutchAuction");
        [owner, judge, addr1, addr2] = await ethers.getSigners();
        const arr = [500, judge.address, 10, 25];
        dutchAuction = await DutchAuction.deploy(...arr);
    });

    it("creates a dutch auction", async function() {
        await expect(await dutchAuction.ownerAddress()).to.equal(owner.address);
    });

    it("valid bid, valid finalize", async function() {
        await expect(await dutchAuction.connect(addr1).bid({value: 725}));
        await expect(await dutchAuction.connect(judge).finalize());
    });

    it("valid bid, invalid finalize", async function() {
        await expect(await dutchAuction.connect(addr1).bid({value: 725}));
        await expect(dutchAuction.connect(addr2).finalize()).to.be.reverted;
    });

    it("second finalize", async function() {
        await expect(await dutchAuction.connect(addr1).bid({value: 725}));
        await expect(await dutchAuction.connect(judge).finalize());
        await expect(dutchAuction.connect(judge).finalize()).to.be.reverted;
    });

    it("no winner", async function() {
        await expect(dutchAuction.connect(judge).finalize()).to.be.reverted;
    });
    
});