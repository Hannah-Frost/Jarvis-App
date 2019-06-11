import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        dataSource: null,
      }
  }

  componentDidMount() {
    return fetch('https://samples.openweathermap.org/data/2.5/forecast/hourly?id=524901&appid=b6907d289e10d714a6e88b30761fae22')
      .then ( (response) => response.json() )
      .then( (responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.list,
        })
      })
    .catch((error) => {
      console.log(error)
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    } else {
      let temp = this.state.dataSource.slice(0, 24).map(i => {
        if (i.dt_txt.includes("08:00") || i.dt_txt.includes("12:00") || i.dt_txt.includes("16:00") || i.dt_txt.includes("20:00")) {
          return (
            <View item={i} key={i.id} style={styles.container}>
              <Text>{i.dt_txt.substring(11,16)}</Text>
              <Text>{i.main.temp}</Text>
            </View>
          )
        }
      })
      return (
        <View style={styles.container}>
          {temp}
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Verdana',
    fontSize: 20,
  },
  item: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
