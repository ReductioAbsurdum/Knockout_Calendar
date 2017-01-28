var calendarViewModel, eventElement;

eventElement = (function() {
  function eventElement(date, formattedDate, color) {
    this.date = date;
    this.color = color;
    this.formattedDate = formattedDate + ": " + color;
  }

  return eventElement;

})();

calendarViewModel = (function() {
  function calendarViewModel() {
    this.date = ko.observable(new Date());
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    this.monthTableData = ko.observableArray();
    this.eventList = ko.observableArray();

    /*-------------------------------
      COMPUTABLES:
        -CALENDAR DATA BUILD
    -------------------------------
     */
    this.calendarData = ko.computed((function(_this) {
      return function() {
        var appendDays, array, count, daysInCurrentMonth, daysInPreviousMonth, i, j, prependDataNum, prependDays, theMonth;
        _this.monthTableData.removeAll();
        theMonth = _this.date();
        daysInCurrentMonth = new Date(theMonth.getFullYear(), theMonth.getMonth() + 1, 0).getDate();
        daysInPreviousMonth = new Date(theMonth.getFullYear(), theMonth.getMonth(), 0).getDate();
        _this.monthTableData().push([]);
        prependDays = new Date(theMonth.getFullYear(), theMonth.getMonth(), 1).getDay();
        array = [];
        if (prependDays > 0) {
          prependDataNum = prependDays;
          i = prependDataNum;
          j = daysInPreviousMonth;
          while (i >= 1) {
            array.push(new Date(theMonth.getFullYear(), theMonth.getMonth() - 1, j - (i - 1)));
            i--;
          }
        }
        i = 1;
        j = daysInCurrentMonth;
        count = 0;
        while (i <= j) {
          if (array.length === 7) {
            _this.monthTableData.push(array);
            array = [];
            count++;
          }
          array.push(new Date(theMonth.getFullYear(), theMonth.getMonth(), i));
          i++;
        }
        if (array.length === 7) {
          _this.monthTableData.push(array);
          array = [];
        }
        appendDays = new Date(theMonth.getFullYear(), theMonth.getMonth() + 1, 1).getDay();
        if (appendDays > 0) {
          i = 1;
          j = 7 - appendDays;
          while (i <= j) {
            array.push(new Date(theMonth.getFullYear(), theMonth.getMonth() + 1, i));
            i++;
          }
          if (array.length > 0) {
            _this.monthTableData.push(array);
          }
        }
      };
    })(this));

    /*-------------------------------
      PURECOMPUTABLES:
        -CALENDAR HEADER
        -FORMATTEDDAY
    -------------------------------
     */
    this.presentMonthYear = ko.pureComputed((function(_this) {
      return function() {
        return _this.months[_this.date().getMonth()] + " " + (_this.date().getFullYear());
      };
    })(this));
    this.formattedDay = ko.pureComputed((function(_this) {
      return function() {
        return _this.formatSelectedDay(_this.date());
      };
    })(this));

    /*-------------------------------
      BUTTONS & CLICK EVENTS:
    -------------------------------
     */
    this.buttonRight = function() {
      this.date(new Date(this.date().getFullYear(), this.date().getMonth() + 1));
    };
    this.buttonLeft = function() {
      this.date(new Date(this.date().getFullYear(), this.date().getMonth() - 1));
    };
    this.newSelectedDayUpdate = (function(_this) {
      return function(day) {
        _this.date(day);
      };
    })(this);
    this.submitDayFunction = (function(_this) {
      return function(day) {
        var submitDate;
        submitDate = new Date(day.year.value, day.month.value - 1, day.day.value);
        _this.date(submitDate);
      };
    })(this);
    this.submitEventFunction = (function(_this) {
      return function(event) {
        var cutDay, cutMonth, cutYear;
        if (event.eventDay.value === "") {
          return;
        }
        cutYear = event.eventDay.value.slice(0, 4);
        cutMonth = event.eventDay.value.slice(5, 7) - 1;
        cutDay = event.eventDay.value.slice(8);
        _this.eventList.push(new eventElement(new Date(cutYear, cutMonth, cutDay), event.eventDay.value, event.color.value));
      };
    })(this);

    /*-------------------------------
      VARIOUS FUNCTIONS:
    -------------------------------
     */
    this.compareDaytoDate = (function(_this) {
      return function(day) {
        return day.getDate() === _this.date().getDate() && day.getMonth() === _this.date().getMonth();
      };
    })(this);
    this.isEvent = (function(_this) {
      return function(day) {
        var i, returnString;
        if (_this.eventList() === void 0) {
          return;
        }
        returnString = "";
        i = 0;
        while (i < _this.eventList().length) {
          if (day.getTime() === _this.eventList()[i].date.getTime()) {
            returnString += "<span style=\"color:" + (_this.eventList()[i].color) + "\">";
            returnString += "&bull;";
            returnString += "</span>";
          }
          i++;
        }
        return returnString;
      };
    })(this);
    this.formatSelectedDay = function(day) {
      var selectedDayBuild;
      return selectedDayBuild = this.months[day.getMonth()] + " " + (day.getDate()) + ", " + (day.getFullYear());
    };
  }

  return calendarViewModel;

})();

ko.applyBindings(new calendarViewModel);
