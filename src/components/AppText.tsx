import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';


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
    return(
      <Text style={ styles.defaultStyle } {...this.props} >
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'sans-serif-light',
  },
  font1: {
    fontFamily: 'nixie-one',
  }
});
