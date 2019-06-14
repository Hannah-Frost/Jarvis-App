import React from 'react';
import weather from '../utils/WeatherScript';
import { weatherAPI } from '../utils/API';
import { StyleSheet, Text, View, ActivityIndicator, Image, Button } from 'react-native';
import { homeBackground } from '../utils/Colours';

export const Weather = (props) => {
  let temp = props.weatherData.map(i => {
    let imageName = i.weather[0].main.toLowerCase()
    let url = weather[imageName].url
    return (
      <View item={i} key={i.id} style={styles.container}>
        <Text>{Math.round(i.main.temp)}°C </Text>
        <Image style={styles.weatherIcon} source={url} />
        <Text>{i.dt_txt.substring(11,16)}</Text>
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
  item: {
    flex: 1,
    alignSelf: 'stretch',
  },
  tellMeButton: {
    flex: 1,
  },
  weatherContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weatherIcon: {
    height: 34,
    width: 34
  }
});
