cleaned_reg = ""

$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});

$(document).ready(function () {

    console.log("ready func")
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

                loading_parkings = true;
                $('.parklist').load(document.URL + ' .parklist', function () {
                    loading_parkings = false;
                })

                setTimeout(function () {
                    loading_notifications = true;                                      
                    let $div = $('<div>');
                    $div.load(document.URL + ' #notifDiv', function () {
                        for(i=0; i<delete_list.length; i++)
                            console.log($div.find(".notif[data-id='"+delete_list[i]+"']"))
                            $div = $div.find(".notif[data-id='"+delete_list[i]+"']").remove();
                        loading_notifications = false;
                        $(" #notifDiv").html($div.html());
                    });
                }, 1500);
            }
        },
        error: function (data) {
        }
    })
}

function deleteNotification(notifid) {

    $.ajax({
        url: "/notifications/" + notifid + "/delete/",
        type: 'post',
        dataType: 'json',
        data: {
            'start': $('#id_startTime').val(),
            'end': $('#id_endTime').val(),
            'csrfmiddlewaretoken': $("#csrfmiddlewaretoken").val()
        },
        success: function (data) {
            // slots update

            deleting = false

            let notif_count = data['notif_count'].toString();

            $("#notifCount").html("(" + notif_count + ")")

            let visVIP = $("#slotsVIP").is(":visible")
            let visStd = $("#slotsStandard").is(":visible")

            $('.slotSel').load(document.URL + ' .slotSel', function () {
                if (visVIP)
                    $("#slotsStandard").hide();
                else if (visStd)
                    $("#slotsVIP").hide();
            });

            // parking lot update
            $('.parklist').load(document.URL + ' .parklist');
        },
        error: function (data) {
            deleting = false
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

