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
<<<<<<< HEAD
      events: null,
      eventDetails: {}
=======
      events: null
>>>>>>> add calendar component, pulls all calendars and assigns ids
    };
  }

  getAllCalendarsAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access calendar was denied"
      });
    }
<<<<<<< HEAD
<<<<<<< HEAD
    let localCalendars = await Expo.Calendar.getCalendarsAsync();
    let calIDs = [];
    localCalendars.map(calendar => {
      calIDs.push(calendar.id);
    });

    this.setState({ localCalendars, calIDs });
  };
=======

    let localCalendars = await Expo.Calendar.getCalendarsAsync();
>>>>>>> calendar api working

  getCalendarEventsAsync = async () => {
    let today = new Date();
    let events = await Expo.Calendar.getEventsAsync(
      this.state.calIDs,
      new Date(),
      new Date(today.getTime() + 24 * 60 * 60 * 1000)
    );
    var eventDetails = {
      eventTitle: events[0].title,
      eventStartTime: events[0].startDate.replace(
        /^[^:]*([01]\d:[01]\d).*$/,
        "$1"
      ),
      eventEndTime: events[0].endDate.replace(/^[^:]*([01]\d:[01]\d).*$/, "$1"),
      eventLocation: events[0].location
    };
    this.setState({ events, eventDetails }, () => {
      this.props.storeEventDetails(eventDetails);
    });
=======
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
>>>>>>> add calendar component, pulls all calendars and assigns ids
  };

  componentDidMount() {
    this.getAllCalendarsAsync().then(() => {
      this.getCalendarEventsAsync();
    });
  }

  render() {
<<<<<<< HEAD
    if (this.state.eventDetails.eventTitle != null) {
      return (
        <View>
          <Text>
            Today's first appointment: {this.state.eventDetails.eventTitle}
          </Text>
          <Text>Location: {this.state.eventDetails.eventLocation}</Text>
          <Text>Starts: {this.state.eventDetails.eventStartTime}</Text>
          <Text>Ends: {this.state.eventDetails.eventEndTime}</Text>
        </View>
      );
    } else
      return (
        <View>
          <Text>No appointments today</Text>
        </View>
      );
=======
    return <Text>{this.state.events}</Text>;
>>>>>>> add calendar component, pulls all calendars and assigns ids
  }
}
