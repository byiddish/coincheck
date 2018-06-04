import React, { Component } from 'react';
import styled from 'styled-components';
import Chart from 'chart.js';
import axios from 'axios';
import * as moment from 'moment';

const Block = styled.div`
background-color:#2c3035;
margin-bottom:.5em;
width:80%;
max-width:1150px;
margin-right:auto;
margin-left:auto;
`;

const Info = styled.div`
padding:1.5em;
`;

const CoinType = styled.span`
color:#f5c347;
font-size:1em;
font-weight:600;
`;

const CoinLogo = styled.img`
    width: auto;
    height: 2em;
    margin-left: 1em;
    vertical-align: middle;
`;

const Amount = styled.span`
color:#FFFFFF;
font-size:1em;
float:right;
`;

const Toggle = styled.span`
color:rgba(255,255,255,.25);
font-size:1em;
float:right;
padding-left:1em;
font-weight:600;
`;

const MoreInfo = styled.div`
padding:1.5em;
`;

const MoreInfoTitle = styled.div`
font-size:2em;
display:inline-block;
`;

const RangeWrapper = styled.div`
vertical-align: middle;
float:right;
margin-bottom:5em;
`;

const RangeButtonWrapper = styled.span`
`;

const RangeButton = styled.span`
background-color:rgb(230, 230, 230);
font-size:.65em;
padding: .2em .8em .2em .8em;
color: #353536;
margin-right:.2em;
cursor:pointer;
`;

class Blockchain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPrice: undefined,
            coinLogo: undefined,
            price: undefined,
            fetchLimit: 24,
            fetchType: 'histohour',
            chart: undefined,
            type: 'line',
            data: [],
            label: '',
            labels: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
    }

    async fetchCoinLogo() {
        const FETCH_URL = `https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=${this.props.shortCoin}&tsym=USD`;
        const { data } = await axios.get(FETCH_URL);
        const coinLogo = `https://www.cryptocompare.com${data.Data.CoinInfo.ImageUrl}`;
        this.setState({ coinLogo });
    }

    async fetchCurrentPrice() {
        const FETCH_URL = `https://min-api.cryptocompare.com/data/price?fsym=${this.props.shortCoin}&tsyms=USD`;
        const { data } = await axios.get(FETCH_URL);
        this.setState({ currentPrice: data.USD });
    }

    async fetchDataAndDrawChart() {
        const FETCH_URL = `https://min-api.cryptocompare.com/data/${this.state.fetchType}?fsym=${this.props.shortCoin}&tsym=USD&limit=${this.state.fetchLimit}`;
        const { data } = await axios.get(FETCH_URL);
        const dataArray = data.Data;
        const fetchType = this.state.fetchType;
        const formatCurrency = this.formatCurrency;
        let dates = [];
        let values = [];
        if (fetchType === 'histohour') {
            dataArray.forEach(function (d) {
                dates.push(moment(new Date(d.time * 1000)).calendar());
                values.push(d.open);
            }, this.setState({ labels: dates, data: values }))
        } else {
            dataArray.forEach(function (d) {
                dates.push(moment(new Date(d.time * 1000)).format("ddd:MMM:Do"));
                values.push(d.open);
            }, this.setState({ labels: dates, data: values }))
        }
        this.drawChart();
    }

    drawChart() {
        let chartCanvas = this.refs.chart;
        new Chart(chartCanvas, {
            type: this.state.type,
            data: {
                labels: this.state.labels,
                datasets: [{
                    label: this.state.label,
                    data: this.state.data,
                    backgroundColor: this.state.backgroundColor,
                    borderColor: this.state.borderColor,
                    borderWidth: this.state.borderWidth
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return '$' + value;
                            }
                        }
                    }]
                }
            }
        });
    }

    componentWillMount() {
        this.fetchCoinLogo();
        this.fetchCurrentPrice();
        this.fetchDataAndDrawChart();
    }

    handleMinDateChange(event) {
        if (!event.target.value) {
            return;
        }
        this.setState({ minDate: moment(event.target.value) }, () => this.fetchDataAndDrawChart());
    }

    handleMaxDateChange(event) {
        if (!event.target.value) {
            return;
        }
        this.setState({ maxDate: moment(event.target.value) }, () => this.fetchDataAndDrawChart());
    }

    handleFilterKeyPress(fetchLimit, type) {
        const fetchType = type === 'h' ? "histohour" : "histoday";
        this.setState({ fetchLimit, fetchType }, () => this.fetchDataAndDrawChart());
    }

    render() {
        console.log('rendered');
        return (
            <div>
                <Block>
                    <Info>
                        <CoinType>{this.props.coin}</CoinType>
                        <CoinLogo src={this.state.coinLogo} />
                        <Toggle>+</Toggle>
                        <Amount>${this.state.currentPrice}</Amount>
                    </Info>
                    <MoreInfo>
                        <MoreInfoTitle>{this.props.title}</MoreInfoTitle>
                        <RangeWrapper>
                            <RangeButtonWrapper>
                                <RangeButton onClick={() => this.handleFilterKeyPress(1, 'h')}>1h</RangeButton>
                                <RangeButton onClick={() => this.handleFilterKeyPress(12, 'h')}>12h</RangeButton>
                                <RangeButton onClick={() => this.handleFilterKeyPress(24, 'h')}>1d</RangeButton>
                                <RangeButton onClick={() => this.handleFilterKeyPress(7, 'd')}>1w</RangeButton>
                                <RangeButton onClick={() => this.handleFilterKeyPress(30, 'd')}>1m</RangeButton>
                                <RangeButton onClick={() => this.handleFilterKeyPress(90, 'd')}>3m</RangeButton>
                            </RangeButtonWrapper>
                        </RangeWrapper>
                        <canvas ref={'chart'} height={'250'} width={'600'}></canvas>
                    </MoreInfo>
                </Block>
            </div>
        )
    }
}

export default Blockchain;