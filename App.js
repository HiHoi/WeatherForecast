import React from "react";
import Loading from "./assets/Loading.js";
import TomorrowWeather from "./assets/tomorrowWeather.js";
import * as Location from "expo-location";
import { Alert } from "react-native";
import axios from "axios";

//날씨 데이터 접속에 필요한 키
const API_KEY = "7e4d022a8f8f27f57eedbbea0442952b";

//날씨를 3시간마다 갱신하기위해 시간도 같이 갱신해야 한다.
//const date = new Date() 
//const TIME = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:00:00`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }
  //내일의 날씨(5일 3시간 갱신)
  getTomorrow = async (latitude, longitude) => {
    const {
      data: {
        list : {
          dt_txt, 
          main: { temp },
          weather }
        
      }
    } = await axios.get(
      `api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    this.setState({
      isLoading : false,
      to_condition: weather[0].main,
      temp
    });
  };
  //위치 탐색
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getTomorrow(latitude, longitude);
    } catch (error) {
      Alert.alert("Sorry.", "I can find u! :/");
    }
  };
  
  componentDidMount() {
    this.getLocation();
  }
  
  render() {
    const { isLoading,temp,condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <React.Fragment>
        <TomorrowWeather temp={Math.round(temp)} condition={condition} />
      </React.Fragment>
    );
  }
}
