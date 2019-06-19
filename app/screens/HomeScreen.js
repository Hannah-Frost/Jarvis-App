import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Button
} from "react-native";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { LinearGradient } from "expo";
import { Weather } from "../components/Weather";
import weatherScript from "../utils/WeatherScript";
import TravelTime from "../components/TravelTime.js";
import { journeyTime } from "../components/TravelTime.js";
import {AsyncStorage} from 'react-native';
import { APP_ID } from "react-native-dotenv";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this._getLocationAsync = this._getLocationAsync.bind(this)
    this.fetchWeather = this.fetchWeather.bind(this)
    this.storeTravelTime = this.storeTravelTime.bind(this);
    this.state = {
      isLoading: true,
      isLoadingSettings: true,
      dataSource: null,
      weatherReport: null,
      latitude: null,
      longitude: null,
      speechRate: 1.0,
      destination: '',
      name: 'x',
    };
  }

  _getSettings = async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        var array = []
        stores.map((result, i, store) => {
          let key = store[i][0];
          let value = store[i][1];
          array.push(value)
        });
        this.setState({ name: array[0] })
        this.setState({ destination: array[1] })
        this.setState({ speechRate: array[2] })
      }).then(() => {
        this.setState({ isLoadingSettings: false })
      });
    });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("DENIED");
    }
    let location = await Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    this.setState({ latitude, longitude });
  };

  fetchWeather(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${APP_ID}`
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.list.slice(0, 4)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  storeTravelTime(travelTime) {
    this.setState({
      travelTime
    });
  }

  componentDidMount() {
    this._getSettings().then(() => {
      this._getLocationAsync().then(() => {
        this.fetchWeather(this.state.latitude, this.state.longitude);
      });
    })
  }

  generateWeatherReport = () => {
    weatherReport = "";
    allWeather = [];
    allTemp = [];
    this.state.dataSource.map(i => {
      allWeather.push(i.weather[0].main.toLowerCase());
      allTemp.push(Math.round(i.main.temp));
    });
    uniqWeather = new Set(allWeather);
    if (uniqWeather.length === 1) {
      weatherReport += `It is ${
        weatherScript[allWeather[0]].current
      } and will continue to be for a while. ${
        weatherScript[allWeather[0]].advice
      }.`;
    } else {
      if (allWeather[1].includes(allWeather[0])) {
        weatherReport += `It is mainly ${
          weatherScript[allWeather[0]].current
        }.,`;
      } else {
        weatherReport += `It is ${weatherScript[allWeather[0]].current}, and ${
          weatherScript[allWeather[1]].soon
        }.,`;
      }
      if (allWeather[3].includes(allWeather[2])) {
        weatherReport += `It will also be mostly ${
          weatherScript[allWeather[2]].later
        }.`;
      } else {
        weatherReport += `It will also be ${allWeather[2]
        }, and ${allWeather[3]} later.`;
      }
      weatherReport += `${weatherScript[allWeather[3]].advice}.,`;
    }
    weatherReport += `The temperature is currently ${[
      allTemp[0]
    ]} degrees and will later be around ${[allTemp[3]]} degrees.,`;
    weatherReport += `Today it will take you ${
      this.state.travelTime
    } minutes to get to work.,`;
    return weatherReport;
  };

  render() {
    let date = Date(Date.now().toString()).substring(0, 16);
    if (this.state.isLoadingSettings) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      const weatherSummary = this.generateWeatherReport();
      return (
        <LinearGradient
          colors={["#2980B9", "#6DD5FA", "#FFFFFF"]}
          style={styles.backgroundContainer}
        >
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => _speak(weatherSummary, this.state.name, this.state.speechRate)}
                title="Tell Me"
                color="#0B3954"
              />
              <Button
                onPress={() => this.props.navigation.navigate('Settings')}
                title="Settings"
              />
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.weatherContainer}>
              <Weather weatherData={this.state.dataSource} />
            </View>
            <View style={styles.dateContainer}>
              <TravelTime
                navigation={this.props.navigation}
                storeTravelTime={this.storeTravelTime}
              />
            </View>
          </View>
        </LinearGradient>
      );
    }
  }
}

_speak = (props, name, rate) => {
  Speech.speak(`Good morning ${name}, this is your daily report: ${props}.`, { rate: rate })
};


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  dateText: {
    fontSize: 18,
    fontFamily: "Verdana",
  },
  dateContainer: {
    marginTop: 30,
    marginLeft: 20,
  },
  buttonContainer: {
    marginTop: 50,
    backgroundColor: "#ffffff",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
  },
  weatherContainer: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  formContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    opacity: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  settingsText: {
    fontSize: 18,
    fontFamily: "Verdana",
    marginTop: 10,
    marginLeft: 20,
  },
  speedContainer: {
    height: 250,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    opacity: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  speedData: {
    flexDirection: "row",
  },
  speedPicker: {
    marginTop: -5,
    marginLeft: 20,
  },
  speedSpeech: {
    marginTop: 50,
    marginLeft: 160,
  },
  volumeIcon: {
    height: 25,
    width: 25,
    marginLeft: 75,
  },
  saveButton: {
    marginTop: 200,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    opacity: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  }
});
