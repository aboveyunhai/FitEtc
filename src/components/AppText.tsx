import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { AppFont } from '../constants/AppConstant';


interface MyProps {
  style?:  TextStyle | TextStyle[];
}

interface MyState {

}

export default class DefaultText extends Component<MyProps, MyState> {
  constructor(props: Readonly<{}>){
    super(props);
  }
  render() {
    const { style, ...otherProps } = this.props;
    return(
      <Text
        style={[
          styles.defaultStyle,
          style
        ]}
        {...otherProps}
      >
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: AppFont.Oxanium.regular,
  },
  font1: {
    fontFamily: 'nixie-one',
  }
});
