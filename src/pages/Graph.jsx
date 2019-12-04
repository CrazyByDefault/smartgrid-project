import React from "react";
import ReactQueryParams from 'react-query-params';
import moment from "moment";
import { ResponsiveLine } from '@nivo/line';
import {
  Row,
  Col,
  Statistic,
  Icon,
  Cascader,
  Typography
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
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const dateFormatter = item => moment(item).format("HH:mm");
const timeFormatter = item => moment(item).format("DD-MM HH:mm:ss");

const { Title, Paragraph } = Typography;

const apiUrl = "http://d7cc6552.ngrok.io";

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

class Graph extends ReactQueryParams  {
  constructor(props, context) {
    super(props, context);
    const value = this.queryParams.panel;
    if (this.queryParams.panel) {
      this.state = {
        activePanel: this.queryParams.panel,
        autoload: true
      };
    } else {
      this.state = {};
    }
    console.log("PARAM", value);
  }

  componentWillMount() {
    // this._refreshData();
  }

  _refreshData() {
    Request.get(`${apiUrl}`).query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      const data = res.body;
      data.max = Math.max.apply(Math, res.body.map(function(o) { return o.y; }));
      data.min = Math.min.apply(Math, res.body.map(function(o) { return o.y; }));
      this.setState({ data });
    });
    // setTimeout(_refreshData(), 2*1000);
  }

  _fetchVoltage() {
    Request.get(`${apiUrl}/voltage`).query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      const voltage = res.body;
      let maxR, maxY, maxB;
      maxR = Math.max.apply(Math, res.body.map(function(o) { return o.r; }));
      maxY = Math.max.apply(Math, res.body.map(function(o) { return o.y; }));
      maxB = Math.max.apply(Math, res.body.map(function(o) { return o.b; }));
      voltage.max = Math.max(maxR, maxY, maxB);

      let minR, minY, minB;
      minR = Math.min.apply(Math, res.body.map(function(o) { return o.r; }));
      minY = Math.min.apply(Math, res.body.map(function(o) { return o.y; }));
      minB = Math.min.apply(Math, res.body.map(function(o) { return o.b; }));
      voltage.min = Math.min(minR, minY, minB);
      this.setState({ voltage });
    });
  }

  _fetchCurrent() {
    Request.get(`${apiUrl}/current`).query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      let maxR, maxY, maxB;
      const current = res.body;
      maxR = Math.max.apply(Math, res.body.map(function(o) { return o.r; }));
      maxY = Math.max.apply(Math, res.body.map(function(o) { return o.y; }));
      maxB = Math.max.apply(Math, res.body.map(function(o) { return o.b; }));
      current.max = Math.max(maxR, maxY, maxB);

      let minR, minY, minB;
      minR = Math.min.apply(Math, res.body.map(function(o) { return o.r; }));
      minY = Math.min.apply(Math, res.body.map(function(o) { return o.y; }));
      minB = Math.min.apply(Math, res.body.map(function(o) { return o.b; }));
      current.min = Math.min(minR, minY, minB);
      this.setState({ current });
    });
  }

  _fetchPower() {
    Request.get(`${apiUrl}/power`).query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      const power = res.body;
      let maxR, maxY, maxB;
      maxR = Math.max.apply(Math, res.body.map(function(o) { return o.r; }));
      maxY = Math.max.apply(Math, res.body.map(function(o) { return o.y; }));
      maxB = Math.max.apply(Math, res.body.map(function(o) { return o.b; }));
      power.max = Math.max(maxR, maxY, maxB);

      let minR, minY, minB;
      minR = Math.min.apply(Math, res.body.map(function(o) { return o.r; }));
      minY = Math.min.apply(Math, res.body.map(function(o) { return o.y; }));
      minB = Math.min.apply(Math, res.body.map(function(o) { return o.b; }));
      power.min = Math.min(minR, minY, minB);

      this.setState({ power });
    });
  }

  _fetchPF() {
    Request.get(`${apiUrl}/pf`).query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      const pf = res.body;
      pf.max = 1.25;
      pf.min = -1.25;
      this.setState({ pf });
    });
  }

  _fetchCE() {
    Request.get(`${apiUrl}/ce`).query(`panel=${this.state.activePanel}`).then((res) => {
      console.log(res.body);
      const ce = res.body;
      ce.max = Math.max.apply(Math, res.body.map(function(o) { return o.y; }));
      ce.min = Math.min.apply(Math, res.body.map(function(o) { return o.y; }));
      const ceFinal = ce.map((item, i) => {
        const newItem = {};
        newItem.x = item.x;
        newItem.y = i === 0 ? 0 : item.y - ce[i-1].y;
        newItem.row2 = item.row2;
        return newItem;
      });
      this.setState({ ce: ceFinal });
    });
  }

  _renderGraph(dataSource, stroke, unit) {
    // const stroke = '#'+Math.floor(Math.random()*16777215).toString(16);
    console.log("rendering ", dataSource, " graph");
    return (
      <ResponsiveContainer width="98%" height={250} style={{ marginRight: 0 }}>
        <LineChart
          data={this.state[dataSource]}
          margin={{ top: 15, bottom: 15, left: 5, right: 5 }}
        >
          <XAxis dataKey="x" tickFormatter={dateFormatter} tick={<CustomizedAxisTick />}/>
          <YAxis unit={unit} type="number" domain={[this.state[dataSource].min, this.state[dataSource].max]} scale="linear"/>
          <Tooltip content={<CustomTooltip />} />
          <Line dataKey="y" stroke={stroke} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    );
  }

  _renderGraphMultiline(dataSource, unit) {
    // const stroke = '#'+Math.floor(Math.random()*16777215).toString(16);
    console.log("rendering ", dataSource, " graph");
    return (
      <ResponsiveContainer width="98%" height={250} style={{ marginRight: 0 }}>
        <LineChart
          data={this.state[dataSource]}
          margin={{ top: 15, bottom: 15, left: 5, right: 5 }}
        >
          <XAxis dataKey="x" tickFormatter={dateFormatter} tick={<CustomizedAxisTick />}/>
          <YAxis unit={unit} type="number" domain={[this.state[dataSource].min, this.state[dataSource].max]} scale="linear"/>
          <Tooltip content={<CustomTooltip />} />
          <Line dataKey="r" stroke="red" dot={false}/>
          <Line dataKey="y" stroke="green" dot={false}/>
          <Line dataKey="b" stroke="blue" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    );
  }


  render() {
    console.log(options);
    return (
      <div>
        <Row gutter={32}>
          <Title level={2}>Acad Block A or something</Title>
          {/*<Cascader
            options={options}
            style={{ width: 350, maxWidth: 575, textAlign: "left", marginTop: 10, marginBottom: 15 }}
            onChange={(value) => {
              console.log(value[2]);
              this.setState({ activePanel: value[2], autoload: true }, () => {
                this._refreshData();
              });
            }}
          />*/}
        </Row>
        <Row>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>Power</Title>
            {
              this.state.power ? this._renderGraphMultiline('power', 'KWh') : <Loader type="Puff" color="grey" height={40} width={40} />
            }
          </Col>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>Voltage</Title>
            {
              this.state.voltage ? this._renderGraphMultiline('voltage', 'V') : <Loader type="Puff" color="grey" height={40} width={40} />
            }
          </Col>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>Current</Title>
            {
              this.state.current ? this._renderGraphMultiline('current', 'A') : <Loader type="Puff" color="grey" height={40} width={40} />
            }
          </Col>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>Energy</Title>
            {
              this.state.ce ? this._renderGraph('ce', 'DeepPink', 'KW') : <Loader type="Puff" color="grey" height={40} width={40} />
            }
          </Col>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>Power Factor</Title>
            {
              this.state.pf ? this._renderGraph('pf', 'black', '') : <Loader type="Puff" color="grey" height={40} width={40} />
            }
          </Col>
          <Col span={12}>
            <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>Total Power</Title>
            {
              this.state.data ? this._renderGraph('data', 'DarkTurquoise', 'KWh') : <Loader type="Puff" color="grey" height={40} width={40} />
            }
          </Col>
        </Row>
      </div>
    );
  }

  componentDidMount() {
    setInterval(async () => {
      if (!this.state.autoload) return;
      this._refreshData();
      this._fetchCE();
      this._fetchVoltage();
      this._fetchPower();
      this._fetchCurrent();
      this._fetchPF();
      console.log("POWER", this.state['power']);
    }, 5*1000);
  }

}

export default Graph;
