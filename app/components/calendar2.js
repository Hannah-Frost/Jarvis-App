// import React, { Component } from "react";
// import * as Expo from "expo";
// import { StyleSheet, Text, View } from "react-native";
//
// export default class Location extends Component {
//   state = {
//     location: null
//   };
//
//   renderCalendarsAsync = async () => {
//     let { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);
//     if (status !== "granted") {
//       console.log("DENIED");
//       return;
//     }
//     let calendar = await Expo.Calendar.getCalendarsAsync();
//     // let max = await Expo.Location.geocodeAsync("n7 0dp");
//     // console.log(max);
//     this.setState({ calendar });
//     // console.log(this.state.calendar);
//   };
//
//   componentDidMount() {
//     this.renderCalendarsAsync();
//   }
//
//   render() {
//     return <Text>{JSON.stringify(this.state.calendar)}</Text>;
//   }
// }
