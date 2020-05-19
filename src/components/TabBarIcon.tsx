import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import { AppColor } from '../constants/AppConstant';

export default function TabBarIcon(props:any) {
  return (
    <Icon
      name={props.name}
      size={props.size}
      style={{ marginBottom: -3 }}
      color={props.focused ? AppColor.tabIconSelected : AppColor.tabIconDefault}
    />
  );
}
