import React, { Component } from 'react';
import styled from 'styled-components';

const HeaderTitle = styled.h1`
    color:#f5c347;
    width: 100%;
    text-align: center;
    padding-top: 3.5em;
    padding-bottom: 2em;
    font-size:2.5em;
    font-weight:600;
`

class Header extends Component {
    render() {
        return (
            <HeaderTitle>Coincheck</HeaderTitle>
        )
    }
}

export default Header;