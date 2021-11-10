import React, { Component } from "react";
import EscribirenBlockchain from "./contracts/EscribirenBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    valorActual: '',
    nuevoValor: '',
    web3: null, 
    accounts: null, 
    contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EscribirenBlockchain.networks[networkId];
      const instance = new web3.eth.Contract(
        EscribirenBlockchain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

      const response = await this.state.contract.methods.Leer().call();
      this.setState({
        valorActual:response
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Falla al conectarme a la web3, cuenta, o contrato. Verifique la consola para mas detalles.`,
      );
      console.error(error);
    }
  };

  storeValue = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;

    try{
// Stores a given value, 5 by default.
await contract.methods.Escribir(this.state.nuevoValor).send({ from: accounts[0] });

const response = await this.state.contract.methods.Leer().call();
  
this.setState({
  valorActual:response
})
    }catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error
      );
      console.error(error);
    }
    
  };

  handleChangeValue = (event) => {
    this.setState({
      nuevoValor : event.target.value
    })
  }


  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <h1>PROBANDO CONTRATO DESDE ROPSTEN TESTNET</h1>
        <label>El último comentario en la blockchain es: {this.state.valorActual}</label>
       <br/><br/>
        <form onSubmit={this.storeValue}>
          <label>Nuevo mensaje a guardar en blockchain: </label>
          <br/>
          <input type="text" value={this.state.nuevoValor} onChange={this.handleChangeValue}></input>
          <br/><br/>
          <input type="submit" class="btn btn-success" value="ALMACENAR VALOR"></input>
        </form>
       
       <br/>
       <br/>
       
       {/* <table border="1" class="default">
        <tr>
          <td>TX hash</td>
          <td>Mensaje</td>
        </tr>
      <tr>
        <td></td>
        <td></td>
      </tr>
       </table> */}

      </div>
    );
  }
}

export default App;
