
var sDate = document.getElementById('startDate');
var fDate = document.getElementById('endDate');

$('#submitbutton').submit(function(e) {

    e.preventDefault();
    $.ajax({
        url: '/user',
        type: 'PUT',
        data: {
            startDate: sDate,
            finalDate: fDate,
        },
        success: function(msg) {
            console.log(aek);
        }               
    });
});