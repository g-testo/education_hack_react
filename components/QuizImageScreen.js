import React from 'react';
import { Platform, StyleSheet, View, Text, Image, Button, Alert, Switch} from "react-native";
import { DrawerNavigator, TabNavigator, } from 'react-navigation';

import { NavScreen } from './NavScreen';

export class QuizImageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      answerObj: [],
      selectionObjArr: [],
      currentChoice: '',
      scoreArr: [],
    };
  };

_answerCheck = (selectionObj, answerObj) => {
  // checks if the selection is correct
  if (selectionObj.name === answerObj.name){
    this.props.easyMode ? Alert.alert("You're right. Congrats!!") : '';
    currentChoice = "right"
  } else {
    this.props.easyMode ? Alert.alert("Sorry, that is not correct.") : '';
    currentChoice = "wrong"
  }
  // are there still unanswered questions?
  if(this.state.unaskedQuests.length > 1){
    // shuffle the character data container for next question
    let newData = this.props._shuffle(this.state.data)
    // remove answer from unaskedQuests array
    let newUnaskedQuests = this.state.unaskedQuests.filter( (item) => {
      return item.name != answerObj.name
    });
    //find answer values that do not include answered questions using new shuffled data
    const result = this.props._getAnsObjSelArr(newData, newUnaskedQuests, 'gender');

    this.setState({
      scoreArr: [...this.state.scoreArr, currentChoice],
      answerObj: result.answerObj,
      selectionObjArr: result.selectionObjArr,
      data: newData,
      unaskedQuests: newUnaskedQuests
    });

  } else {  // if there are no more questions to ask

    const data = this.state.data
    const categories = ['Doctor', 'Companion', 'Secondary', 'Villain', 'Actor'];
    const nav = this.props.navigation;
    const scoreArr = this.state.scoreArr

    this.props._finishedQuizMenu(data, categories, nav, scoreArr)

    this.setState({ scoreArr: [] })
    const shuffledData = this.props._shuffle(data);
    const result = this.props._getAnsObjSelArr(shuffledData, shuffledData, 'gender');
    this.setState({
      answerObj: result.answerObj,
      selectionObjArr: result.selectionObjArr,
      data: shuffledData,
      unaskedQuests: shuffledData,
    });

  };
};

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    const data = nextProps.data
    const unaskedQuests = [ ...nextProps.data ];
    const result = this.props._getAnsObjSelArr(data, unaskedQuests);

    this.setState({
      answerObj: result.answerObj,
      selectionObjArr: result.selectionObjArr,
      data: data,
      unaskedQuests: unaskedQuests,
    });
  };

  render() {
    const data = this.state.data;
    const answerObj = this.state.answerObj;
    const selectionObjArr = this.state.selectionObjArr;
    const buttons = [];
    var imgQuest = answerObj.image_url;
    selectionObjArr.map((selectionObj) => {
      var choice = selectionObj.name;
      buttons.push(
        <Button key={String(selectionObj.name)} onPress={() =>
          this._answerCheck(selectionObj, answerObj)}
          title= {String(choice)} />
      );
    });
    var image = <Image style={{width: 250, height: 250}} source={{uri: answerObj ? imgQuest : 'NA'}}/>

    const banner = this.props.banner;
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavScreen banner={ !banner? 'Image Quiz' : banner} navigation={navigation} />
        <View>{ image }</View>
        <View>{ buttons }</View>
        <Text>{ 'Easy Mode' }</Text>
        <Switch onValueChange={(value) => this.props._toggleEasyMode(value)}
          style={{marginBottom: 10}}
          value={this.props.easyMode} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
