$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});


$(document).ready(function () {

    $(".recordlist").fadeIn(500);

    $(".backBtn").on("click", function () { location.href = "/"; });

    $("#email").focus()
    $("#email").val(default_email)

    $(".defEmail").on("click", function () {
        $("#email").focus()
        $("#email").val(default_email)
    })

    $(".sendEmail").on("click", function () {
        
        removeErrors();

        let email = $("#email").val();
        let recid = $('#records').find(":selected").data('id');

        if (recid === "unchosen" || recid === "") {
            // show error
            $(".error1").show();
            // shake record box
            $(".recordSel").addClass("animated"); $(".recordSel").addClass("wobble");
        }
        else {
            $(".sendEmail").addClass("disabled");
            sendEmail(recid, email);
        }

    })


})

function hideLoader() {
    $(".pdfLoader").html("");
}

function showLoader() {
    $(".pdfLoader").append("<div class='loader-1 center'><span></span></div>");
}

function removeErrors() {

    // remove following errors:

    // please select a record
    // email is invalid 

    $(".error1").hide();
    $(".error2").hide();
    $(".recordSel").removeClass("animated"); $(".recordSel").removeClass("wobble");

}


function sendEmail(recid, email) {

    // show loader
    showLoader();

    $.ajax({
        url: "/records/email/send/",
        type: 'post',
        dataType: 'json',
        data: {
            'start': $('#id_startTime').val(),
            'end': $('#id_endTime').val(),
            'recid': recid,
            'email': email,
            'csrfmiddlewaretoken': $("#csrfmiddlewaretoken").val()
        },
        success: function (data) {
            
            hideLoader();

            if (data['email_invalid']) {

                $("#email").val($("#email").val());
                $("#email").css("color", "red");
                $(".error2").show();
            }
            else {
                
                // replace with modals
                if (data['email_sent']) alert("Email Sent Successfully.");
                else alert("Error Sending Email!");
            }
            $(".sendEmail").removeClass("disabled");
        },
        error: function (data) {

            hideLoader();

            alert("Error Sending Email!");
            $(".sendEmail").removeClass("disabled");

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