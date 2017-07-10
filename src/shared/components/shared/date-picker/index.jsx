import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import styles from './styles.less';

const minute = new Array(4).fill(0).map((value, index) => {
  if (index === 0) {
    return '00';
  }
  return (index * 15).toString();
});
const hour = new Array(12).fill(0).map((value, index) => {
  return (index + 1).toString();
});
const styleSheet = `
            .left-selector {
              cursor: pointer;
              float: left;
              font-size: 12px;
              padding: 0 10px;
            }

            .selector:hover {
              color: #9ad2ff;
            }

            .calendar-date {
              font-size: 14px;
              outline: none;
            }

            .right-selector {
              cursor: pointer;
              float: right;
              font-size: 12px;
              padding: 0 10px;
            }

            .calendar-popup {
              -webkit-box-shadow: 0px 6px 15px -2px rgba(0,0,0,0.75);
              -moz-box-shadow: 0px 6px 15px -2px rgba(0,0,0,0.75);
              box-shadow: 0px 6px 15px -2px rgba(0,0,0,0.75);
              width: 200px;
              z-index: 10;
            }

            table {
              font-size: 13px;
              line-height: 20px;
              padding: 4px;
              text-align: center;
              width: 100%;
            }

            td:hover {
              box-shadow: 0 0 5px 1px rgba(154, 210, 255, 0.75);
              cursor: pointer;
            }

            .time-error {
              color: #D46A4A;
              font-size: 11px;
            }

            .picker-container {
              display: inline-flex;
              width: 50%;
            }

            .select {
              background: white;
              background-image: url(/images/down-arrow.svg);
              background-position-x: 90%;
              background-position-y: 55%;
              background-repeat: no-repeat;
              background-size: 10px;
              flex: 1;
              height: 32px;
              margin: 5px;
              text-indent: 8px;
              -webkit-appearance: none;
            }
          `;

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    const date = this.props.date ? this.props.date : Moment();

    this.state = ({
      date: date.format('MM/DD/YYYY'),
      tooltipLeft: null,
      tooltipTop: null,
      showTooltipStartDate: false,
      showTooltipEndDate: false,
      activeDate: Moment().format('MM/DD/YYYY'),
      startDate: Moment().format('MM/DD/YYYY'),
      start: {
        actualDate: Moment(),
        actualTime: Moment().format('6:00 a'),
        date: Moment().format('MM/DD/YYYY'),
        label: 'Start date',
        time: Moment().format('6:00 a'),
        validTime: true,
        validDate: true,
      },
      endDate: Moment().format('MM/DD/YYYY'),
      endHour: 7,
      startHour: 6,
      endMinute: '00',
      startMinute: '00',
      startKind: 'PM',
      endKind: 'PM',
      invalidTime: false
    });

    this.onDateChange = this._onDateChange.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
    this.onFocusStart = this._onFocusStart.bind(this);
    this.onFocusEnd = this._onFocusEnd.bind(this);
    this.closeTooltips = this._closeTooltips.bind(this);
    this.forwardMonth = this._forwardMonth.bind(this);
    this.backMonth = this._backMonth.bind(this);
    this.selectDate = this._selectDate.bind(this);

    this.windowResize = this._windowResize.bind(this);
  }

  componentDidMount() {
    this.windowResize();
    window.onresize = this.debounceResize.bind(this, this.windowResize);
    document.body.onclick = this.closeTooltips;
  }

  debounceResize(callback) {
    if (this.resizeCallbackTimeout !== 0) {
      return;
    }

    this.resizeCallbackTimeout = window.setTimeout(callback, 300);
  }

  _windowResize() {
    const parentNode = ReactDOM.findDOMNode(this.refs.parent);
    this.resizeCallbackTimeout = 0;
    this.setState({
      parentWidth: parentNode.offsetWidth
    });
  }

  _selectDate(event) {
    const day = event.target.innerHTML;
    let startHour = this.state.startHour;
    let endHour = this.state.endHour;
    let startMinute = this.state.startMinute;
    let endMinute = this.state.endMinute;
    let startKind = this.state.startKind;
    let endKind = this.state.endKind;
    const classes = event.target.classList;

    if (classes.contains('start-hour-picker')) {
      startHour = event.target.value;
    } else if (classes.contains('end-hour-picker')) {
      endHour = event.target.value;
    } else if (classes.contains('start-minute-picker')) {
      startMinute = event.target.value;
    } else if (classes.contains('end-minute-picker')) {
      endMinute = event.target.value;
    } else if (classes.contains('start-kind-picker')) {
      startKind = event.target.value;
    } else if (classes.contains('end-kind-picker')) {
      endKind = event.target.value;
    }

    const startTime = `${startHour}:${startMinute} ${startKind}`;
    const endTime = `${endHour}:${endMinute} ${endKind}`;

    const endDate = Moment(`${this.state.endDate} ${endTime}`);
    const startDate = Moment(`${this.state.startDate} ${startTime}`);
    let isValid = false;

    if (this.state.showTooltipEndDate) {
      endDate.date(day);
    } else if (this.state.showTooltipStartDate) {
      startDate.date(day);
    }

    if (endDate.isBefore(startDate)) {
      this.setState({
        invalidTime: true,
        errorMessage: 'The times you have selected are invalid.'
      });
    } else if (startDate.isBefore(Moment())) {
      this.setState({
        invalidTime: true,
        errorMessage: 'The time you have selected has already passed.'
      });
    } else {
      isValid = true
      this.setState({
        invalidTime: false
      });
    }

    this.props.onChange({
      endDate: endDate.format('MM/DD/YYYY HH:mm A'),
      startDate: startDate.format('MM/DD/YYYY HH:mm A'),
      isValid: isValid
    });

    this.setState({
      endDate: endDate.format('MM/DD/YYYY'),
      startDate: startDate.format('MM/DD/YYYY'),
      endHour: endHour,
      startHour: startHour,
      endMinute: endMinute,
      startMinute: startMinute,
      endKind: endKind,
      startKind: startKind,
      showTooltipStartDate: false,
      showTooltipEndDate: false,
    });
  }

  _backMonth() {
    const activeDate = Moment(this.state.activeDate !== '' ? this.state.activeDate : Moment().format('MM/DD/YYYY'));
    activeDate.subtract(1, 'months');
    this.setState({
      activeDate: activeDate.toString(),
      startDate: this.state.showTooltipStartDate ? activeDate.toString() : this.state.startDate,
      endDate: this.state.showTooltipEndDate ? activeDate.toString() : this.state.endDate
    });
  }

  _forwardMonth() {
    const activeDate = Moment(this.state.activeDate !== '' ? this.state.activeDate : Moment().format('MM/DD/YYYY'));
    activeDate.add(1, 'months');
    this.setState({
      activeDate: activeDate.toString(),
      startDate: this.state.showTooltipStartDate ? activeDate.format('MM/DD/YYYY') : this.state.startDate,
      endDate: this.state.showTooltipEndDate ? activeDate.format('MM/DD/YYYY') : this.state.endDate
    });
  }

  _closeTooltips(event) {
    if (event.target.classList.contains('selector') || event.target.classList.contains('day') || event.target.classList.contains('calendar-popup') || event.target.classList.contains('calendar-date')) {
      return;
    }
    this.setState({
      showTooltipStartDate: false,
      showTooltipEndDate: false
    });
  }

  _onKeyDown(event) {
    if (event.keyCode === 47 || event.keyCode === 92 || event.keyCode === 45 || event.keyCode === 189 || event.keyCode === 191 || event.keyCode === 220) {
      event.preventDefault();
    }
  }

  _onFocusStart(event) {
    this.props.onFocus();
    this.setState({
      activeDate: this.state.startDate,
      tooltipTop: event.target.offsetTop + 30,
      showTooltipStartDate: true
    });
    return;
  }

  _onFocusEnd(event) {
    this.setState({
      activeDate: this.state.endDate,
      tooltipTop: event.target.offsetTop + 30,
      showTooltipEndDate: true
    });
    return;
  }

  _onDateChange(event) {
    let value = event.target.value;
    let date = Moment();
    const prevValue = this.state.activeDate;

    if (event.target.classList.contains('start')) {
      this.setState({
        startDate: value,
        activeDate: date.format('MM/DD/YYYY')
      });
    } else {
      this.setState({
        endDate: value,
        activeDate: date.format('MM/DD/YYYY')
      });
    }
  }

  validateTime = (value) => {
    let time = value.toLowerCase();
    const split = (time.indexOf('am') + 1 || time.indexOf('pm') + 1) -1;
    time = time.substring(0, split);

    if (split === -1) {
      this.setState({
        start: {
          ...this.state.start,
          validTime: false,
          label: 'Invalid start time',
        }
      });

      return;
    }

    if (time.indexOf(':') === -1) {
      this.setState({
        start: {
          ...this.state.start,
          validTime: parseInt(time) < 12,
          label: parseInt(time) < 12 ? 'Start date' : 'Invalid start time',
        },
      });

      return;
    }

    if (time.substring(0, split).split(':').filter(x => parseInt(x) < 12 && parseInt(x) > 0).length === 2) {
      this.setState({
        start: {
          ...this.state.start,
          validTime: true,
          label: 'Invalid start time',
        },
      });
    }
  }

  onStartTimeChange = (event) => this.setState({ start: { ...this.state.start, time: event.target.value } });
  onBlurStartTime = (event) => {
    let time = event.target.value.toLowerCase();
    const split = (time.indexOf('am') + 1 || time.indexOf('pm') + 1) -1;
    time = time.substring(0, split);

    if (split === -1) {
      this.setState({
        start: {
          ...this.state.start,
          validTime: false,
          label: 'Invalid start time',
        }
      });

      return;
    }

    if (time.indexOf(':') === -1) {
      this.setState({
        start: {
          ...this.state.start,
          validTime: parseInt(time) < 12,
          label: parseInt(time) < 12 ? 'Start date' : 'Invalid start time',
        },
      });

      return;
    }

    if (time.substring(0, split).split(':').filter(x => parseInt(x) < 12 && parseInt(x) > 0).length === 2) {
      this.setState({
        start: {
          ...this.state.start,
          validTime: true,
          label: 'Invalid start time',
        },
      });
    }
  }

  onStartDateChange = (event) => this.setState({ start: { ...this.state.start, date: event.target.value }});
  onBlurStartDate = (event) => {
    const date = event.target.value;
    if (date.indexOf('/') !== -1) {
      const dateColumns = date.split('/');
      if (dateColumns.filter(x => isNaN(parseInt(x))).length !== 0 || dateColumns.length !== 3) {
        this.setState({
          start: {
            ...this.state.start,
            validDate: false,
            label: 'Invalid start date',
          },
        });

        return;
      }

      const dates = dateColumns.map(x => parseInt(x));
      if (dates[0] > 12 || dates[0] < 0 || !this.validDay(dates[0], dates[1], dates[2]) || dateColumns[2].length !== 4) {
        this.setState({
          start: {
            ...this.state.start,
            validDate: false,
            label: 'Invalid start date',
          },
        });

        return;
      }

      this.setState({
        start: {
          ...this.state.start,
          validDate: true,
          label: 'Start date',
        }
      });

      return;
    }

    if (!Moment(date.replace('th', '').replace('st', '')).isValid()) {
      this.setState({
        start: {
          ...this.state.start,
          validDate: false,
          label: 'Invalid start date',
        },
      });
    }

    this.setState({
      start: {
        ...this.state.start,
        actualDate: date.replace('th', '').replace('st', ''),
        validDate: true,
        label: 'Start date',
      }
    });
  }

  validDay = (month, day, year) => {
    if (month % 2 === 1) {
      return day <= 31 && day > 0;
    }

    if (month === 2) {
      if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        return day <= 29 && day > 0;
      }

      return day <= 28 && day > 0;
    }

    return day <= 30 && day > 0;
  }

  renderTimeError(error) {
    return (
      <div className="time-error">{error}</div>
    );
  }

  renderMonth() {
    const date = Moment(this.state.activeDate !== '' ? this.state.activeDate : Moment().format('MM/DD/YYYY'));
    date.date(1);
    const month = date.month();
    const weekday = date.day();
    date.subtract(weekday, 'days');
    const rowNum = (weekday > 4 && Moment(this.state.activeDate).daysInMonth() === 31) || (weekday === 6 && Moment(this.state.activeDate).daysInMonth() === 30) ? 6 : 5;


    const rows = new Array(rowNum).fill(0).map((zero, index) => {
      return (
        <tr key={`${index}week`} className="calendar-week">
          {new Array(7).fill(0).map((fill, weekday) => {
            const day = date.date();
            if (day > weekday && index === 0) {
              date.add(1, 'days');
              return (
                <td className="day" key={day} onClick={this.backMonth} style={{color: '#ccc'}}>
                  {day}
                </td>
              );
            }

            if (date.month() > month) {
              date.add(1, 'days');
              return (
                <td className="day" key={day} onClick={this.forwardMonth} style={{color: '#ccc'}}>
                  {day}
                </td>
              );
            }

            date.add(1, 'days');
            return (
                <td className="day" key={day} onClick={this.selectDate}>
                  {day}
                </td>
            );
          })}
        </tr>
      );
    });

    date.subtract(1, 'month');
    return(
      <table>
          <tbody>
            <tr>
              <th colSpan="7">
                <span className="left-selector selector" onClick={this.backMonth}>{'<'}</span>
                <span>{`${date.format('MMMM')} ${date.format('YYYY')}`}</span>
                <span className="right-selector selector" onClick={this.forwardMonth}>{'>'}</span>
              </th>
            </tr>
            <tr>
              <th>S</th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>TH</th>
              <th>F</th>
              <th>S</th>
            </tr>
            {rows}
          </tbody>
      </table>
    );
  }

  renderCalendarPopup() {
    return (
      <div className="calendar-popup" style={{background: 'white', position: 'absolute', top: `${this.state.tooltipTop}px`, left: `${this.state.tooltipLeft}px`, padding: '4px', textAlign: 'center'}}>
        {this.renderMonth()}
      </div>
    );
  }

  render() {
    return (
      <div className="calendar-date-picker-container" ref="parent" onClick={this.closeTooltips} >
        {this.state.invalidTime ? this.renderTimeError('Invalid date') : null}
        <div className={`${styles.inputLabel} ${!this.state.start.validDate || !this.state.start.validTime ? styles.error : ''} ${this.state.showTooltipStartDate || this.state.start.date !== '' ? styles.activeLabel : ''}`}>{this.state.start.label}</div>
        <input
          className={`calendar-date start ${this.props.className} ${styles.date}`}
          value={this.state.start.date}
          onBlur={this.onBlurStartDate}
          onChange={this.onStartDateChange}
          onFocus={this.onFocusStart}
          ref="startDate"
        />
        <input
          className={`${styles.startTime} start ${styles.date}`}
          value={this.state.start.time}
          onBlur={this.onBlurStartTime}
          onChange={this.onStartTimeChange}
          onKeyDown={this.onKeyDown}
        />
        {this.state.showTooltipStartDate ? this.renderCalendarPopup() : null}
        <div className={`${styles.inputLabel} ${this.state.showTooltipEndDate || this.state.endDate !== '' ? styles.activeLabel : ''}`}>End Date</div>
        <input
          className={`calendar-date ${this.props.className}`}
          value={this.state.endDate}
          onChange={this.onDateChange}
          onFocus={this.onFocusEnd}
          onKeyDown={this.onKeyDown}
          ref="startDate"
        />
        {this.state.showTooltipEndDate ? this.renderCalendarPopup() : null}
        <style>
          {styleSheet}
        </style>
      </div>
    );
  }
}