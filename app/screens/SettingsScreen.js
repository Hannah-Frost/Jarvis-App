import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Picker
} from "react-native";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo";
import { AsyncStorage } from "react-native";

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      destination: '',
      speechRate: '1.0',
    };
  }

  _storeSettings = () => {
    var name = '';
    var destination = '';
    var settings = [['speechRate', this.state.speechRate]];
    if (this.state.name !== '') {
      name = this.state.name;
      settings.push(['name', name]);
    }
    if (this.state.destination !== '') {
      destination = this.state.destination;
      settings.push(['destination', destination]);
    }
    AsyncStorage.multiSet(settings, () => {
      console.log(name);
    });
    this.props.navigation.navigate('Home');
  };

  onSubmitEdit = e => {
    let input = e.nativeEvent.text;
  };

  render() {
    return (
      <LinearGradient
        colors={["#2980B9", "#55a5d9", "#FFFFFF"]}
        style={styles.backgroundContainer}
      >
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.settingsText}>Name:</Text>
            <TextInput
              style={{ height: 30, borderColor: "gray", borderBottomWidth: 1, marginTop: 10, marginBottom: 10 }}
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
              onSubmitEditing={this.onSubmitEdit}
              autoCompleteType={"postal-code"}
              returnKeyType={"done"}
              clearTextOnFocus={true}
            />
            <Text style={styles.settingsText}>Destination:</Text>
            <TextInput
              style={{ height: 30, borderColor: "gray", borderBottomWidth: 1, marginTop: 10, marginBottom: 10 }}
              onChangeText={destination => this.setState({ destination })}
              value={this.state.destination}
              onSubmitEditing={this.onSubmitEdit}
              autoCompleteType={"postal-code"}
              returnKeyType={"done"}
              clearTextOnFocus={true}
            />
          </View>
          <View style={styles.speedContainer}>
            <Text style={styles.settingsText}>Speech speed:</Text>
            <View style={styles.speedPicker}>
              <Picker
                selectedValue={this.state.speechRate}
                style={{ height: 20, width: 130 }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ speechRate: itemValue })
                }
              >
                <Picker.Item label="0.8" value="0.8" />
                <Picker.Item label="0.9" value="0.9" />
                <Picker.Item label="1.0 (original)" value="1.0" />
                <Picker.Item label="1.1" value="1.1" />
                <Picker.Item label="1.2" value="1.2" />
              </Picker>
            </View>
            <View style={styles.speedSpeech}>
              <Button
                onPress={() =>
                  Speech.speak("Hello! How does this sound?", {
                    rate: this.state.speechRate
                  })
                }
                title="Test Speech"
                color="#0B3954"
              />
              <Image
                style={styles.volumeIcon}
                source={require("../../assets/images/Volume.png")}
              />
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.saveButton}>
              <Button
                onPress={() => this._storeSettings()}
                style={{ fontWeight: 'bold' }}
                title="Save Changes"
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  formContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    opacity: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 4
  },
  settingsText: {
    fontSize: 16,
    fontFamily: "Verdana",
    marginTop: 10,
  },
  speedContainer: {
    height: 250,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    opacity: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 4
  },
  speedData: {
    flexDirection: "row"
  },
  speedPicker: {
    marginTop: -5,
    marginLeft: 20
  },
  speedSpeech: {
    marginTop: 50,
    marginLeft: 140
  },
  volumeIcon: {
    height: 25,
    width: 25,
    marginLeft: 75
  },
  saveButton: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    opacity: 0.9,
    backgroundColor: "#2980B9",
    borderRadius: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
});
