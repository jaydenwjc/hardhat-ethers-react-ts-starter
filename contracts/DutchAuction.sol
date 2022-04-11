// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DutchAuction {

    uint256 reservePrice;
    address judgeAddress;
    uint256 numBlocksAuctionOpen;
    uint256 offerPriceDecrement;

    address payable public ownerAddress;
    uint startBlockNumber;
    bool endAuction;
    address payable winnerAddress;
    uint256 winningPrice;
    bool callFinalize;

    constructor(uint256 _reservePrice, address _judgeAddress, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement) public {
        reservePrice = _reservePrice;
        judgeAddress = _judgeAddress;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;

        ownerAddress = payable(msg.sender);
        startBlockNumber = block.number;
    }

    function bid() public payable returns(address) {
        // auction has not ended
        require(!endAuction);
        // current block is during acution open
        require(block.number < startBlockNumber + numBlocksAuctionOpen);
        // wining bid, auction ends
        require(msg.value >= reservePrice + (startBlockNumber + numBlocksAuctionOpen - block.number) * offerPriceDecrement);
        endAuction = true;
        // No judge
        if (judgeAddress == 0x0000000000000000000000000000000000000000) {
            ownerAddress.transfer(msg.value);
        } else { // Judge
            winnerAddress = payable(msg.sender);
            winningPrice = msg.value;
        }
    }

    function finalize() public {
        // Auction ended and finalize() has not been called
        require(endAuction && !callFinalize);
        // Only a judge or an winner can call finalize
        require(msg.sender == judgeAddress || msg.sender == winnerAddress);
        callFinalize = true;
        ownerAddress.transfer(winningPrice);
    }

    function refund(uint256 refundAmount) public {
        // Auction ended and finalize() has not been called
        require(endAuction && !callFinalize);
        // Only a judge can call refund
        require(msg.sender == judgeAddress);
        callFinalize = true;
        winnerAddress.transfer(refundAmount);
    }

    //for testing framework
    // function nop() public returns(bool) {
    //     return true;
    // }
}
