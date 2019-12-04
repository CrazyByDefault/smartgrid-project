import React from "react";
import moment from "moment";
import {
  Calendar
} from "antd";

class PDFCal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4, margin: "15px 15px 10px 10px" }}>
        <Calendar
          fullscreen={false}
          onSelect={(d) => {
            console.log(d.format("YYYY-MM-DD") + ".pdf");
            this.setState({ url: d.format("YYYY-MM-DD") + ".pdf", dl: true });
          }}
          onPanelChange={(v, m) => {
            console.log(v, m);
          }}
        />
        {
          this.state.dl ? <a href={this.state.url} download>Download {this.state.url}</a> : null
        }
      </div>
    );
  }
}

export default PDFCal;
