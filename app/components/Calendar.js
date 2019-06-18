import React, { Component } from "react";
import * as Expo from "expo";
import { StyleSheet, Text, View } from "react-native";

export default class CalendarPull extends Component {
  constructor() {
    super();
    this.getAllCalendarsAsync = this.getAllCalendarsAsync.bind(this);
    this.getCalendarEventsAsync = this.getCalendarEventsAsync.bind(this);
    this.state = {
      errorMessage: null,
      localCalendars: null,
      events: null
    };
  }

  getAllCalendarsAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access calendar was denied"
      });
    }
    let localCalendars = await Expo.Calendar.getCalendarsAsync("event");
    console.log(localCalendars.length);
    let calendarIDs = {
      id1: localCalendars[0].id,
      id2: localCalendars[1].id,
      id3: localCalendars[2].id,
      id4: localCalendars[3].id
    };
    this.setState({ localCalendars, calendarIDs });
    // console.log(this.state.localCalendars);
    // console.log(new Date("2019-07-14"));
  };

  getCalendarEventsAsync = async () => {
    let myEvents = await Expo.Calendar.getEventsAsync(
      [
        this.state.calendarIDs.id1,
        this.state.calendarIDs.id2,
        this.state.calendarIDs.id3,
        this.state.calendarIDs.id4
      ],
      new Date(),
      new Date("2019-11-01")
    );
    this.setState({ events: myEvents });
    console.log(this.state.myEvents);
  };

  componentDidMount() {
    this.getAllCalendarsAsync().then(() => {
      this.getCalendarEventsAsync();
    });
  }

  render() {
    return <Text>{this.state.events}</Text>;
  }
}
