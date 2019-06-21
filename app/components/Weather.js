import React from 'react';
import weather from '../utils/WeatherScript';
import { StyleSheet, Text, View, Image } from 'react-native';

export const Weather = (props) => {
  let temp = props.weatherData.map(i => {
    let imageName = i.weather[0].main.toLowerCase()
    let url = weather[imageName].url
    return (
      <View item={i} key={i.id} style={styles.container}>
        <Text style={{ color: "#FFFFFF" }}>{Math.round(i.main.temp)}°C </Text>
        <Image style={styles.weatherIcon} source={url} />
        <Text style={{ color: "#FFFFFF" }}>{i.dt_txt.substring(11,16)}</Text>
      </View>
    )
  })
  return temp
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Verdana',
    fontSize: 20,
  },
  weatherIcon: {
    height: 34,
    width: 34
  }
});
