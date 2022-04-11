import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  useEffect,
  useState
} from 'react';
import styled from "styled-components";
import DutchAuctionArtifact from '../artifacts/contracts/DutchAuction.sol/DutchAuction.json'
import { Seller } from './Seller';
import { passToContract } from './Seller';

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

export function ShowDutchAuction() {
  const context = useWeb3React();
  const { library, active } = context;

  const dutchAuctionContract = new ethers.ContractFactory(
    DutchAuctionArtifact.abi,
    DutchAuctionArtifact.bytecode,
  )
  
  const contract = passToContract;

  return (
    <>
      <StyledDiv>
        <StyledLabel>Dutch Auction address</StyledLabel>
        {contract}
      </StyledDiv>
    </>
  )

}