import React from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';

import { AppColor } from '../constants/AppConstant';
import { setGoal, reloadWeekly, reloadMonthly } from '../redux/actions/ActionCreator';
import * as NavigationService from '../navigation/NavigationService'
import AsyncStorage from '@react-native-community/async-storage';

interface UpdateButtonState {
  newGoal: string,
};

interface ButtonProps {
  setGoal: (arg: string) => string;
}

interface ReloadButtonState {
  isButtonEnable: boolean
}

interface ReloadProps {
  reloadMonthly: () => void;
  reloadWeekly: () => void;
}

export class UpdateButton extends React.Component<ButtonProps, UpdateButtonState> {
  constructor(props: Readonly<ButtonProps>) {
    super(props);
    this.state = {
      newGoal: '1000',
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
          <Text style={styles.description}>DAILY OBJECTIVE</Text>
          <TextInput
            style={{ textAlign: 'center', color: AppColor.highlightOrange, fontSize: 20}}
            keyboardType={"numeric"}
            contextMenuHidden={true}
            maxLength={7}
            onChangeText = { (text) => this.onChangeText(text) }
            value={ this.state.newGoal }
          />
        <Button style={styles.button} onPress={()=>this.updateGoal()}>
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

    const route = NavigationService.getCurrentRoute();
    const routeName = route.name;
    switch (routeName) {
      case 'Recent':
        this.props.reloadWeekly();
        this.props.reloadMonthly();
        break;
      case 'Overall':
       break;
      default:
        //nothing
    }
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
    // fontFamily: 'Oxanium',
    // fontWeight: 'bold',
  },
  button: {
    padding: 5,
    overflow: 'hidden',
    textAlign:'center',
    fontFamily: 'Oxanium',
    fontSize: 15,
    color: AppColor.highlightGreen,
    borderColor: AppColor.highlightGreen,
    borderWidth: 1,
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
    reloadWeekly: () => dispatch(reloadWeekly()),
    reloadMonthly: () => dispatch(reloadMonthly())
  }
}

export const DailyButton = connect(null, mapDispatchToProps)(UpdateButton);
export const ReloadButton = connect(null, mapReloadToProps)(RefreshButton);
