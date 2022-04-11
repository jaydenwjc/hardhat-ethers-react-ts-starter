import { useState } from 'react';
import styled from 'styled-components';

import { Seller } from './Seller';
import { Bidder } from './Bidder';
import { Judge } from './Judge';

const Tab = styled.button`
  font-size: 20px;
  padding: 10px 60px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid black;
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  place-self: center;
  align-items: center;
  display: flex;
`;
const Content = styled.div`
  ${props => (props.active ? "" : "display:none")}
`;
const types = ['Seller', 'Bidder', 'Judge'];
export function TabGroup() {
  const [active, setActive] = useState(types[0]);
  return (
    <>
      <ButtonGroup>
        {types.map(type => (
          <Tab
            key={type}
            active={active === type}
            onClick={() => setActive(type)}
          >
            {type}
          </Tab>
        ))}
      </ButtonGroup>
      <Content active={active==='Seller'}>
        <Seller />
      </Content>
      <Content active={active==='Bidder'}>
        <Bidder />
      </Content>
      <Content active={active==='Judge'}>
        <Judge />
      </Content>
    </>
  );
}