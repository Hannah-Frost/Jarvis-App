import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Button } from 'react-native';
import * as Speech from 'expo-speech';
import { Weather } from './app/components/Weather';
import weather from './app/utils/WeatherConfig';
import { weatherAPI } from './app/utils/API';
import { homeBackground } from './app/utils/Colours';


export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        dataSource: null,
        weatherReport: null,
      }
  }

  componentDidMount() {
    return fetch(weatherAPI)
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

  generateWeatherReport = () => {
    weatherReport = ''
    this.state.dataSource.map(i => {
        let imageName = i.weather[0].main.toLowerCase()
        weatherReport += `At ${i.dt_txt.substring(11,16)} it ${weather[imageName].advice}.`
    })
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
  Speech.speak(`Good morning, this is your daily report: ${props}. You might want to pack an umbrella`)
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
