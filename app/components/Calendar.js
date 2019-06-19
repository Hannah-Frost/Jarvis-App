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
      events: null,
      eventDetails: {}
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
    let calendarIDs = {
      id1: localCalendars[0].id,
      id2: localCalendars[1].id,
      id3: localCalendars[2].id,
      id4: localCalendars[3].id
    };
    this.setState({ localCalendars, calendarIDs });
  };

  getCalendarEventsAsync = async () => {
    let events = await Expo.Calendar.getEventsAsync(
      [
        this.state.calendarIDs.id1,
        this.state.calendarIDs.id2,
        this.state.calendarIDs.id3,
        this.state.calendarIDs.id4
      ],
      new Date("2019-06-18"),
      new Date("2019-06-19")
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
  };

  componentDidMount() {
    this.getAllCalendarsAsync().then(() => {
      this.getCalendarEventsAsync();
    });
  }

  render() {
    var eventDetails = this.state.eventDetails;
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
  }
}
