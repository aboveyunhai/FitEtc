import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';

import { AppColor } from '../constants/AppConstant';
import { setGoal } from '../redux/actions/ActionCreator';

interface ButtonState {
  newGoal: string,
};

interface ButtonProps {
  setGoal: (arg: string) => string;
}

export class UpdateButton extends React.Component<ButtonProps, ButtonState> {
  constructor(props: Readonly<ButtonProps>) {
    super(props);
    this.state = {
      newGoal: '1000',
    }
  }

  onChangeText(text : string) {
    //accept number(whole number)string only
    const value = text.replace(/[^0-9]/gi, '');
    this.setState({
      newGoal: value,
    });
  }

  updateGoal() {
    this.props.setGoal(this.state.newGoal);
  }

  render(){
    return(
      <View style={styles.container}>
          <TextInput
            style={{ textAlign: 'center', color: AppColor.highlightOrange, fontSize: 20}}
            keyboardType={"numeric"}
            contextMenuHidden={true}
            maxLength={7}
            onChangeText = { (text) => this.onChangeText(text) }
            value={ this.state.newGoal }
          />
        <Button style={styles.button}onPress={()=>this.updateGoal()}>
          UPDATE
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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

export const DailyButton = connect(null, mapDispatchToProps)(UpdateButton);
