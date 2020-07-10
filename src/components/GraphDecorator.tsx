import React from 'react';
import { Animated, View, StyleSheet, PanResponder, Text } from "react-native";
import Svg, { Circle, ForeignObject, G, Line } from 'react-native-svg';
import moment from 'moment';

import { AppColor } from '../constants/AppConstant';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const RADIUS = 5.5;
const HOURTOSEC = 3600 * 1000;

const DecoratorTextBox = (props: any) => {
  return(
    <ForeignObject
      x={-props.width/2}
      y={-props.height-RADIUS*1.3}
      width={props.width}
      height={props.height}
    >
      <View
        style={[
          styles.TextBoxStyle,
          {
            width: props.width,
            height: props.height,
          }
        ]}
      >
        <Text style={styles.TextStyle}>
          { (props.translatePosValue.index !== null)
            ? moment.utc(props.translatePosValue.index*HOURTOSEC).format('HH:mm') + " - "
            + moment.utc((props.translatePosValue.index + 1)*HOURTOSEC).format('HH:mm')
            : null
          }
        </Text>
        <Text style={styles.TextStyle}>
          { props.translatePosValue.value }
        </Text>
      </View>
    </ForeignObject>
  )
}

const styles = StyleSheet.create({
  TextBoxStyle: {
    backgroundColor: (AppColor.black + AppColor.opa60),
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 3,
  },
  TextStyle: {
    color: AppColor.white,
    fontSize: 11
  }
})

export class GraphDecorator extends React.Component<any> {
    static defaultProps: any

    pan = new Animated.ValueXY();
    panListener = "";

    innerWidth = this.props.width - this.props.chartStyle.paddingLeft -
      this.props.chartStyle.paddingRight - this.props.horizontalLabelWidth;
    innerHeight = this.props.height - this.props.chartStyle.paddingTop -
      this.props.chartStyle.paddingBottom - this.props.verticalLabelHeight - this.props.gutterTop;
    dataMax = Math.max(...this.props.data[0].data)

    rangeX = this.pan.x.interpolate({
      inputRange: [0, this.innerWidth],
      outputRange: [0, this.innerWidth],
      extrapolate: 'clamp'
    });

    state = {
      onHover: false,
      translatePosValue: { value: null, index: null } ,
    }

    barPos(config: any) {
      const { data, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight,
        chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      } = config;

      const labelWidth = (width - horizontalLabelWidth - paddingRight - paddingLeft) / data[0].data.length;
      const midPoint = labelWidth / 2;
      const barWidth = this.props.barWidth;

      // return { innerHeight, labelWidth, midPoint, barWidth };
      return {
        dataPos: data[0].data.map((item,i:number) => labelWidth * i),
        data: data[0].data,
        barWidth,
        labelWidth
      }
    }

    getDataOnPos (currentPos: number, dataPos: number[], data: number[], range: number, diff: number) {
      const offset = diff/2;
      const offsetPos = currentPos - offset;
      const startPoint = dataPos[0];
      const endPoint = dataPos[dataPos.length-1];

      if (offsetPos < startPoint) {
        return { value: data[0], index: 0 };
      }

      if (offsetPos > endPoint) {
        return { value: data[dataPos.length-1], index: dataPos.length-1 };
      }

      const remainder = Math.floor(offsetPos % diff);
      const quotient = Math.floor(offsetPos / diff);

      if( remainder - range <= 0 ) return { value: data[quotient], index: quotient }; // check left
      if( remainder + range >= diff ) return { value: data[quotient + 1], index: quotient + 1 }; // check right

      return { value: null, index: null };
    }

    _panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.pan.setOffset(this.pan.__getValue());
        this.pan.setValue({x: 0, y: 0});
        this.setState({
          onHover: true
        })
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.pan.x,
          dy: this.pan.y,
        }
      ], {useNativeDriver: false}),

      onPanResponderRelease: () => {
        this.pan.flattenOffset();

        var x = (this.pan.x._value > this.innerWidth) ? this.innerWidth : this.pan.x._value;
        x = (x < 0) ? 0 : x;

        var y = (this.pan.y._value > this.innerHeight) ? this.innerHeight : this.pan.y._value;
        y = (y < 0) ? 0 : y;

        this.pan.setValue({x: x, y: y})

        this.setState({
          onHover: false
        })
      }
    });

    componentDidMount() {
      this.panListener = this.pan.addListener(({x, y}) => {
        const { dataPos, data, barWidth, labelWidth } = this.barPos(this.props);
        this.setState({
          translatePosValue: this.getDataOnPos(x, dataPos, data, barWidth, labelWidth)
        });
      });

    }

    componentWillUnmount() {
      this.pan.removeListener(this.panListener);
    }

    render() {
    const {
      height,
      width,
      chartStyle,
      horizontalLabelWidth,
      gutterTop,
      verticalLabelHeight,
    } = this.props;

    return (
      <>
        <Svg height={height} width={width}>
          <AnimatedG
            x={chartStyle.paddingLeft + horizontalLabelWidth}
            y={chartStyle.paddingTop + gutterTop}
            style={{
              transform: [{ translateX: this.rangeX }]
            }}
            {...this._panResponder.panHandlers}
          >
            {
              <AnimatedCircle
                cx= {0}
                cy= {-RADIUS}
                r={RADIUS*1.3}
                stroke={AppColor.highlightBlue}
                strokeWidth="2"
                opacity={this.state.onHover ? 1 : 0.5}
              />
            }
            {
              <AnimatedCircle
                cx= {0}
                cy= {-RADIUS}
                r={RADIUS/2}
                fill={AppColor.highlightBlue}
                opacity={this.state.onHover ? 1 : 0.8}
              />
            }
            {
              this.state.onHover
              ? <DecoratorTextBox width={80} height={40} translatePosValue={this.state.translatePosValue} />
              : null
            }
            {
              <AnimatedLine
                x1={0}
                y1={-RADIUS*2.5}
                x2={0}
                y2={this.innerHeight}
                stroke={AppColor.highlightBlue}
                opacity={0}
                strokeWidth={width*2}
              />
            }
            {
              <AnimatedLine
                x1={0}
                y1={0}
                x2={0}
                y2={this.innerHeight}
                stroke={AppColor.highlightBlue}
                strokeWidth="2"
                strokeDasharray="4"
                opacity={this.state.onHover ? 1 : 0.5}
              />
            }
            {
              <AnimatedLine
                x1={0}
                y1={0}
                x2={0}
                y2={this.innerHeight}
                stroke={AppColor.highlightOrange}
                opacity={0}
                strokeWidth={width*2}
              />
            }
          </AnimatedG>
        </Svg>
      </>
    )
  }
}

GraphDecorator.defaultProps = {
  opaOnHover: 1,
  opacity: 0.5
}
