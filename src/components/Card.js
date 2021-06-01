import React, { useState, useEffect } from 'react';
import classes from './Card.module.css';
import ContractExtracted from './ContractExtracted';
import NetworkStates from './NetworkStates';
import Refresh from './Refresh';
import TronlinkFunctions from './TronlinkFunctions';

const TronWeb = require('tronweb');
let privateKey = process.env.PK;
const HttpProvider = TronWeb.providers.HttpProvider;

// tronWeb.setHeader({ 'xxxxxxxxxxxxxxxxxxxxxxxx': 'your api key' });

//shasta set message read message  - TC7Gg5AkhDjiDEuqE1sPkFudRAERBSdVMx

// shasta - TEvrLVLkcDpnSZb9G6AwVnWAR91SbTLBa1
//nile - TQb1aN3aXVoZM2kikSoZfFbXda4hK8R44w
//MAINNET - TSYmsMxx2m9b5o8ZDLXT2fAGSXNY2RgDL6
//MAIN USDT - TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

const Card = () => {
  const [myAddress, setmyAddress] = useState('Loading...');
  const [contrAdrress, setcontrAdrress] = useState('');
  const [contractName, setcontractName] = useState('null');
  const [fetchedFuncs, setFetchedFuncs] = useState([]);
  const [network, setNetwork] = useState('SHASTA');
  //set nodes
  const [fullNode, setfullNode] = useState('https://api.shasta.trongrid.io');
  const [solidityNode, setSolidityNode] = useState(
    'https://api.shasta.trongrid.io'
  );
  const [eventServer, setEventServer] = useState(
    'https://api.shasta.trongrid.io'
  );
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  const [contractValue, setContractValue] = useState(
    'Smart contract not detected'
  );

  useEffect(() => {
    //connecting to ethereum blockchain
    const ethEnabled = async () => {
      fetchAddressfromTronlink();
    };

    ethEnabled();
  }, []);

  const changeNetworkHandler = (net) => {
    if (net === 'SHASTA') {
      setfullNode('https://api.shasta.trongrid.io');
      setSolidityNode('https://api.shasta.trongrid.io');
      setEventServer('https://api.shasta.trongrid.io');

      setNetwork('SHASTA');
    } else if (net === 'MAIN') {
      setfullNode(new HttpProvider('https://api.trongrid.io'));
      setSolidityNode(new HttpProvider('https://api.trongrid.io'));
      setEventServer(new HttpProvider('https://api.trongrid.io'));

      setNetwork('MAIN');
    } else if (net === 'NILE') {
      setfullNode('https://api.nileex.io');
      setSolidityNode('https://api.nileex.io');
      setEventServer('https://api.nileex.io');
      setNetwork('NILE');
    }
  };

  const fetchAddressfromTronlink = async () => {
    try {
      setTimeout(() => {
        setmyAddress(window.tronWeb.defaultAddress.base58);
      }, 1000);
    } catch (error) {
      console.error('not able to fetch ', error);
      setmyAddress(error);
    }
  };

  const getContractName = async () => {
    fetchAddressfromTronlink();
    try {
      //   let contract = await tronWeb.contract().at(contrAdrress);
      //   let result = await contract.name().call();
      let contract = await tronWeb.trx.getContract(contrAdrress);
      let result = await contract.name;
      setcontractName(result);

      setFetchedFuncs(contract.abi.entrys);
    } catch (error) {
      console.error('trigger smart contract error', error);
      setcontractName(error);
    }
  };

  const contractImputHandler = (event) => {
    event.preventDefault();
    setcontrAdrress(event.target.value);
  };

  const tronlinkTest = async () => {
    var tronweb = window.tronWeb;
    const tx = await tronweb.transactionBuilder.sendTrx(
      'TGupi94VaCpm9DaTvne6WaytYbTLA69m5Y',
      1000000,
      myAddress
    );
    const signedTx = await tronweb.trx.sign(tx);
    const broastTx = await tronweb.trx.sendRawTransaction(signedTx);
    console.log(broastTx);
  };

  const callFunctions = async (args, type) => {
    let contract = await tronWeb.contract().at(contrAdrress);
    tronWeb.setAddress(myAddress);

    if (type === 'Free') {
      let currentValue = await contract[args].call().call();
      setContractValue(currentValue.toString());
    } else if (type === 'Nonpayable') {
      // let currentValue = await contract.deleteData().send({
      //   feeLimit: 1000000,
      // });
      // setContractValue(currentValue.toString());
      console.log('nonpayable ');
    }
  };

  const doSomething = async () => {
    var tronweb = window.tronWeb;
    var parameter = [{ type: '_string', value: 'HELLO' }];
    var options = {
      feeLimit: 100000000,
    };

    let contract = await tronWeb
      .contract()
      .at('TC7Gg5AkhDjiDEuqE1sPkFudRAERBSdVMx');
    tronWeb.setAddress('TBNZd3tqJuPYTtVGwDeR4wPNgBseX1QbAH');
    let tx = await contract.setMessage().send({
      feeLimit: 100000000,
      shouldPollResponse: true,
      callValue: 0,
    });

    // const tx = await tronWeb.transactionBuilder.triggerSmartContract(
    //   contract,
    //   'setMessage()',
    //   options,
    //   parameter,
    //   'TBNZd3tqJuPYTtVGwDeR4wPNgBseX1QbAH'
    // );
    const signedTx = await tronweb.trx.sign(tx);
    const broastTx = await tronweb.trx.sendRawTransaction(signedTx);
    console.log(broastTx);
  };

  return (
    <div className={classes.cardGrid}>
      <div className={classes.card}>
        <div className={classes.header}>
          <div className={classes.headerTop}>
            <NetworkStates
              networkState={network}
              changeNetwork={changeNetworkHandler}
            />
            <Refresh fetchAddress={fetchAddressfromTronlink} />
          </div>
          <h1>SMART CONTRACT GUI</h1>
        </div>
        <p className={classes.myAddress}>
          Network (<b>{network}</b>): {myAddress}
        </p>

        <div className={classes.content}>
          <div>
            <p>{contractValue}</p>
          </div>
          <h4>Smart contract name: {contractName}</h4>

          <div className={classes.functionLi}>
            {fetchedFuncs.map((func) => (
              <ContractExtracted
                functionName={func.name}
                id={func.id}
                key={Math.random()}
                stateMutability={func.stateMutability}
                type={func.type}
                inputs={func.inputs}
                callFunctions={callFunctions}
              />
            ))}
          </div>

          <input
            type="text"
            onChange={contractImputHandler}
            className={classes.inputField}
          ></input>
          <div>
            <br></br>
          </div>
          <button onClick={getContractName} className={classes.contrctButton}>
            Get smart contract details
          </button>
          <div>
            <button onClick={doSomething}>TESTING</button>
          </div>
          <TronlinkFunctions clicked={tronlinkTest} />
        </div>

        <div className={classes.foot}>
          <h4>App Version - 0.04 beta</h4>
        </div>
      </div>
    </div>
  );
};

export default Card;
