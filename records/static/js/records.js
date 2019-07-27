$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});

$(document).ready(function () {

    $(".recordlist").fadeIn(500);

    $(".backBtn").on("click", function () { location.href = "/"; });

    $(".table tr").click(function () {

        // remove previous events
        $(".pdfREC").prop("onclick", null).off("click");
        $(".detREC").prop("onclick", null).off("click");
        $(".delREC").prop("onclick", null).off("click");

        if ($(this).attr('id') === "todaysRecRow") {
            let r = $('#prevRecBody').find(".selected");
            r.removeClass('selected');
            r.removeClass('table-active');

            $(this).toggleClass('selected');
            $(this).toggleClass('table-active');

        }
        else {
            $("#todaysRecRow").removeClass('selected');
            $("#todaysRecRow").removeClass('table-active');

            $(this).toggleClass('selected').siblings().removeClass('selected');
            $(this).toggleClass('table-active').siblings().removeClass('table-active');

        }

        if ($(this).hasClass('selected')) {
            $('.recOpts').removeClass('disabled')
            buttons($(this).data('id'))
        }
        else {
            $(".recOpts").css("pointer-events", "none")
            $('.recOpts').addClass('disabled');
        }
    });

});

function hideLoader() {
    $(".pdfLoader").html("");
}

function showLoaderTemp() {
    $(".pdfLoader").append("<div class='loader-1 center'><span></span></div>");
    setTimeout(hideLoader, 7000)
}

function buttons(recid) {
    $(".recOpts").css("pointer-events", "all")
    $(".pdfRECv").on("click", function () { location.href = "/records/" + recid + "/pdf/"; showLoaderTemp(); });
    $(".pdfRECd").on("click", function () { location.href = "/records/" + recid + "/pdf/download/"; showLoaderTemp(); });
    $(".detREC").on("click", function () { location.href = "/records/" + recid + "/"; });
    $(".delREC").on("click", function () { deleteRecord(recid) });
}

function generatePDF(recid) {
    $.ajax({
        url: "/records/pdf/",
        type: 'post',
        dataType: 'json',
        data: {
            'start': $('#id_startTime').val(),
            'end': $('#id_endTime').val(),
            'recid': recid,
            'csrfmiddlewaretoken': $("#csrfmiddlewaretoken").val()
        },
        success: function (data) {
        },
        error: function (data) {
        }
    })
}

function deleteRecord(recid) 
{
    // remove previous events
    $(".pdfRECv").prop("onclick", null).off("click");
    $(".pdfRECd").prop("onclick", null).off("click");
    $(".detREC").prop("onclick", null).off("click");
    $(".delREC").prop("onclick", null).off("click");
    $('.recOpts').addClass('disabled');
    $(".recOpts").css("pointer-events", "none")


    $.ajax({
        url: "/records/delete/",
        type: 'post',
        dataType: 'json',
        data: {
            'start': $('#id_startTime').val(),
            'end': $('#id_endTime').val(),
            'recid': recid,
            'csrfmiddlewaretoken': $("#csrfmiddlewaretoken").val()
        },
        success: function (data) {
            if (data['deleted']) {
                $("tr[data-id='" + recid + "']").remove()
                alert("Record Deleted");
            }
            else {
                alert("Error Deleting Record");
            }
        },
        error: function (data) {
        }
    })
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
