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
    let localCalendars = await Expo.Calendar.getCalendarsAsync();
    let calIDs = [];
    localCalendars.map(calendar => {
      calIDs.push(calendar.id);
    });

    this.setState({ localCalendars, calIDs });
  };

  getCalendarEventsAsync = async () => {
    let today = new Date();
    let events = await Expo.Calendar.getEventsAsync(
      this.state.calIDs,
      new Date(),
      new Date(today.getTime() + 24 * 60 * 60 * 1000)
    );

    function ConvertNumberToTwoDigitString(n) {
      return n > 9 ? "" + n : "0" + n;
    }
    let start = new Date(events[0].startDate);
    let end = new Date(events[0].endDate);
    var eventDetails = {
      eventTitle: events[0].title,
      eventStartTime: `${ConvertNumberToTwoDigitString(
        start.getUTCHours()
      )}:${ConvertNumberToTwoDigitString(start.getUTCMinutes())}`,
      eventEndTime: `${ConvertNumberToTwoDigitString(
        end.getUTCHours()
      )}:${ConvertNumberToTwoDigitString(end.getUTCMinutes())}`,
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
    if (this.state.eventDetails.eventTitle != null) {
      return (
        <View style={{ fontColor: '#FFFFFF' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            Today's first appointment:
          </Text>
          <Text style={{ color: '#FFFFFF', paddingTop: 4 }}>{this.state.eventDetails.eventTitle}</Text>
          <Text style={{ color: '#FFFFFF' }}>Location: {this.state.eventDetails.eventLocation}</Text>
          <Text style={{ color: '#FFFFFF' }}>Starts: {this.state.eventDetails.eventStartTime}</Text>
          <Text style={{ color: '#FFFFFF' }}>Ends: {this.state.eventDetails.eventEndTime}</Text>
        </View>
      );
    } else
      return (
        <View>
          <Text style={{ color: '#FFFFFF' }}>No appointments today.</Text>
        </View>
      );
  }
}
