// Action creator to set the time duration
export const setTimeDuration = (duration) => {

  return {
    type: 'SET_TIME_DURATION',
    payload: duration
  }
}

// Action creator to reset the time duration
export const resetTimeDuration = () => {
  return {
    type: 'RESET_TIME_DURATION'
  }
}
