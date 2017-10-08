import React from 'react';
import { Platform, StyleSheet, View, ScrollView, Text, Button, Alert,} from "react-native";
import { DrawerNavigator, TabNavigator, } from 'react-navigation';
import { NavScreen } from './NavScreen';
import { QuizImageScreen } from './QuizImageScreen';

export default class QuizDataComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  _toggleEasyMode = (value) => {
    let message;
    if(value === true){
      message = 'Answers will be shown after answering a question.\n \n Warning: \n Quiz will restart and your score will not be saved in this mode.'
    } else {
      message = 'Quiz will restart.'
    }
    Alert.alert( 'Are you sure?', message, [
      {text: 'OK', onPress: () => this.setState({easyMode: value})},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
    ], { cancelable: true } )
  }

  _shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  _getAnsObjSelArr = (allObjArr, unaskedQuestsArr) => {
    var randomIndex;
    let unique = false;
    while(unique === false) {
      randomIndex = Math.floor(Math.random() * (allObjArr.length))
      if (unaskedQuestsArr.includes(allObjArr[randomIndex])) {
        var chosenIndex = randomIndex;
        unique = true;
      }
    }
    const answerObj = allObjArr[chosenIndex];
    let selectionContainer = [chosenIndex];
    while(selectionContainer.length < 3) {
      var randNum = Math.floor(Math.random() * (allObjArr.length));
      if (!selectionContainer.includes(randNum)){
        selectionContainer.push(randNum);
      }
    }
    const selectionObjContainer = selectionContainer.map( (index) => {
      return allObjArr[index]
    })

    const selectionObjArr = this._shuffle(selectionObjContainer); // shuffle the order of the selection container

    return {selectionObjArr : selectionObjArr, answerObj : answerObj};
  }

  _calcScore = (scoreArr) => {
    const totalQuestions = scoreArr.length;
    const totalRightAns = scoreArr.filter( (choice) => {
      return choice === 'right';
    }).length;
    return String(Math.round(totalRightAns/totalQuestions*100));
  }

  _finishedQuizMenu = (data, navigation, scoreArr) => {
    const score = this._calcScore(scoreArr);
    const currentRoute = navigation.state.routeName;
    Alert.alert( `Congratulations! \n You scored ${score}%`, 'What would you like to do now?', [
      {text: 'Menu', onPress: () => {
        navigation.navigate('DrawerOpen');
      }},
      {text: 'Replay', onPress: () => {
        //do nothing
      }},
    ]);
  }

  componentDidMount() {
    var url = `http://localhost:3001/api/v1/items.json`
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      var itemsArr = []
        responseJson.map((items) => {
          let itemsUrl = items.image_url ? `http://localhost:3001/objects/` + items.image_url : "";
            itemsArr.push({
              submitted_by: items.submitted_by,
              name: items.object_local_name,
              image_url: itemsUrl,
              category: items.category,
              community_group: items.community_group,
              object_local_language: items.object_local_language,
              trust_rating: items.trust_rating
            });
        })
      this.setState(previousState => {
        return {data:itemsArr};
      })
    })
    .catch((error) => {
      console.error(error)
    });
  }

  render() {
    console.log(this.state.data)
    const navigation = this.props.navigation;
    const banner = this.props.banner;
    let data = this.state.data;
    let ComponentToLoad;

    return <QuizImageScreen
      easyMode={this.state.easyMode}
      navigation={navigation}
      data={data}
      _finishedQuizMenu={this._finishedQuizMenu}
      _getAnsObjSelArr={this._getAnsObjSelArr}
      _toggleEasyMode={this._toggleEasyMode}
      _calcScore={this._calcScore}
      _shuffle={this._shuffle}
    />;
  };
};
