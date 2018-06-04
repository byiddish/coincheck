import React, { Component } from 'react';
import baseStyles from './base-styles';
import Header from './Header';
import Blockchain from './Blockchain';

class App extends Component{

    render(){
        baseStyles();
        return(
            <div>
                <Header/>
                <Blockchain coin="Bitcoin" shortCoin="BTC" title="Bitcoin (USD) Price Closing Price"/>
                <Blockchain coin="Ethereum" shortCoin="ETH" title="Ethereum (ETH) Price"/>
                <Blockchain coin="Bitcoin Cash" shortCoin="BCH" title="Bitcoin Cash (BCH) Price"/>
                <Blockchain coin="Litecoin" shortCoin="LTC" title="Litecoin (LTC) Price"/>
                <Blockchain coin="XRP" shortCoin="XRP" title="Ripple (XRP) Price"/>
            </div>
        )
    }
}

export default App;