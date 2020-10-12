import React, { Component, PureComponent } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton, AtInput } from "taro-ui";
import Taro from "@tarojs/taro";

import "taro-ui/dist/style/components/flex.scss";
import "./index.less";

export default class Index extends PureComponent {
  fundList = ["001618"];
  state = {
    userId: this.getGuid(),
    dataList: [],
    isEdit: false
  };
  //   constructor(...props) {
  //     super(props);
  //   }
  getGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  // 编辑按钮
  edit() {
    console.log("编辑");
    this.setState({
      isEdit: !this.state.isEdit
    });
  }
  // 输入份额
  changeNum(item, value) {
    console.log("输入份额");
    // console.log(this.state.dataList);
    console.log(item, value);
    const data = this.state.dataList
    const newData = data.map(v => {
        if(v.FCODE = item.FCODE) {
            v.num = Number(value)
            v.gains = (v.num * v.NAV * v.GSZZL * 0.01).toFixed(1)
        }
        return v
    })
    this.setState({
        dataList: newData
    })
    console.log(3, newData);
    Taro.setStorage({
        key:"fundListM",
        data: newData
    })

  }
  componentWillMount() {}

  componentDidMount() {
    const fundListM = [];
    for (const fund of this.fundList) {
      let val = {
        FCODE: fund,
        num: 0
      };
      fundListM.push(val);
    }
    let fundlist = fundListM.map(val => val.FCODE).join(",");
    let url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=${this.state.userId}&Fcodes=${fundlist}`;
    Taro.request({
      url
    })
      .then(res => {
        console.log(2, res);
        if (res && res.data && res.data.Datas) {
          let data = res.data.Datas;
          data = data.map(v => {
            let slt = fundListM.filter(item => item.FCODE == v.FCODE);
            const num = slt[0].num;
            console.log(4, num);
            
            const gains = ((num || 0) * v.NAV * v.GSZZL * 0.01).toFixed(1);
            return { ...v, num, gains };
          });
          this.setState({
            dataList: data
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
      <View className="tableList">
        <View className="at-row">
          <View className="at-col at-col-5">基金名称</View>
          <View className="at-col">涨跌幅</View>
          <View className="at-col">估算收益</View>
          {!this.state.isEdit && <View className="at-col">更新时间</View>}
          {this.state.isEdit && <View className="at-col">持有份额</View>}
        </View>
        <View className="at-row">
          {this.state.dataList.map(v => (
            <View className="at-row">
              <View className="at-col at-col-5 at-col--wrap">
                {v.SHORTNAME}
              </View>
              <View className={`at-col ${v.GSZZL >= 0 ? "up" : "down"}`}>
                {v.GSZZL}
              </View>
              <View className={`at-col ${v.gains >= 0 ? "up" : "down"}`}>
                {v.gains}
              </View>
              {!this.state.isEdit && (
                <View className={`at-col`}>{v.GZTIME.substr(-5)}</View>
              )}
              {/* <View className={`at-col`}>
                {v.num}
              </View> */}
              {this.state.isEdit && (
                <View className={`at-col`}>
                  <AtInput
                    name="value2"
                    // title="数字"
                    type="number"
                    border={true}
                    placeholder="请输入份额"
                    value={v.num}
                    onChange={this.changeNum.bind(this, v)}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        <View className="btnBar">
          <View className="subitem">
            <AtButton customStyle="width: 50px;" size="small">
              休市中
            </AtButton>
          </View>
          <View className="subitem">
            <AtButton
              customStyle="min-width: 50px;"
              size="small"
              onClick={this.edit.bind(this)}
            >
              {this.state.isEdit ? "完成编辑" : "编辑"}
            </AtButton>
          </View>
          <View className="subitem">
            <AtButton customStyle="width: 50px;" size="small">
              设置
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}
