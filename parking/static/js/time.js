
$('.btn-number1').click(function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());


    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number1').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number1').change(function() {
    
    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    name = $(this).attr('name');

    var inputMins = $("input[name='"+$('.btn-number2').attr('data-field')+"']");
    var currentValMins = parseInt(inputMins.val());

    if(valueCurrent >= minValue) {
        $(".btn-number1[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Minimum value for Hours: 0');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number1[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        $(this).val(12);
    }
    
    if(valueCurrent == 0)
    {
        $(".btn-number2[data-type='plus'][data-field='quant[2]']").removeAttr('disabled');
        $(".btn-number1[data-type='minus'][data-field='"+name+"']").attr("disabled", "disabled");
        if (currentValMins <= 0)
        {
            $(".btn-number2[data-type='minus'][data-field='quant[2]']").attr("disabled", "disabled");
        }
    }
    else
    {
        $(".btn-number2[data-type='minus'][data-field='quant[2]']").removeAttr("disabled");
    }
    
    if (valueCurrent == 12)
    {
        $(".btn-number2[data-type='minus'][data-field='quant[2]']").removeAttr('disabled');
        $(".btn-number1[data-type='plus'][data-field='"+name+"']").attr("disabled", "disabled");
        if (currentValMins >= 55)
        {
            inputMins.val(55).change();
            $(".btn-number2[data-type='plus'][data-field='quant[2]']").attr("disabled", "disabled");
        }
    }
    else
    {
        $(".btn-number2[data-type='plus'][data-field='quant[2]']").removeAttr("disabled");
    }
});
$(".input-number1").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });




    $('.btn-number2').click(function(e){
        e.preventDefault();
        
        fieldName = $(this).attr('data-field');
        type      = $(this).attr('data-type');
        var input = $("input[name='"+fieldName+"']");
        var currentVal = parseInt(input.val());

        var inputHrs = $("input[name='"+$('.btn-number1').attr('data-field')+"']");
        var currentValHrs = parseInt(inputHrs.val());

        if (!isNaN(currentVal)) {
            if(type == 'minus') 
            {
                newVal = currentVal%5
                if (newVal == 0)
                {
                    newVal = currentVal - 5;
                }
                else
                {
                    newVal = currentVal - newVal;
                }
                if (newVal < 0) newVal = newVal+60;
                input.val(newVal).change();

                if (currentValHrs == 0 && newVal == 0)
                {
                    $(".btn-number2[data-type='minus'][data-field='"+name+"']").attr("disabled", "disabled")
                }

                if (currentValHrs > 0 && newVal==55)
                {
                    inputHrs.val(currentValHrs - 1).change();
                }
            }
            else if(type == 'plus')
            {
                newVal = currentVal + 5 - currentVal%5;
                if (newVal >= 60) newVal = newVal-60;
                input.val(newVal).change();

                if (currentValHrs == 12 && newVal == 55)
                {
                    $(".btn-number2[data-type='plus'][data-field='"+name+"']").attr("disabled", "disabled")
                }

                if (currentValHrs < 12 && newVal==0)
                {
                    inputHrs.val(currentValHrs + 1).change();
                }
            }
        } else {
            input.val(0);
        }
    });
    $('.input-number2').focusin(function(){
       $(this).data('oldValue', $(this).val());
    });
    $('.input-number2').change(function() {

        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());
        oldValue = $(this).data('oldValue');

        var inputHrs = $("input[name='"+$('.btn-number1').attr('data-field')+"']");
        var currentValHrs = parseInt(inputHrs.val());


        name = $(this).attr('name');
        if(valueCurrent >= minValue) {
            $(".btn-number2[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Minimum value for Minutes: 0');
            $(this).val($(this).data('oldValue'));
        }
        if(valueCurrent <= maxValue) {
            $(".btn-number2[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            $(this).val($(this).data('oldValue'));
        }
        
        if (currentValHrs == 12 && valueCurrent >= 55)
        {
            $(this).val('55')
            $(".btn-number2[data-type='plus'][data-field='"+name+"']").attr("disabled", "disabled")
        }
        
    });
    $(".input-number2").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                 // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) || 
                 // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });