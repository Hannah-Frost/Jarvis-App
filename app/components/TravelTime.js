import React, { Component } from "react";
import * as Expo from "expo";
import { StyleSheet, Text, View, Button, AsyncStorage } from "react-native";

export default class TravelTime extends Component {
  constructor() {
    super();
    this.getLocationAsync = this.getLocationAsync.bind(this);
    this.getDestinationAsync = this.getDestinationAsync.bind(this);
    this.getTravelTimeAsync = this.getTravelTimeAsync.bind(this);
    this.state = {
      currentLocation: null,
      destination: null,
      errorMessage: null,
      dataSource: null,
      postcode: '',
    };
  }

  _getPostcode = async () => {
    var postcode = await AsyncStorage.getItem('destination')
    console.log(postcode)
    this.setState({ postcode })
  }

  getLocationAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let currentLocation = await Expo.Location.getCurrentPositionAsync({});

    let currentCoords = {
      lat: currentLocation.coords.latitude,
      long: currentLocation.coords.longitude
    };
    this.setState({ currentLocation, currentCoords });
  };

  getDestinationAsync = async () => {
    console.log(this.state.postcode);
    let destination = await Expo.Location.geocodeAsync(this.state.postcode);

    let destinationCoords = {
      lat: destination[0].latitude,
      long: destination[0].longitude
    };
    this.setState({ destination, destinationCoords });
  };

  getTravelTimeAsync(currentLat, currentLong, destLat, destLong) {
    // let travelTime = await fetch ('https://developer.citymapper.com/api/1/traveltime/?startcoord=+51.558079%2C-0.120810&endcoord=51.558823%2C-0.121487&time=2014-11-06T19%3A00%3A02-0500&time_type=arrival&key=e2567df81c88213608d82487879b3f96')
    // fetch (`https://developer.citymapper.com/api/1/traveltime/?startcoord=51.51727169201791%2C-0.07331195425420282&endcoord=51.5583838%2C-0.123121&time=2014-11-06T19%3A00%3A02-0500&time_type=arrival&key=e2567df81c88213608d82487879b3f96`)
    fetch(
      `https://developer.citymapper.com/api/1/traveltime/?startcoord=${currentLat}%2C${currentLong}&endcoord=${destLat}%2C${destLong}&time=2014-11-06T19%3A00%3A02-0500&time_type=arrival&key=e2567df81c88213608d82487879b3f96`
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            dataSource: responseJson.travel_time_minutes
          },
          () => {
            this.props.storeTravelTime(responseJson.travel_time_minutes);
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateDestination = () => {
    this.getDestinationAsync().then(() => {
      this.getLocationAsync().then(() => {
        this.getTravelTimeAsync(
          this.state.currentCoords.lat,
          this.state.currentCoords.long,
          this.state.destinationCoords.lat,
          this.state.destinationCoords.long
        );
      });
    });
  };

  componentDidMount() {
    this._getPostcode()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.postcode !== this.state.postcode) {
      this.updateDestination();
    }
  }

  render() {
    var journeyTime = this.state.dataSource;
    if (this.state.postcode != "" && journeyTime != null) {
      return (
        <Text>
          Today's commute: {journeyTime} minutes to {this.state.postcode}
        </Text>
      );
    } else {
      return (
      <Button
        onPress={() => this.props.navigation.navigate('Settings')}
        title="Update your Travel destination"
      />
    )
    }
  }
}
