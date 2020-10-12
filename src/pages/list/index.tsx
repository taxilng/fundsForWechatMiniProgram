import React, { Component, PureComponent } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";

import "taro-ui/dist/style/components/flex.scss";
import "./index.less";


export default class Index extends PureComponent {
    state = {
      indFundData: [
        { f14: "上证指数", f2: "3224", f3: 0.21, f4: "6.83" },
        { f14: "沪深300", f2: "3224", f3: 0.21, f4: "6.83" },
        { f14: "创业板指", f2: "3224", f3: 0.21, f4: "6.83" },
        { f14: "上证指数", f2: "3224", f3: 0.21, f4: "6.83" }
      ],
      seciList: ["1.000001", "1.000300", "0.399001", "0.399006"]
    };
//   constructor(...props) {
//     super(props);
//   }

  componentWillMount() {}

  componentDidMount() {
    let seciListStr = this.state.seciList.join(",");
    let url = `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=${seciListStr}&_=${new Date().getTime()}`;
    Taro.request({
      url
    })
      .then(res => {
        console.log(1, res);
        if (res && res.data && res.data.data) {
          this.setState({
            indFundData: res.data.data.diff
          });
        }
      })
      .catch(err => console.log(22, err));
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="index">
        <View className="at-row">
          {this.state.indFundData.map(v => (
            <View className="at-col">
              <View>{v.f14}</View>
              <View className={`${v.f3 >= 0 ? "up" : "down"}`}>{v.f2}</View>
              <View className={`${v.f3 >= 0 ? "up" : "down"}`}>
                {v.f4}&nbsp;&nbsp;{v.f3}%
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}
