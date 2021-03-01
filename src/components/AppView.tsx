import React, {Component} from 'react';
import {View, LayoutChangeEvent, ViewStyle} from 'react-native';

interface MyState {
  dimensions: {width: number; height: number};
}

interface MyProps {
  style?: ViewStyle | ViewStyle[];
  children: (dimensions: {width: number; height: number}) => JSX.Element;
}

export default class DefaultView extends Component<MyProps, MyState> {
  constructor(props: Readonly<MyProps>) {
    super(props);
    this.state = {dimensions: {width: 0, height: 0}};
  }

  onLayout = (event: LayoutChangeEvent) => {
    this.setState({
      dimensions: event.nativeEvent.layout,
    });
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <View {...props} onLayout={this.onLayout}>
        {this.props.children(this.state.dimensions)}
      </View>
    );
  }
}
