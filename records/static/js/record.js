$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});


$(document).ready(function () {

    $(".recordlist").fadeIn(500);

})




function deleteRecord() 
{
    // remove previous events
    $(".genPDF").prop("onclick", null).off("click");
    $(".detREC").prop("onclick", null).off("click");
    $(".delREC").prop("onclick", null).off("click");
    $('.recOpts').addClass('disabled');

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

                alert("Record Deleted");

                // redirect to /records/
                window.location.replace(back_url);

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

