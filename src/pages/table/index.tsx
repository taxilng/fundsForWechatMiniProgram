import React, { Component, PureComponent } from "react";
import { View, Text } from "@tarojs/components";
import {
  AtButton,
  AtInput,
  AtForm,
  AtSearchBar,
  AtList,
  AtListItem
} from "taro-ui";
import Taro from "@tarojs/taro";

import "./index.less";

export default class Index extends PureComponent {
  state = {
    fundListM: [{ FCODE: "001618", num: 0 }],
    userId: this.getGuid(),
    dataList: [],
    isEdit: false,
    searchValue: "",
    selector: [],
    curItem: {
      FCODE: ""
    },
    curCost: '',
  };
  //   constructor(...props) {
  //     super(props);
  //   }
  onChange(value) {
    this.setState({
      searchValue: value
    });
  }
  //搜索框触发
  searchClick() {
    console.log("开始搜索");
    let url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?&m=9&key=${
      this.state.searchValue
    }&_=${new Date().getTime()}`;
    Taro.request({ url }).then(res => {
      console.log("dai", res);
      if (res && res.data && res.data.Datas) {
        this.setState({
          selector: res.data.Datas
        });
      }
    });
  }
  selectFund(code) {
    console.log("选中的基金", code);
    //清空值和下拉框
    // 添加列表的数据
    this.setState(
      {
        selector: [],
        searchValue: "",
        fundListM: [...this.state.fundListM, { FCODE: code, num: 0 }]
      },
      () => {
        Taro.setStorage({
          key: "fundListM",
          data: this.state.fundListM
        });
        this.getData();
      }
    );
  }
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
  editOne(v) {
    this.setState({
      curItem: v
    });
  }
  // 输入份额
  changeNum(value) {
    console.log("输入份额");
    // console.log(this.state.dataList);
    console.log(value);
    const data = this.state.dataList;
    const newData = data.map(v => {
      if (v.FCODE === this.state.curItem.FCODE) {
        v.num = value
        v.gains = (v.num * v.NAV * v.GSZZL * 0.01).toFixed(1);
      }
      return v;
    });
    this.setState({
      dataList: newData
    });
    console.log(3, newData);
    Taro.setStorage({
      key: "fundListM",
      data: newData
    });
    // return value;
  }
  // 输入成本价
  changCost(value) {
    console.log("输入成本价",value);
    // console.log(this.state.dataList);
    const data = this.state.dataList;
    const newData = data.map(v => {
      if (v.FCODE === this.state.curItem.FCODE) {
        v.cost = value;
      }
      return v;
    });
    this.setState({
      dataList: newData
    });
    console.log(4, newData);
    Taro.setStorage({
      key: "fundListM",
      data: newData
    });
    // return value;
  }
  getData() {
    let fundlist = this.state.fundListM.map(val => val.FCODE).join(",");
    let url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=${this.state.userId}&Fcodes=${fundlist}`;
    Taro.request({
      url
    })
      .then(res => {
        console.log(2, res);
        if (res && res.data && res.data.Datas) {
          let data = res.data.Datas;
          data = data.map(v => {
            let slt = this.state.fundListM.filter(
              item => item.FCODE == v.FCODE
            );
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
  componentWillMount() {
    Taro.getStorage({
      key: "fundListM"
    })
      .then(res => {
        console.log("chui", res);
        this.setState(
          {
            fundListM: res.data
          },
          () => {
            this.getData();
          }
        );
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        this.getData();
      });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="tableList">
        {this.state.isEdit && (
          <View>
            <View className="input-row">
              <AtSearchBar
                placeholder="添加新基金"
                value={this.state.searchValue}
                onChange={this.onChange.bind(this)}
                onActionClick={this.searchClick.bind(this)}
              />
              <AtList>
                {this.state.selector.map(v => (
                  <AtListItem
                    title={v.NAME}
                    note={v.CODE}
                    onClick={this.selectFund.bind(this, v.CODE)}
                  />
                ))}
              </AtList>
            </View>
          </View>
        )}
        <View className="mytable">
          <View className="at-row tableHeader">
            <View className="at-col at-col-5">基金名称</View>
            <View className="at-col">涨跌幅</View>
            <View className="at-col">估算收益</View>
            {!this.state.isEdit && <View className="at-col">更新时间</View>}
            {this.state.isEdit && (
              <View className="at-col at-col-3">持有份额</View>
            )}
            {this.state.isEdit && (
              <View className="at-col at-col-3">成本价</View>
            )}
          </View>
          <View>
            {this.state.dataList.map(v => (
              <View
                className="at-row listItem"
                onClick={this.editOne.bind(this, v)}
              >
                <View className="at-col at-col-5 at-col--wrap">
                  {v.SHORTNAME}
                </View>
                <View className={`at-col minwidth ${v.GSZZL >= 0 ? "up" : "down"}`}>
                  {v.GSZZL}
                </View>
                <View className={`at-col minwidth ${v.gains >= 0 ? "up" : "down"}`}>
                  {v.gains}
                </View>
                {!this.state.isEdit && (
                  <View className={`at-col`}>{v.GZTIME.substr(-5)}</View>
                )}
                {/* <View className={`at-col`}>
                {v.num}
              </View> */}
                {this.state.isEdit && (
                  <View className="at-col at-col-3">
                    <AtInput
                      name="value2"
                      className="myinput"
                      type="number"
                      border={true}
                      placeholder="请输入份额"
                      value={v.num}
                      onChange={this.changeNum.bind(this)}
                    />
                  </View>
                )}
                {this.state.isEdit && (
                  <View className="at-col at-col-3">
                    <AtInput
                      name="value3"
                      className="myinput"
                      type="number"
                      border={true}
                      placeholder="成本价"
                      value={v.cost}
                      onChange={this.changCost.bind(this)}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
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
