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
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { LinearGradient } from "expo";
import { Weather } from "../components/Weather";
import weatherScript from "../utils/WeatherScript";
import { APP_ID } from "react-native-dotenv";
import TravelTime from "../components/TravelTime.js";
import { journeyTime } from "../components/TravelTime.js";
import {AsyncStorage} from 'react-native';

export default class SettingsScreen extends React.Component {
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
          <View style={styles.formContainer}>
          <Text style={styles.settingsText}>Please enter Destination:</Text>
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
            <View style={styles.speedContainer}>
              <Text style={styles.settingsText}>Change the speech speed:</Text>
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
                  <Image style={styles.volumeIcon} source={require("../../assets/images/Volume.png")} />
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
