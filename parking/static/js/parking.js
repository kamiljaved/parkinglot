cleaned_reg = ""

$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});

$(document).ready(function () {

    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    $("#parkBtn").on("click", function () {

        cleaned_reg = ""

        removeErrors();

        let reg = $("#vehicleReg").val();
        let lot = "undefined"

        if ($("#slotsVIP").is(":visible")) {
            lot = $('#slotsVIP').find(":selected").data("id")
        }
        else if ($("#slotsStandard").is(":visible")) {
            lot = $('#slotsStandard').find(":selected").data("id")
        }

        let time_hrs = parseInt($('.input-number1').val());
        let time_mins = parseInt($('.input-number2').val());
        let hrs = time_hrs;
        let mins = time_mins;

        let time = time_hrs * 60 + time_mins

        data = {
            'reg': reg,
            'lot': lot,
            'time': time,
        }


        if (cleanData(reg, lot, time))
            sendData(cleaned_reg, lot, time, hrs, mins);

        data = {
            'reg': cleaned_reg,
            'lot': lot,
            'time': time,
        }
    });

})

var delete_list = [];

var deleting = false;
var loading = false;

function deleteNotif(notifid) {
    
    if (!delete_list.includes(notifid)) {
        delete_list.push(notifid);
        $(".delBtn[data-id='" + notifid + "']").prop("onclick", null).off("click");
        $(".delBtn[data-id='" + notifid + "']").addClass("disabled");

        var p = $(".delBtn[data-id='" + notifid + "']").parent();
        p.fadeOut("fast", function () {
            p.remove();
            $(".notifNum").html($(".notifWrap div").length)
            $("#cust[data-id='" + notifid + "']").remove();
        });
    }
    else {
        $(".delBtn[data-id='" + notifid + "']").prop("onclick", null).off("click");
        $(".delBtn[data-id='" + notifid + "']").addClass("disabled");
    }
}

function refreshData() {

    if (!deleting && !loading) {
        if (delete_list.length > 0) {

            deleting = true;

            pk_list = [...delete_list];
            delete_list = [];
            // ajax call
            $.ajax({
                url: "/notifications/delete/",
                type: 'post',
                dataType: 'json',
                data: {
                    'start': $('#id_startTime').val(),
                    'end': $('#id_endTime').val(),
                    'delete_list[]': pk_list,
                    'csrfmiddlewaretoken': $("#csrfmiddlewaretoken").val()
                },
                success: function (data) {
                    // slots update

                    deleting = false

                    let notif_count = data['notif_count'].toString();

                    let visVIP = $("#slotsVIP").is(":visible")
                    let visStd = $("#slotsStandard").is(":visible")

                    $('.slotSel').load(document.URL + ' .slotSel', function () {
                        if (visVIP)
                            $("#slotsStandard").hide();
                        else if (visStd)
                            $("#slotsVIP").hide();
                    });

                    loading = true;
                    // changed to edit loaded div and then put it in page
                    let $div = $('<div>');

                    $div.load(document.URL + ' #refresh', function () {

                        let notifDiv = $div.find("#notifDiv");
                        let parklist = $div.find("#parklist");

                        for (i = 0; i < delete_list.length; i++) {
                            notifDiv.find(" .notif[data-id='" + delete_list[i] + "']").remove();
                            parklist.find(" #cust[data-id='" + delete_list[i] + "']").remove();
                        }
                        notifDiv.find(".notifNum").html(notifDiv.find(".notifWrap div").length)

                        $("#notifDiv").html(notifDiv.html());
                        $("#parklist").html(parklist.html());

                        loading = false;
                    });
                },
                error: function (data) {
                    deleting = false
                }
            })
        }
    }
    if (!deleting && !loading) {

        loading = true;
        // changed to edit loaded div and then put it in page
        let $div = $('<div>');

        $div.load(document.URL + ' #refresh', function () {

            let notifDiv = $div.find("#notifDiv");
            let parklist = $div.find("#parklist");

            for (i = 0; i < delete_list.length; i++) {
                notifDiv.find(" .notif[data-id='" + delete_list[i] + "']").remove();
                parklist.find(" #cust[data-id='" + delete_list[i] + "']").remove();
            }
            notifDiv.find(".notifNum").html(notifDiv.find(".notifWrap div").length)

            $("#notifDiv").html(notifDiv.html());
            $("#parklist").html(parklist.html());

            loading = false;
        });
    }
}
setInterval(refreshData, 8000)

function cleanData(reg, lot, time) {
    let error = false;

    if (reg == "") { $(".error1").show(); error = true; }

    cleaned_reg = reg.replace(/\s\s+/g, ' ').replace(/ /g, "-").toUpperCase();


    if (cleaned_reg.replace(/-/g, "").length > 8) { $(".error3").show(); $("#vehicleReg").val($("#vehicleReg").val()); $("#vehicleReg").css("color", "red"); error = true; }

    if (cleaned_reg.split("-").length > 3) { $(".error5").show(); $("#vehicleReg").val($("#vehicleReg").val()); $("#vehicleReg").css("color", "red"); error = true; }

    if (lot == "" || lot == "undefined" || lot == "unchosen") { $(".error4").show(); $(".slotSel").addClass("animated"); $(".slotSel").addClass("wobble"); error = true; }

    if (error) return false;
    else return true;
}

function sendData(reg, lot, time, hrs, mins) {

    $.ajax({
        url: "/park/",
        type: 'post',
        dataType: 'json',
        data: {
            'start': $('#id_startTime').val(),
            'end': $('#id_endTime').val(),
            'reg': reg,
            'lot': lot,
            'time': time,
            'hrs': hrs,
            'mins': mins,
            'csrfmiddlewaretoken': $("#csrfmiddlewaretoken").val()
        },
        success: function (data) {

            if (data['error_vehicle_exists']) {

                $("#vehicleReg").val($("#vehicleReg").val());
                $("#vehicleReg").css("color", "red");
                $(".error2").show();
            }
            else {
                $("#vehicleReg").val('');

                $("#slotOpt[data-id='" + lot + "']").remove();

                loading = true;
                // changed to edit loaded div and then put it in page
                let $div = $('<div>');

                $div.load(document.URL + ' #refresh', function () {

                    let notifDiv = $div.find("#notifDiv");
                    let parklist = $div.find("#parklist");

                    for (i = 0; i < delete_list.length; i++) {
                        notifDiv.find(" .notif[data-id='" + delete_list[i] + "']").remove();
                        parklist.find(" #cust[data-id='" + delete_list[i] + "']").remove();
                    }
                    notifDiv.find(".notifNum").html(notifDiv.find(".notifWrap div").length)

                    $("#notifDiv").html(notifDiv.html());
                    $("#parklist").html(parklist.html());

                    loading = false;
                });
            }
        },
        error: function (data) {
        }
    })
}


function removeErrors() {
    $(".error1").hide();
    $(".error2").hide();
    $(".error3").hide();
    $(".error4").hide();
    $(".error5").hide();
    $(".slotSel").removeClass("animated"); $(".slotSel").removeClass("wobble");
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

