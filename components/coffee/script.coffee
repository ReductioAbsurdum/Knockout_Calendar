class eventElement
  constructor: (date, formattedDate, color) ->
    @date = date
    @color = color
    @formattedDate = "#{formattedDate}: #{color}"

class calendarViewModel
  constructor: ->
    @date = ko.observable(new Date()) #selectedDay
    @months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    @days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    @monthTableData = ko.observableArray()
    @eventList = ko.observableArray()

    ###-------------------------------
      COMPUTABLES:
        -CALENDAR DATA BUILD
    -------------------------------###

    @calendarData = ko.computed =>
      @monthTableData.removeAll()
      theMonth = @date()
      daysInCurrentMonth = new Date(theMonth.getFullYear(), theMonth.getMonth() + 1, 0).getDate()
      daysInPreviousMonth = new Date(theMonth.getFullYear(), theMonth.getMonth(), 0).getDate()
      @monthTableData().push([])
      prependDays = new Date(theMonth.getFullYear(), theMonth.getMonth(), 1).getDay()
      array = []
      if prependDays > 0
        prependDataNum = prependDays
        i = prependDataNum
        j = daysInPreviousMonth
        while i >= 1
          array.push(new Date(theMonth.getFullYear(), theMonth.getMonth() - 1, j - (i - 1)))
          i--
      i = 1
      j = daysInCurrentMonth
      count = 0
      while i <= j
        if array.length == 7
          @monthTableData.push(array)
          array = []
          count++
        array.push(new Date(theMonth.getFullYear(), theMonth.getMonth(), i))
        i++
      if array.length == 7
        @monthTableData.push(array)
        array = []
      appendDays = new Date(theMonth.getFullYear(), theMonth.getMonth() + 1, 1).getDay()
      if appendDays > 0
        i = 1
        j = 7 - appendDays
        while i <= j
          array.push(new Date(theMonth.getFullYear(), theMonth.getMonth() + 1, i))
          i++
        if array.length > 0
          @monthTableData.push(array)

      #compare eventList with days
      return

    ###-------------------------------
      PURECOMPUTABLES:
        -CALENDAR HEADER
        -FORMATTEDDAY
    -------------------------------###
    @presentMonthYear = ko.pureComputed =>
      "#{@months[@date().getMonth()]} #{@date().getFullYear()}"

    @formattedDay = ko.pureComputed =>
      @formatSelectedDay(@date())

    ###-------------------------------
      BUTTONS & CLICK EVENTS:
    -------------------------------###
    @buttonRight = () ->
      @date(new Date(@date().getFullYear(), @date().getMonth() + 1))
      return

    @buttonLeft = () ->
      @date(new Date(@date().getFullYear(), @date().getMonth() - 1))
      return

    @newSelectedDayUpdate = (day) =>
      @date(day)
      return

    @submitDayFunction = (day) =>
      submitDate = new Date(day.year.value, day.month.value - 1, day.day.value)
      @date(submitDate)
      return

    @submitEventFunction = (event) =>
      if event.eventDay.value == ""
        return
      cutYear = event.eventDay.value.slice(0, 4)
      cutMonth = event.eventDay.value.slice(5, 7) - 1
      cutDay = event.eventDay.value.slice(8)
      @eventList.push(new eventElement(new Date(cutYear, cutMonth, cutDay), event.eventDay.value, event.color.value))
      return

    ###-------------------------------
      VARIOUS FUNCTIONS:
    -------------------------------###

    @compareDaytoDate = (day) =>
      day.getDate() == @date().getDate() && day.getMonth() == @date().getMonth()

    @isEvent = (day) =>
      if @eventList() == undefined
        return

      returnString = ""
      i = 0
      while i < @eventList().length
        if day.getTime() == @eventList()[i].date.getTime()
          returnString += "<span style=\"color:#{@eventList()[i].color}\">";
          returnString += "&bull;";
          returnString += "</span>";
        i++
      return returnString;

    @formatSelectedDay = (day) ->
      selectedDayBuild = "#{@months[day.getMonth()]} #{day.getDate()}, #{day.getFullYear()}"

ko.applyBindings(new calendarViewModel)
