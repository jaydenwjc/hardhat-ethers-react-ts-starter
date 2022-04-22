import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import {
  useEffect,
  useState
} from 'react';
import styled from "styled-components";
import DutchAuctionArtifact from "./DutchAuction.json"
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
  align-items: center;
`;

export function DutchAuction() {
  const context = useWeb3React();
  const { library, active, account } = context;

  const [signer, setSigner] = useState();
  const [reservePrice, setReservePrice] = useState('');
  const [numBlocksOpen, setNumBlocksOpen] = useState('');
  const [priceDecrement, setPriceDecrement] = useState('');
  const [judgeAddress, setJudgeAddress] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');

  const [dutchAuctionContract, setDutchAuctionContract] = useState();
  const [dutchAuctionContractAddress, setDutchAuctionContractAddress] = useState();
  
  const [bidInput, setBidInput] = useState();
  const [isBidOpen, setIsBidOpen] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
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

  function handleBidInput(event) {
    event.preventDefault();
    setBidInput(event.target.value);
  }
  
  function handleDeployContract(event) {
    event.preventDefault();

    if (dutchAuctionContract || !signer) {
      return;
    }

    async function deployDuchAuctionContract(signer) {
      const _dutchAuction = new ethers.ContractFactory(
        DutchAuctionArtifact.abi,
        DutchAuctionArtifact.bytecode,
        signer
      );

      try {
        const _reservePrice = ethers.utils.parseEther(reservePrice);
        const _priceDecrement = ethers.utils.parseEther(priceDecrement);
        const _numBlocksOpen = parseInt(numBlocksOpen);
        // const arr = [_reservePrice, judgeAddress, _numBlocksOpen, _priceDecrement];
        const dutchAuction = await _dutchAuction.deploy(_reservePrice, judgeAddress, _numBlocksOpen, _priceDecrement);
        await dutchAuction.deployed();

        setDutchAuctionContract(dutchAuction);

        window.alert(`Dutch Auction deployed to: ${dutchAuction.address}`);
        
        setDutchAuctionContractAddress(dutchAuction.address);
        setIsBidOpen(true);
        var owner = '';
        if(account) {
          owner = account;
        }
        setOwnerAddress(owner);
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    deployDuchAuctionContract(signer);
  }

  function handlePlaceBid(event) {
    event.preventDefault();

    if (!bidInput) {
      window.alert('bid cannot be empty');
      return;
    }

    if(!dutchAuctionContract) {
      window.alert('undefined contract');
      return;
    }

    if (account === ownerAddress) {
      window.alert('Owner cannot bid');
    }

    async function placeBid(contract) {
      try {
        if (!account) return;

        const bidAmount = ethers.utils.parseEther(bidInput);
        const winner = await contract.bid({value: bidAmount});

        if (!winner) return;
        setIsBidOpen(false);
        setWinnerAddress(account);
        if (judgeAddress === '0x0000000000000000000000000000000000000000') {
          window.alert(`Winner is ${winnerAddress}`)
        }
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    placeBid(dutchAuctionContract);
  }

  function handleFinalize(event) {
    event.preventDefault();

    if(!dutchAuctionContract) {
      window.alert('undefined contract');
      return;
    }

    if (account !== judgeAddress && account !== winnerAddress) {
      window.alert('Only Judge/Winner can finalize');
      return;
    }

    async function finalize(contract) {
      try {
        await contract.finalize();
        setIsDelivered(false);
        setWinnerAddress(winnerAddress);
        setIsComplete(true);
        window.alert(`Finalized winner is ${winnerAddress}`)
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    finalize(dutchAuctionContract);
  }

  function handleRefund(event) {
    event.preventDefault();

    if(!dutchAuctionContract) {
      window.alert('undefined contract');
      return;
    }

    if (isComplete) {
      window.alert('Auction is completed');
      return;
    }

    if (account !== judgeAddress) {
      window.alert('Only Judge can issue refund');
      return;
    }

    async function refund(contract) {
      try {
        await contract.refund(0);
        setIsDelivered(false);
        setWinnerAddress(winnerAddress);
        setIsComplete(true);
        window.alert(`Refunded to ${winnerAddress}`)
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    refund(dutchAuctionContract);
  }

  return (
    <>
      <StyledDiv>
        <StyledLabel>A Dutch Auction</StyledLabel>
        <div></div>
        <StyledtButton
        disabled={!active || dutchAuctionContract ? true : false}
        style={{
          cursor: !active || dutchAuctionContract ? 'not-allowed' : 'pointer',
          borderColor: !active || dutchAuctionContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >Deploy Dutch Auction</StyledtButton>
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
        <div></div>
      </StyledDiv>
      <SectionDivider />
      <StyledDiv>
        <StyledLabel>Auction Address</StyledLabel>
        <div>
        {dutchAuctionContractAddress ? (
            dutchAuctionContractAddress
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Owner Address</StyledLabel>
        <div>
        {ownerAddress ? (
            ownerAddress
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Num of blocks open</StyledLabel>
        <div>
        {numBlocksOpen ? (
            numBlocksOpen
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Reservce Price</StyledLabel>
        <div>
        {reservePrice ? (
            reservePrice
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Offer Price Decrement</StyledLabel>
        <div>
        {priceDecrement ? (
            priceDecrement
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Judge Address</StyledLabel>
        <div>
        {judgeAddress ? (
            judgeAddress
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        {/* <StyledLabel>Auction Finalized</StyledLabel>
        <div></div>
        <div></div>
        <StyledLabel>Current Bid</StyledLabel>
        <div></div>
        <div></div> */}
        <StyledLabel>Winner Address</StyledLabel>
        <div>
        {winnerAddress ? (
            winnerAddress
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Place Bid</StyledLabel>
        <StyledInput
          id="Bid"
          type="uint256"
          placeholder="Bid price"
          onChange={handleBidInput}
        ></StyledInput>
        <StyledtButton
        disabled={!isBidOpen}
        style={{
          cursor: !isBidOpen ? 'not-allowed' : 'pointer',
          borderColor: !active || !dutchAuctionContract ? 'unset' : 'blue'
        }}
        onClick={handlePlaceBid}
        >Place Bid</StyledtButton>
        <div></div>
        <div>
          <StyledtButton
          disabled={isDelivered}
          style={{
            cursor: isDelivered ? 'not-allowed' : 'pointer',
            borderColor: !active || !dutchAuctionContract ? 'unset' : 'blue'
          }}
          onClick={handleRefund}
          >Refund</StyledtButton>
          <StyledtButton
          disabled={isDelivered}
          style={{
            cursor: isDelivered ? 'not-allowed' : 'pointer',
            borderColor: !active || !dutchAuctionContract ? 'unset' : 'blue'
          }}
          onClick={handleFinalize}
          >Finalize</StyledtButton>
        </div>
      </StyledDiv>
    </>
  )

}