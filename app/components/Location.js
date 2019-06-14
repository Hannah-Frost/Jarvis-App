import React, { Component } from "react";
import * as Expo from "expo";
import { StyleSheet, Text, View } from "react-native";

export default class Location extends Component {
  state = {
    location: null,
    latitude: null,
    longitude: null,
  };

  _getLocationAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
    if (status !== "granted") {
      console.log("DENIED");
    }
    let location = await Expo.Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude
    const longitude = location.coords.longitude

    this.setState({ location, latitude, longitude });
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  render() {
    return (
      <Text>{this.state.latitude},{this.state.longitude}</Text>
    )
  }
}
