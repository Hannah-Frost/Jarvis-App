import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Button,
  TextInput
} from "react-native";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { LinearGradient } from "expo";
import { Weather } from "./app/components/Weather";
import weatherScript from "./app/utils/WeatherScript";
import { APP_ID } from "react-native-dotenv";
import { homeBackground } from "./app/utils/Colours";
import TravelTime from "./app/components/TravelTime.js";
import { journeyTime } from "./app/components/TravelTime.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.storeTravelTime = this.storeTravelTime.bind(this);
    this.state = {
      isLoading: true,
      dataSource: null,
      weatherReport: null,
      latitude: null,
      longitude: null,
      text: "Enter Postcode",
      postcode: ""
    };
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
    this._getLocationAsync().then(() => {
      this.fetchWeather(this.state.latitude, this.state.longitude);
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
        weatherReport += `It will also be ${
          weatherScript[allWeather[2]]
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

  onSubmitEdit = e => {
    let input = e.nativeEvent.text;
    this.setState({ postcode: input });
  };

  render() {
    let date = Date(Date.now().toString()).substring(0, 16);
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
          colors={["#2980B9", "#6DD5FA", "#FFFFFF"]}
          style={styles.backgroundContainer}
        >
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.tellMeButton}
                onPress={() => _speak(weatherSummary)}
                title="Tell Me"
                color="#0B3954"
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
                postcode={this.state.postcode}
                storeTravelTime={this.storeTravelTime}
              />
            </View>

            <View>
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
                onSubmitEditing={this.onSubmitEdit}
                autoCompleteType={"postal-code"}
                returnKeyType={"done"}
                clearTextOnFocus={true}
              />
            </View>
          </View>
        </LinearGradient>
      );
    }
  }
}

_speak = props => {
  Speech.speak(`Good morning, this is your daily report: ${props}.`);
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  dateText: {
    fontSize: 18,
    fontFamily: "Verdana"
  },
  dateContainer: {
    marginTop: 30,
    marginLeft: 20
  },
  buttonContainer: {
    marginTop: 50,
    backgroundColor: "#ffffff",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4
  },
  weatherContainer: {
    marginTop: 30,
    flexDirection: "row",
    backgroundColor: "transparent"
  }
});
