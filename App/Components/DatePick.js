import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

export default class DatePick extends Component {
  constructor(props){
    super(props)
    this.state = {date:''}
  }

  handleDateChange = (date) => {
    this.setState({date});
    date = date.slice(0, -5);
    this.props.onDateChange(date);
  }

  render(){
    return (
      <DatePicker
        style={{width: 300}}
        date={this.state.date}
        mode="date"
        placeholder="Birthday"
        format="MM-DD-YYYY"
        minDate="05-01-1900"
        maxDate={new Date()}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        customStyles={{
          dateInput: {
            alignItems: 'center',
            borderWidth: 0
          },
          dateText: {
              color: 'white',
              fontSize: 22
          },
          placeholderText: {
              fontSize: 22,
              color: 'grey'
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.handleDateChange(date)}}
      />
    )
  }
}