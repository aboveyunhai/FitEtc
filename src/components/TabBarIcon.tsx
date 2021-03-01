import React from 'react';
import ADIcon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppColor} from '../constants/AppConstant';

interface IconProps {
  name: string;
  size: number;
  focused?: boolean;
  color?: string;
  iconColor?: string;
  type?: 'MaterialCommunity';
  style?: {};
  onPress?: () => any;
}

export default function TabBarIcon(props: IconProps) {
  return <>{renderIcon(props)}</>;
}

function renderIcon(props: IconProps) {
  const color = props.color
    ? props.color
    : props.focused
    ? AppColor.tabIconSelected
    : props.iconColor
    ? props.iconColor
    : AppColor.tabIconDefault;
  switch (props.type) {
    case 'MaterialCommunity':
      return (
        <MCIcon
          name={props.name}
          size={props.size}
          style={props.style}
          color={
            props.color
              ? props.color
              : props.focused
              ? AppColor.tabIconSelected
              : props.iconColor
              ? props.iconColor
              : AppColor.tabIconDefault
          }
          onPress={props.onPress}
        />
      );
    default:
      return (
        <ADIcon
          name={props.name}
          size={props.size}
          style={props.style}
          color={color}
          onPress={props.onPress}
        />
      );
  }
}
