import React from 'react';
import { Dimensions, StyleSheet, View} from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

import { AppColor, AppFont } from '../constants/AppConstant';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const HeaderTag = (props: any) => {
  const tagSize = 25;
  const header_H = 40*0.75;
  const header_W = SCREEN_WIDTH/2.5;
  const x_Offset = 8, y_Offset = 5;
  return (
    <View style={styles.header}>
      <Svg height={header_H + y_Offset} width={SCREEN_WIDTH}>
        <Rect
          x={x_Offset}
          y={y_Offset}
          height={header_H}
          width={header_W}
          strokeWidth={1}
          stroke={AppColor.highlightBlue}
        />
        <Text
          x={x_Offset + tagSize}
          y={y_Offset + header_H/2-1}
          alignmentBaseline="central"
          fill={AppColor.highlightBlue}
          fontSize={14}
          fontFamily={AppFont.Oxanium.regular}
        >
          { props.tagContent }
        </Text>
        <Rect
          x={0}
          y={0}
          height={tagSize}
          width={tagSize}
          fill={AppColor.highlightBlue}
        />
        <Text
          x={25/2}
          y={25/2-1}
          alignmentBaseline="central"
          textAnchor='middle'
          fill={AppColor.white}
          fontSize={15}
          fontFamily={AppFont.Oxanium.bold}
        >
          { props.tagLabel }
        </Text>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    color: AppColor.highlightBlue,
    paddingLeft: 10,
  },
});
