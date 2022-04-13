import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  useEffect,
  useState
} from 'react';
import styled from "styled-components";
import DutchAuctionArtifact from '../artifacts/contracts/DutchAuction.sol/DutchAuction.json'
import { Seller } from './Seller';

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

export function ShowDutchAuction(props) {
  const context = useWeb3React();
  const address = props.address;
  const { library, active } = context;
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }
    
    setSigner(library.getSigner());
  }, [library]);
  
  // useEffect(() => {
  //   if (!library) {
  //     setContract(undefined);
  //     return;
  //   }
  //   const dutchAuctionContract = new ethers.Contract(props, DutchAuctionArtifact.abi, signer)
  //   setContract(dutchAuctionContract);
  // }, [signer]);
  
  return (
    <>
      <StyledDiv>
        <StyledLabel>Auction address</StyledLabel>
        <div>
          {address ? (
            address
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Reserve Price</StyledLabel>

      </StyledDiv>
    </>
  )

}