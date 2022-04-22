import React from "react";
import styled from "styled-components";
import { ShowDutchAuction } from './ShowDutchAuction';
import { SectionDivider } from './SectionDivider';

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
`;

export function Judge() {
  return (
    <>
      <StyledDiv>
        
      </StyledDiv>
      <p>
        <StyledtButton
        
        >Finalize</StyledtButton>
      </p>
      <p>
        <StyledtButton
        
        >Refund</StyledtButton>
      </p>
      <SectionDivider />
      <ShowDutchAuction />
    </>
  )
}