exports.mapPollutionData = (data) => {
    return {
      Result: {
        Pollution: data.current.pollution
      }
    };
}