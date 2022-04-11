import React from "react";
import styled from "styled-components";

const StyledSellerDiv = styled.div`
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

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
  align-items: center;
`;

export function Seller() {
  return (
    <>
      <StyledSellerDiv>
        <StyledLabel>Reserve Price</StyledLabel>
        <StyledInput
          id="ReservePrice"
          type="text"
          placeholder="Reserve price"
        ></StyledInput>
        <div></div>
        <StyledLabel># of Blocks Open</StyledLabel>
        <StyledInput
          id="ReservePrice"
          type="text"
          placeholder="# of blocks open"
        ></StyledInput>
        <div></div>
        <StyledLabel>Price Decrement</StyledLabel>
        <StyledInput
          id="ReservePrice"
          type="text"
          placeholder="Offer price decrement"
        ></StyledInput>
        <div></div>
        <StyledLabel>Judge Address</StyledLabel>
        <StyledInput
          id="ReservePrice"
          type="text"
          placeholder="Judge address"
        ></StyledInput>
      </StyledSellerDiv>
      <p>
      <StyledDeployContractButton
      
      >Deploy Dutch Auction</StyledDeployContractButton>
      </p>
      
    </>
  )
}