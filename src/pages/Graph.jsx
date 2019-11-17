
import React from "react";
import moment from "moment";
import { ResponsiveLine } from '@nivo/line';
import {
  Row,
  Col,
  Statistic,
  Icon,
  Cascader
} from "antd";
import { MiniArea, ChartCard } from "ant-design-pro/lib/Charts";
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import numeral from "numeral";
import Request from "superagent";
import options from "../data/pannel_cascade.js";
import 'antd/es/input/style/index.css';
import 'antd/es/select/style/index.css';
import 'antd/es/cascader/style/index.css';
import Chart from 'react-google-charts';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const dateFormatter = item => moment(item).format("HH:MM");
const timeFormatter = item => moment(item).format("HH:MM:SS");

class CustomizedAxisTick extends React.Component {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{dateFormatter(payload.value)}</text>
      </g>
    );
  }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
        <p className="label">Time: {`${timeFormatter(label)}`}</p>
        <p className="label">Value: {`${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

class Graph extends React.Component  {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data:  [
        [0, 8],
        [1, 5],
        [2, 4],
        [3, 9],
        [4, 1],
        [5, 7],
        [6, 6],
        [7, 3],
        [8, 2],
        [9, 0]
      ]
    };
  }

  componentWillMount() {
    // this._refreshData();
  }

  _refreshData() {
    Request.get('http://localhost:8080').query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      var max = Math.max.apply(Math, res.body.map(function(o) { return o.y; }));
      var min = Math.min.apply(Math, res.body.map(function(o) { return o.y; }));
      console.log(max);
      this.setState({ data: res.body, autoload: true, render: true, max: max, min:min });
    });
    // setTimeout(_refreshData(), 2*1000);
  }


  render() {
    console.log(options);
    return (
      <div>
        <Row justify="center">
          <Col span={24} justify="center">
            <ChartCard title="SmartGrid Project" contentHeight={134} style={{ maxWidth: "65vw", margin: "auto" }} >
                <NumberInfo
                  subTitle={<span>{ this.state.activePanel ? this.state.activePanel : "Select a Panel" }</span>}
                  total={this.state.data[this.state.data.length-1] ? this.state.data[this.state.data.length-1].y : 0}
                  // status="up"
                  // subTotal={17.1}
                />
                <Cascader
                  options={options}
                  style={{ width: 275, textAlign: "left" }}
                  onChange={(value) => {
                    console.log(value[2]);
                    this.setState({ activePanel: value[2] }, () => {
                      this._refreshData();
                    });
                  }}
                />
                { this.state.render ? 
                  <LineChart
                    width={1080}
                    height={250}
                    data={this.state.data}
                    margin={{
                      top: 20, right: 30, left: 20, bottom: 25,
                    }}
                  >
                    <XAxis dataKey="x" tickFormatter={dateFormatter} tick={<CustomizedAxisTick />}/>
                    <YAxis type="number" domain={[this.state.min, this.state.max]} scale="linear"/>
                    <Tooltip content={<CustomTooltip />} />
                    <Line dataKey="y" stroke="#8884d8" dot={false}/>
                  </LineChart>
                  : null
                }
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }

  componentDidMount() {
    setInterval(async () => {
      if (!this.state.autoload) return;
      Request
        .get('http://localhost:8080')
        .query(`panel=${this.state.activePanel}`)
        .then((res) => {
          console.log(res.body);

          this.setState({ data: res.body });
        });
    }, 5*1000);
  }

}

export default Graph;
