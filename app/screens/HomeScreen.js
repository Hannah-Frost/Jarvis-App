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
import { AsyncStorage } from "react-native";
import TravelTime from "../components/TravelTime.js";
import CalendarPull from "../components/Calendar.js";
import { APP_ID } from "react-native-dotenv";
import weatherScript from "../utils/WeatherScript";
import { journeyTime } from "../components/TravelTime.js";
import { gradient } from '../utils/Colours';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this._getLocationAsync = this._getLocationAsync.bind(this);
    this.fetchWeather = this.fetchWeather.bind(this);
    this.storeTravelTime = this.storeTravelTime.bind(this);
    this.storeEventDetails = this.storeEventDetails.bind(this);
    this.state = {
      isLoading: true,
      isLoadingSettings: true,
      dataSource: null,
      weatherReport: null,
      latitude: null,
      longitude: null,
      speechRate: 1.0,
      destination: '',
      name: '',
    };
  }

  _getSettings = async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        var array = [];
        stores.map((result, i, store) => {
          let key = store[i][0];
          let value = store[i][1];
          array.push(value);
        });
        this.setState({ name: array[0] });
        this.setState({ destination: array[1] });
        this.setState({ speechRate: array[2] });
      }).then(() => {
        this.setState({ isLoadingSettings: false });
      });
    });
  };

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

  storeEventDetails(eventDetails) {
    this.setState({
      eventDetails
    });
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
        weatherReport += `It will also be ${allWeather[2]}, and ${
          allWeather[3]
        } later.`;
      }
      weatherReport += `${weatherScript[allWeather[3]].advice}.,`;
    }
    weatherReport += `The temperature is currently ${[
      allTemp[0]
    ]} degrees and will later be around ${[allTemp[3]]} degrees.,`;
    if (this.state.travelTime !== undefined) {
      weatherReport += `Today it will take you ${
        this.state.travelTime
      } minutes to get to work.,`;
    }
    if (this.state.eventDetails != null) {
      weatherReport += `Your next appointment is entitled ${this.state
        .eventDetails && this.state.eventDetails.eventTitle},`;
      weatherReport += `The location is ${this.state.eventDetails &&
        this.state.eventDetails.eventLocation},`;
      weatherReport += `It starts at ${this.state.eventDetails &&
        this.state.eventDetails.eventStartTime}, and finishes at
     ${this.state.eventDetails && this.state.eventDetails.eventEndTime}`;
    } else {
      weatherReport += `You have no appointments in your calendar`;
    }
    return weatherReport;
  };

  componentDidMount() {
    this._getSettings().then(() => {
      this._getLocationAsync().then(() => {
        this.fetchWeather(this.state.latitude, this.state.longitude);
      });
    });
  }

  render() {
    let date = Date(Date.now().toString()).substring(0, 16);
    if (this.state.isLoadingSettings) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      const weatherSummary = this.generateWeatherReport();
      return (
        <LinearGradient
          colors={gradient}
          style={styles.backgroundContainer}
        >
          <View style={styles.container}>
            <View style={styles.dateContainer}>
              <Text style={styles.welcomeText}>Welcome {this.state.name}</Text>
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.weatherContainer}>
              <Weather weatherData={this.state.dataSource} />
            </View>
            <View style={styles.formContainer}>
              <TravelTime
                navigation={this.props.navigation}
                storeTravelTime={this.storeTravelTime}
              />
            </View>
            <View style={styles.formContainer}>
              <CalendarPull storeEventDetails={this.storeEventDetails} />
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.speechContainer}>
                <Button
                  onPress={() =>
                    _speak(weatherSummary, this.state.name, this.state.speechRate)
                  }
                  title="Tell Me"
                  color="#FFFFFF"
                />
                <Button
                  style={{ borderColor: "gray", borderWidth: 5 }}
                  onPress={() => Speech.stop()}
                  title="Stop"
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.settingsContainer}>
                <Button
                  onPress={() => this.props.navigation.navigate('Settings')}
                  title="Settings"
                  color="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      );
    }
  }
}

_speak = (props, name, rate) => {
  Speech.speak(`Good morning ${name}, this is your daily report: ${props}.`, {
    rate: rate
  });
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: "Verdana",
    color: "#FFFFFF",
    paddingBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontFamily: "Verdana",
    color: "#FFFFFF"
  },
  dateContainer: {
    marginTop: 30,
    marginLeft: 20
  },
  speechContainer: {
    marginTop: 20,
    backgroundColor: "#2980B9",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  settingsContainer: {
    marginTop: 10,
    backgroundColor: "#2980B9",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4
  },
  weatherContainer: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingBottom: 20,
    paddingBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    borderColor: "#FFFFFF",
    borderBottomWidth: 1,
  },
  formContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    borderColor: "#FFFFFF",
    borderBottomWidth: 1,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  }
});
