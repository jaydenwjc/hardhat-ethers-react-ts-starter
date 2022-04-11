import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { Greeter } from './components/Greeter';
import { SectionDivider } from './components/SectionDivider';
import { WalletStatus } from './components/WalletStatus';
import {TabGroup} from './components/TabGroup'

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App() {
  return (
    <StyledAppDiv>
      <ActivateDeactivate />
      <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <TabGroup />
      <SectionDivider />
      <Greeter />
    </StyledAppDiv>
  );
}
