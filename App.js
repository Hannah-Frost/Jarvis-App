import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Button,
  TextInput,
  Picker
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
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

class HomeScreen extends React.Component {
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
      postcode: "",
      speechRate: 1.0,
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
                onPress={() => _speak(weatherSummary, this.state.speechRate)}
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

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speechRate: 1.0,
    };
  }

  getSpeechRate = (number) => {
      this.setState({ speechRate: number })
   }

   _saveSettings = () => {
     // send speech rate to homescreen class
   }

  render() {
    return (
      <LinearGradient
       colors={['#2980B9', '#6DD5FA', '#FFFFFF']}
       style={styles.backgroundContainer}
       >
          <View style={styles.container}>
            <View style={styles.speedContainer}>
              <Text style={styles.speedText}>Change the speech speed:</Text>
                <View style={styles.speedPicker}>
                  <Picker
                    selectedValue={this.state.speechRate}
                    style={{height: 20, width: 130}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({speechRate: itemValue})
                    }>
                    <Picker.Item label="0.8" value="0.8" />
                    <Picker.Item label="0.9" value="0.9" />
                    <Picker.Item label="1.0 (original)" value="1.0" />
                    <Picker.Item label="1.1" value="1.1" />
                    <Picker.Item label="1.2" value="1.2" />
                  </Picker>
                </View>
                <View style={styles.speedSpeech}>
                  <Button
                    onPress={() => Speech.speak("Hello! How does this sound?", { rate: this.state.speechRate })}
                    title="Test Speech"
                    color="#0B3954"
                  />
                  <Image style={styles.volumeIcon} source={require("./assets/images/Volume.png")} />
                </View>
            </View>
            <View style={styles.saveButton}>
              <Button
                onPress={() => this._saveSettings}
                onPress={() => this.props.navigation.navigate('Home')}
                title="Save Changes"
                color="#0B3954"
              />
            </View>
         </View>
       </LinearGradient>
     )
   }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
};

_speak = (props, rate) => {
  Speech.speak(`Good morning, this is your daily report: ${props}.`, { rate: rate })
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
  speedText: {
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
