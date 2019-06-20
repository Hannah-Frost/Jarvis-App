const weatherScript = {
  clouds: {
    url: require("../../assets/images/Clouds.png"),
    current: "cloudy right now",
    soon: "will soon be cloudy",
    later: "cloudy later",
    advice: "So don't forget your jacket!",
  },
  rain: {
    url: require("../../assets/images/Rain.png"),
    current: "raining right now",
    soon: "will soon be raining",
    later: "raining later",
    advice: "So don't forget your umbrella!",
  },
  snow: {
    url: require("../../assets/images/Snow.png"),
    current: "snowing right now",
    soon: "will soon be snowing",
    later: "snowing later",
    advice: "So don't forget a warm coat!",
  },
  clear: {
    url: require("../../assets/images/Clear.png"),
    current: "sunny right now",
    soon: "will soon be sunny",
    later: "sunny later",
    advice: "So dress lightly!",
  },
}

export default weatherScript;
