import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import {
  useEffect,
  useState
} from 'react';
import styled from "styled-components";
import DutchAuctionArtifact from "../artifacts/contracts/DutchAuction.sol/DutchAuction.json"

const StyledDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledtButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
  align-items: center;
`;

export function Seller() {

  const context = useWeb3React();
  const { library, active } = context;

  const [owner, setOwner] = useState('');
  const [reservePrice, setReservePrice] = useState(0);
  const [numBlocksOpen, setNumBlocksOpen] = useState(0);
  const [priceDecrement, setPriceDecrement] = useState(0);
  const [judgeAddress, setJudgeAddress] = useState('');

  const [dutchAuctionContract, setDutchAuctionContract] = useState();
  
  useEffect(() => {
    if (!library) {
      setOwner(undefined);
      return;
    }

    setOwner(library.getSigner());
  }, [library]);

  function handleReservePriceInput(event) {
    event.preventDefault();
    setReservePrice(event.target.value);
  }

  function handleNumBlocksOpenInput(event) {
    event.preventDefault();
    setNumBlocksOpen(event.target.value);
  }

  function handlePriceDecrementInput(event) {
    event.preventDefault();
    setPriceDecrement(event.target.value);
  }

  function handleJudgeAddressInput(event) {
    event.preventDefault();
    setJudgeAddress(event.target.value);
  }

  function handleDeployContract(event) {
    event.preventDefault();

    async function deployDuchAuctionContract(owner) {
      const DutchAuction = new ethers.ContractFactory(
        DutchAuctionArtifact.abi,
        DutchAuctionArtifact.bytecode,
        owner
      );

      try {
        const arr = [reservePrice, judgeAddress, numBlocksOpen, priceDecrement];
        const dutchAuction = await DutchAuction.deploy(...arr);
        await dutchAuction.deployed();

        setDutchAuctionContract(dutchAuction);

        window.alert(`Dutch Auction deployed to: ${dutchAuction.address}`);
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }

    }
    deployDuchAuctionContract(owner);
  }

  return (
    <>
      <StyledDiv>
        <StyledLabel>Reserve Price</StyledLabel>
        <StyledInput
          id="ReservePrice"
          type="uint256"
          placeholder="Reserve price"
          onChange={handleReservePriceInput}
        ></StyledInput>
        <div></div>
        <StyledLabel># of Blocks Open</StyledLabel>
        <StyledInput
          id="NumOfBlocksOpen"
          type="uint256"
          placeholder="# of blocks open"
          onChange={handleNumBlocksOpenInput}
        ></StyledInput>
        <div></div>
        <StyledLabel>Price Decrement</StyledLabel>
        <StyledInput
          id="PriceDecrement"
          type="uint256"
          placeholder="Offer price decrement"
          onChange={handlePriceDecrementInput}
        ></StyledInput>
        <div></div>
        <StyledLabel>Judge Address</StyledLabel>
        <StyledInput
          id="JudgeAddress"
          type="address"
          placeholder="Judge address"
          onChange={handleJudgeAddressInput}
        ></StyledInput>
      </StyledDiv>
      <p>
      <StyledtButton
        disabled={!active || dutchAuctionContract ? true : false}
        style={{
          cursor: !active || dutchAuctionContract ? 'not-allowed' : 'pointer',
          borderColor: !active || dutchAuctionContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >Deploy Dutch Auction</StyledtButton>
      </p>
    </>
  )
}