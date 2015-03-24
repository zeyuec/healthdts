$(document).ready(function() {

    // generate chart
    function generateChart(data) {
	$('#chart-result').empty();

	$('#chart-score').text("Score: "+data.score);
	var chartData = [];
	for (var date in data.chart) {
	    chartData.push({
		x: date,
		q: data.chart[date][0],
		m: data.chart[date][1],
		d: data.chart[date][2]}
			  );
	}
	Morris.Line({
	    element: 'chart-result',
	    data: chartData,
	    xkey: 'x',
	    ykeys: ['q', 'm', 'd'],
	    labels: ['sleep quantity', 'mood quantity', 'distance quantity'],
	    parseTime: false,
	    goals: [0, 100]
	});
    }

    // call back to post a request
    function callback(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	$.post("data.php",
	       {
		   start:start.toISOString(),
		   end:end.toISOString()
	       },
	       function(data,status){
		   data = JSON.parse(data);
		   generateChart(data);
		   console.log(data);
	       }
	      );
    }
    
    // call back var
    var cb = function(start, end, label) {
	callback(start, end, label);
    };

    // set up date picker
    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { days: 60 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            // 'Today': [moment(), moment()],
            // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            // 'This Month': [moment().startOf('month'), moment().endOf('month')],
            // 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-sm btn-primary',
        cancelClass: 'btn-sm',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Change',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    var optionSet2 = {
        startDate: moment().subtract(7, 'days'),
        endDate: moment(),
        opens: 'left',
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    };

    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#reportrange').daterangepicker(optionSet1, cb);

    $('#reportrange').on('show.daterangepicker', function() { console.log("show event fired"); });
    $('#reportrange').on('hide.daterangepicker', function() { console.log("hide event fired"); });
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) { 
        console.log("apply event fired, start/end dates are " 
		    + picker.startDate.format('MMMM D, YYYY') 
		    + " to " 
		    + picker.endDate.format('MMMM D, YYYY')
		   ); 
    });
    $('#reportrange').on('cancel.daterangepicker', function(ev, picker) { console.log("cancel event fired"); });


    // first call back
    callback(moment().subtract(29, 'days'), moment(), "Init");
});
