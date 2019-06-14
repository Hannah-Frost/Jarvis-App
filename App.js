import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Button } from 'react-native';
import * as Speech from 'expo-speech';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Weather } from './app/components/Weather';
import weatherScript from './app/utils/WeatherScript';
import { weatherAPI } from './app/utils/API';
import { APP_ID } from 'react-native-dotenv'
import { homeBackground } from './app/utils/Colours';


export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        dataSource: null,
        weatherReport: null,
        latitude: null,
        longitude: null,
      }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("DENIED");
    }
    let location = await Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude
    const longitude = location.coords.longitude

    this.setState({ latitude, longitude });
  };

  fetchWeather(lat, lon) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${APP_ID}`)
    .then ( (response) => response.json() )
    .then( (responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson.list.slice(0, 4),
      })
    })
    .catch((error) => {
      console.log(error)
    });
  }

  componentDidMount() {
    this._getLocationAsync()
    .then(() => {
      this.fetchWeather(this.state.latitude, this.state.longitude)
    })
  }

  generateWeatherReport = () => {
    weatherReport = ''
    allWeather = []
    allTemp = []
    this.state.dataSource.map(i => {
      allWeather.push(i.weather[0].main.toLowerCase())
      allTemp.push(Math.round(i.main.temp))
    })
    if (allWeather[1] === allWeather[2] && allWeather[2] === allWeather[3] && allWeather[3] === allWeather[4]) {
      weatherReport += `It is ${weatherScript[allWeather[0]].current} and will continue to be for a while. ${weatherScript[allWeather[0]].advice}.`
    } else {
      if (allWeather[1].includes(allWeather[0])) {
        weatherReport += `It is mainly ${weatherScript[allWeather[0]].current}.,`
      } else {
        weatherReport += `It is ${weatherScript[allWeather[0]].current}, and ${allWeather[1].soon}.,`
      }
      if (allWeather[3].includes(allWeather[2])) {
        weatherReport += `It will also be mostly ${weatherScript[allWeather[2]].later}.`
      } else {
        weatherReport += `It will also be ${weatherScript[allWeather[2]]}, and ${allWeather[3]} later.`
      }
      weatherReport += `${weatherScript[allWeather[3]].advice}.,`
    }
    weatherReport += `The temperature is currently ${[allTemp[0]]} degrees and will later be around ${[allTemp[3]]} degrees.`
    return weatherReport
  }

  render() {
    let date = Date(Date.now().toString()).substring(0,16)
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    } else {
      const weatherSummary = this.generateWeatherReport()
      return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <Button
          style={styles.tellMeButton}
          onPress={() => _speak(weatherSummary)}
          title="Tell Me"
          color="#841584"
        />
        </View>
          <View style={styles.dateContainer}>
            <Text style={styles.heading}>{date}</Text>
          </View>
          <View style={styles.weatherContainer}>
             <Weather weatherData={ this.state.dataSource }/>
          </View>
        </View>
      )
    }
  }
}

_speak = (props) => {
  Speech.speak(`Good morning, this is your daily report: ${props}.`)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeBackground,
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Verdana',
  },
  dateContainer: {
    marginTop: 30,
    marginLeft: 20,
  },
  buttonContainer: {
    marginTop: 100,
  },
  tellMeButton: {
    color: 'pink',
  },
  weatherContainer: {
    marginTop: 30,
    flexDirection: 'row',
  }
});
