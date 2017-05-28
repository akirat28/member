/**
 * 予約管理
 * 書式
 * https://shimz.me/blog/jquery/1265
 * https://gist.github.com/wata0218/5707433
 * kavascript
 * http://sterfield.co.jp/designer/fullcalendar%E3%81%AE%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%92%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%E3%81%A7%E7%B5%9E%E3%82%8A%E8%BE%BC%E3%82%80%E6%96%B9%E6%B3%95/
 */

//カレンダーID
var div_calendar = '#calendar';


$(function () {

    /**
     * 予約受付中ー＞予約受付停止　のとき
     * 優先受付を停止する
     */
    $("#accept").on('change',function(){
        if ($("#accept").prop("checked")) {
            $("#accept_priority").prop("checked",true);
            $("#accept_priority").trigger('change');//"checked",true);
            $("#accept_priority").attr('disabled','disabled');
        }else{
            $("#accept_priority").removeAttr('disabled');
        }
        return true;
    });

    $("#accept_priority").attr('disabled','disabled');

    $("#accept_priority").on('change',function(){
        if (($("#accept").prop("checked"))) return false;
        return true;
    });

    //*カレンダー表示 /reserves/web/calendar
    $(".fc-button").on('click',function() {
        var diff = 0;
        if($(this).hasClass('fc-prev-button')) diff = -1;
        if($(this).hasClass('fc-next-button')) diff = 0;
        var selectDate = $(div_calendar).fullCalendar('getDate');
        var res = callAjax({navi:diff,selectDate:selectDate},'/reserves/web/calendar');
        // TODO カレンダーに予約状況を表示する
        // TODO 現在より過去１ヵ月取得する
        setFullCalender(
            getReservation(res)
        );
    });

    //指定の日付に移動する
    //$('#calendar').fullCalendar('gotoDate', '2014-10-01');

    //空き設定     /reserves/web/availability           repairshop_availabilities
    //保存         /reserves/web/availability/save

    //*WEB予約履歴  /reserves/web                       members/reservations
    $(".fc-prev-button, .fc-next-button, .fc-today-button").on('click',function() {

    });


    //予約編集   /reserves/web/reserve/edit
    //保存       /reserves/web/reserve/save
    //メモ       /reserves/web/memo/edit
    //保存       /reserves/web/memo/save


    /* initialize the external events
     -----------------------------------------------------------------*/
    function ini_events(ele) {
        ele.each(function () {

            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });

        });
    }

    ini_events($('#external-events div.external-event'));

    /* initialize the calendar
     -----------------------------------------------------------------*/
    //Date for the calendar events (dummy data)
    var date = new Date();
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();
    $(div_calendar).fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        //defaultDate: '2017-06-12',
        buttonText: {
            today: '今日',
            month: '月',
            week: '週',
            day: '日'
        },
        //Random default events
        lang: 'ja',
        locale: 'ja',
        height: 440,//がレンダーの高さ
        timeFormat: 'H:mm',
        // columnFormat: {
            // month: 'ddd',
            //week: "d'('ddd')'",
            // day: "d'('ddd')'"
        // },
        aspectRatio: 1.5,
        axisFormat: 'H:mm',
        // スロットの分
        slotMinutes: 30,
        buttonIcons: false, // show the prev/next text
        //weekNumbers: true,
        // 終日スロットを表示
        allDaySlot: false,
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        //日付選択時に
        dayClick: function (date,allDay) {
            //alert(date);
            upDay('ddd'+d,new Date(y,m,d,0,0,0),false);
        },

        events: [
        ],
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            copiedEventObject.backgroundColor = $(this).css("background-color");
            copiedEventObject.borderColor = $(this).css("border-color");

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $(div_calendar).fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        }
    });

    // when the selected option changes, dynamically change the calendar option
    //$('#calendar').fullCalendar('option', 'locale', 'ja');

    //イベントを追加
    updateDay();

    /* ADDING EVENTS */
    var currColor = "#3c8dbc"; //Red by default
    //Color chooser button
    var colorChooser = $("#color-chooser-btn");
    $("#color-chooser > li > a").click(function (e) {
        e.preventDefault();
        //Save color
        currColor = $(this).css("color");
        //Add color effect to button
        $('#add-new-event').css({"background-color": currColor, "border-color": currColor});
    });
    $("#add-new-event").click(function (e) {
        e.preventDefault();
        //Get value and make sure it is not null
        var val = $("#new-event").val();
        if (val.length == 0) {
            return;
        }

        //Create events
        var event = $("<div />");
        event.css({"background-color": currColor, "border-color": currColor, "color": "#fff"}).addClass("external-event");
        event.html(val);
        $('#external-events').prepend(event);

        //Add draggable funtionality
        ini_events(event);

        //Remove event from text input
        $("#new-event").val("");
    });
/*
    var FC = $.fullCalendar; // a reference to FullCalendar's root namespace
    var View = FC.View;      // the class that all views must inherit from
    var CustomView;          // our subclass
    CustomView = View.extend({ // make a subclass of View

        initialize: function() {
            // called once when the view is instantiated, when the user switches to the view.
            // initialize member variables or do other setup tasks.
        },

        render: function() {
            // responsible for displaying the skeleton of the view within the already-defined
            // this.el, a jQuery element.
        },

        setHeight: function(height, isAuto) {
            // responsible for adjusting the pixel-height of the view. if isAuto is true, the
            // view may be its natural height, and `height` becomes merely a suggestion.
        },

        renderEvents: function(events) {
            // reponsible for rendering the given Event Objects
        },

        destroyEvents: function() {
            // responsible for undoing everything in renderEvents
        },

        renderSelection: function(range) {
            // accepts a {start,end} object made of Moments, and must render the selection
        },

        destroySelection: function() {
            // responsible for undoing everything in renderSelection
        }

    });

    FC.views.custom = CustomView; // register our class with the view system
*/
    //$('#calendar').fullCalendar('next'); //月をめくる
});


/**
 * イベントを追加
 */
function updateDay() {
    //追加
    setDay('yahoo',new Date(2017,4,11,11,0,0),new Date(2017,4,11,14,30,0),false);
    //削除
    // upDay('yahoo',new Date(2017,4,11,11,1,0),false);
    // setDay('aaa',new Date(2017,4,11,11,1,0),true);
    // setDay('vvv',new Date(2017,4,12,12,2,0),false);
    // setDay('ccc',new Date(2017,4,13,13,3,0),false);
    // setDay('ddd',new Date(2017,4,14,14,4,0),false);
}

/**
 * 1日のイベントを設定
 *
 * @param titles
 * @param at_date
 * @param allDay
 */
function addDay(titles,at_date,allDay) {
    $(dev_calendar).fullCalendar('addEventSource', [{
        id: at_date ,//      (date それぞれのボックスが持つ日付。）
        title: ""+titles,
        start: at_date, //　（日付）
        allDay: allDay
    }]);
}

function upDay(titles,at_date_start,allDay) {
    // var originalEventObject = $(div_calendar).data('eventObject');
    // var copiedEventObject = $.extend({}, originalEventObject);
    // if(titles && titles!=""){
    //     copiedEventObject.id = at_date;
    //     copiedEventObject.title = ""+titles;
    //     copiedEventObject.start = at_date_start;
    //     copiedEventObject.allDay = allDay;
    //     copiedEventObject.backgroundColor = "#f56954"; //$('#calendar').css("background-color");
    //     copiedEventObject.borderColor = "#f56954"; //$('#calendar').css("border-color");
    //     //イベント（予定）の修正
    //     $(div_calendar).fullCalendar('updateEvent', copiedEventObject);
    // }else{
    //     //イベント（予定）の削除  idを指定して削除。
        $(div_calendar).fullCalendar("removeEvents", at_date_start);
    // }
}

/**
 * 1日のイベントを設定
 *
 * @param titles
 * @param at_date_start
 * @param at_date_end
 * @param allDay
 */
function setDay(titles,at_date_start,at_date_end,allDay) {
    // retrieve the dropped element's stored Event Object
    var originalEventObject = $(div_calendar).data('eventObject');

    // we need to copy it, so that multiple events don't have a reference to the same object
    var copiedEventObject = $.extend({}, originalEventObject);

    // assign it the date that was reported
    copiedEventObject.id = at_date_start;
    copiedEventObject.title = ""+titles;
    copiedEventObject.start = at_date_start;
    copiedEventObject.end = at_date_end;
    copiedEventObject.allDay = allDay;
    copiedEventObject.backgroundColor = "#f56954"; //$('#calendar').css("background-color");
    copiedEventObject.borderColor = "#f56954"; //$('#calendar').css("border-color");
    copiedEventObject.color = "#ffffff"; //$('#calendar').css("border-color");

    // render the event on the calendar
    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
    $(div_calendar).fullCalendar('renderEvent', copiedEventObject, true);
}


// TODO 現在より過去１ヵ月取得する
function getReservation(){
    return [];
}

// TODO カレンダーに予約状況を表示する
function setFullCalender(){

}
