
$(document).ready(function () {
    $("#checkVIP").hide();
    $("#slotsVIP").hide();

    $(".parkform").fadeIn(500);   
    $(".parklist").fadeIn(500);        

    $("#btnStandard").on('click', function(e){
        $("#checkVIP").hide(); $("#slotsVIP").hide(); 
        $("#checkStandard").show(); $("#slotsStandard").show();
    })
    $("#btnVIP").on('click', function(e){
        $("#checkStandard").hide(); $("#slotsStandard").hide();
        $("#checkVIP").show(); $("#slotsVIP").show();
    })

});

$(".txtbf input").on("focus", function () {
    $(this).addClass("focus");
});

$(".txtbf input").on("focus", function () {
    $(this).css("color", "");
});

$(".txtbf input").on("blur", function () {
    if ($(this).val() == "")
        $(this).removeClass("focus");
});
