import React from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';

import AppText from '../components/AppText';
import { AppColor, AppFont, AppScreen } from '../constants/AppConstant';
import * as actionTypes from '../redux/actions/actionTypes';
import { setGoal, loadDaily, loadWeekly, loadMonthly, loadData } from '../redux/actions/ActionCreator';
import * as NavigationService from '../navigation/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';

interface UpdateButtonState {
  newGoal: string,
  active: boolean
};

interface ButtonProps {
  setGoal: (arg: string) => string;
}

interface ReloadButtonState {
  isButtonEnable: boolean
}

interface ReloadProps {
  reload: () => void;
  loadData: () => void;
}

export function reloadRecent(func: {[key:string]: (arg?:any)=>void} ){
  const { reload, loadData } = func;
  const nestedRoute = NavigationService.getCurrentRoute();
  if(nestedRoute === undefined) return;
  const routeName = nestedRoute.name;
  switch (routeName) {
    case AppScreen.RECENT:
      reload();
      break;
    case AppScreen.OVERALL:
      loadData(new Date(), new Date());
     break;
    default:
      //nothing
  }
}

export class UpdateButton extends React.Component<ButtonProps, UpdateButtonState> {
  constructor(props: Readonly<ButtonProps>) {
    super(props);
    this.state = {
      newGoal: '1000',
      active: false,
    }
  }

  onChangeText(text : string) {
    //accept number(whole number)string only
    const value = text.replace(/[^0-9]/gi, '');
    const newGoal = (parseInt(value) <=0) ? this.state.newGoal || '1' : value;
    this.setState({
      newGoal: newGoal,
    });
  }

  updateGoal() {
    this.props.setGoal(this.state.newGoal);
  }

  onPressIn() {
    this.setState({active: true})
  }

  onPressOut() {
    this.updateGoal();
    this.setState({active:false})
  }

  componentDidMount() {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_dailyGoal');
        // console.log(value);
        if(value !== null) {
          this.setState({
            newGoal: value
          })
        }
      } catch(e) {
        // error reading value
      }
    })();
  }

  render(){
    return(
      <View style={styles.container}>
          <AppText style={styles.description}>
            <Text>DAILY GOAL</Text>
          </AppText>
          <TextInput
            style={{ textAlign: 'center', color: AppColor.highlightOrange, fontSize: 20, fontFamily: 'Oxanium-ExtraLight'}}
            keyboardType={"numeric"}
            contextMenuHidden={true}
            maxLength={7}
            onChangeText = { (text) => this.onChangeText(text) }
            value={ this.state.newGoal }
          />
        <Button
          style={[
            styles.button,
            {
              backgroundColor: (this.state.active) ? AppColor.highlightGreen : AppColor.baseColor,
              color: (this.state.active) ? AppColor.baseColor : AppColor.highlightGreen
            }
          ]}
          onPressIn={()=>this.onPressIn()}
          onPressOut={()=>this.onPressOut()}
        >
          UPDATE
        </Button>
      </View>
    );
  }
}


/***
* button related to Statistics Screen
*/

export class RefreshButton extends React.Component<ReloadProps, ReloadButtonState> {

  constructor(props: Readonly<any>){
    super(props);
    this.state = {
        isButtonEnable: true
    }
  }

  spinValue = new Animated.Value(0);

  // refresh data
  loading() {
    //prevent multiple clicking
    if(!this.state.isButtonEnable) return;
    this.setState({
      isButtonEnable: false
    })

    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    ).start(() => {
      this.setState({
        isButtonEnable: true
      })
    });

    reloadRecent({
      reload: this.props.reload,
      loadData: this.props.loadData,
    });
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <Animated.View
        style={{
          marginRight: 15,
          transform: [{ rotate: spin }]
        }}
      >
        <Icon
          name='sync'
          size={20}
          onPress= {() => this.loading()}
          style={{
            color: AppColor.grey,
        }}/>
      </Animated.View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
    color: AppColor.highlightBlue,
  },
  button: {
    padding: 5,
    overflow: 'hidden',
    textAlign:'center',
    fontFamily: AppFont.Oxanium.regular,
    fontSize: 15,
    borderColor: AppColor.highlightGreen,
    borderWidth: 1,
    marginLeft: '5%',
    marginRight: '5%',
  }
});

/***
* connect button to redux store
*/
const mapDispatchToProps = (dispatch: any) => {
  return {
    setGoal: (newGoal:string) => dispatch(setGoal(newGoal))
  }
};

const mapReloadToProps = (dispatch: any) => {
  return {
    reload: () => {
      dispatch({  type: actionTypes.LOAD_FIT_DAY_START });
      dispatch(loadDaily());
      dispatch({  type: actionTypes.LOAD_FIT_WEEK_START });
      dispatch(loadWeekly());
      dispatch({  type: actionTypes.LOAD_FIT_MONTH_START });
      dispatch(loadMonthly());
    },
    loadData: (startDate:Date, endDate:Date) => {
      dispatch({ type: actionTypes.LOAD_FIT_DATA_START });
      dispatch(loadData(startDate, endDate));
    }
  }
}

export const DailyButton = connect(null, mapDispatchToProps)(UpdateButton);
export const ReloadButton = connect(null, mapReloadToProps)(RefreshButton);
