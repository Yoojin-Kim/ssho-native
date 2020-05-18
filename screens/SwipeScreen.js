import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';
import { WebView } from 'react-native-webview';

const BASE_URL = 'http://13.124.59.2:8081' // 서버 통신을 위한 base url

export default class SwipeScreen extends Component {

  constructor (props) {
    super(props)
    this.state = {
      // 스와이프 카드를 위한 state들
      cards: [], // 카드 컨텐츠 리스트
      swipedAllCards: false,
      swipeDirection: '',
      allSwipedCheck: false,
      cardIndex: 0,
      // swiped: false // 클릭인지 스와이프인지 구분하기 위해
      imageIndex: 0,
    }
  }

  // 컴포넌트 마운트 직후
  componentDidMount = () => {
    // 서버 통신
    const response = axios.get(BASE_URL+'/item', {
    })
      .then( (response) => {
        this.setState({ ...this.state, cards : response.data}) // state 업데이트
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  // state 변화 발생 후 업데이트 직전
  shouldComponentUpdate = ( nextState ) => {
    if(this.state.imageIndex != nextState.imageIndex){
      return true
    }
    if(this.state.cards != nextState.cards){ // cards 변화 비교
      return true // 재렌더링 실행
    }
  }

  // swipe 개별 card 생성을 위한 함수 props
  renderCard = ( card , index ) => {
    return (
       card != undefined ? // card 데이터가 없을 땐 빈 카드만 먼저 렌더링 됨
          <View style={styles.card}>
              <TouchableOpacity style={styles.image} 
              onPress={() => {this.changeCardImage()}}
              >
                <Image style={{width: "100%", height: "100%"}} 
                source={{uri: card.productExtra.extraImageUrlList[this.state.imageIndex]}}
                />
              </TouchableOpacity>
              <Text>{this.state.imageIndex}</Text>
              <Text>{card.productExtra.extraImageUrlList.length}</Text>
              <Text style={styles.text} onPress={() => { 
                // 앱의 내비게이션은 사라지는 문제
                WebBrowser.openBrowserAsync(card.link)}}>
              [{card.mallNm}] {card.title}</Text>
            <Text style={styles.text}> {card.price}원 </Text>
          </View>
      : <View style={styles.card}></View>
    )
  };

  changeCardImage = () => {
    this.setState({...this.state, imageIndex : this.state.imageIndex + 1});
    console.log(this.state.imageIndex);
  }

  shopWebView = (link) => { // 왜 안되는지 모르겠음
    return <WebView source={{uri: link}} style={styles.container}></WebView>
  }

  onSwiped = (type) => { // 스와이프 방향별 처리를 위한 함수 props
    switch(type){
      case 'top': 
        console.log('모르겠음');
        this.setState({...this.state, imageIndex : 0});
        // this.setState({ ...this.state, swiped : false });
        break;
      case 'left':
        console.log('웩');
        this.setState({...this.state, imageIndex : 0});
        // this.setState({ ...this.state, swiped : false })
        break;
      case 'right':
        console.log('내꺼');
        this.setState({...this.state, imageIndex : 0});
        // this.setState({ ...this.state, swiped : false })
        break;
      // case 'swiped':
      //   this.setState({...this.state, swiped : true})
      //   console.log(this.state.swiped)
      //   break
      default: 
        this.setState({...this.state, imageIndex : 0});
        break;
    }
  }

  onSwipedAllCards = () => { // 스와이프 카드 한 덱이 종료되었을 때 호출되는 메소드로 보임
    this.setState({
      swipedAllCards: true
    });
    console.log('Swipe End')
  };


  render () {
    return (
      <View>
        <View style={styles.container}>
          <Swiper
            ref={swiper => {
              this.swiper = swiper
            }}
            allSwipedCheck
            onSwiped={() => {this.onSwiped('swiped')}}
            onSwipedLeft={() => this.onSwiped('left')}
            onSwipedRight={() => this.onSwiped('right')}
            cards={this.state.cards}
            cardIndex={this.state.cardIndex}
            cardVerticalMargin={80}
            verticalSwipe={true}
            disableBottomSwipe={true}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            stackSize={2}
            stackSeparation={20}
            overlayLabels={{
              left: {
                title: '웩',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
                title: '내꺼',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30
                  }
                }
              },
              top: {
                title: '모르겠음',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              }
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            outputRotationRange={["-20deg", "0deg", "20deg"]}
          >
          </Swiper>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            title="싫어요"
            color="coral"
            style={styles.buttons}
            onPress={()=>{this.swiper.swipeLeft()}}
          />
          <Button
            title="좋아요"
            color="coral"
            style={styles.buttons}
            onPress={()=>{this.swiper.swipeRight()}}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  card: {
    marginTop: -50,
    height: "80%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  image: {
    marginLeft: "5%",
    width: "90%",
    height: "80%"
  },
  buttonGroup: {
    marginTop: 650,
    flexDirection: "row",
    justifyContent: 'space-between',
    margin: 50
  },
  buttons: {
    width: 400,
    height: 100,
    backgroundColor: 'black',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'coral',
    backgroundColor: 'transparent',
    margin: "2%"
    
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  }
})
