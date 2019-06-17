import React, { Component } from "react";
import * as Expo from "expo";
import { StyleSheet, Text, View } from "react-native";

export default class CalendarPull extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      localCalendars: null
    };
  }
  getCalendarIDAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access calendar was denied"
      });
    }

    let localCalendars = await Expo.Calendar.getCalendarsAsync();

    this.setState({ localCalendars: localCalendars });
    console.log(this.state.localCalendars);
  };

  componentDidMount() {
    this.getCalendarIDAsync();
  }

  render() {
    console.log(this.state.localCalendars);
    return <Text>{JSON.stringify(this.state.localCalendars)}</Text>;
  }
}
