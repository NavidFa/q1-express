google.charts.load('current', {
    'packages': ['gauge', 'geochart', 'corechart']
});
var prchart = [];
var foodchart = 0;
var indexchart = 0;
var GDPchart = [];
var country = 0;
var iso3;
var result = [];
var url;
var sumlivestock = 0;
var nlive = 0;
var startdate = 0;
var enddate = 0;
var insidegdparray = []
var outsidgdparray = []
var o=1;

$(".result").hide()
  $.get('/countries')
    .then(function(data) {
        for (var i in data[1]) {
            var option = $('<option>');
            option.text(data[1][i].name)
            $("#select-country").append(option)
            var iso = data[1][i].iso2Code  ;
            var nameofcountry = data[1][i].name;
            option.attr({
                'value': [iso, nameofcountry]
            })
        }
        $("#select-country").change(function() {
            $(".result").hide(400)
            $('.background').show(500)
              GDPchart=[]
            $("#start-date").empty();
            var option = $('<option>');
            $("#start-date").append(option)
            option.attr('disabled', true)
            $("#end-date").empty();
            var option2 = $('<option>');
            $("#end-date").append(option2)
            option.attr('disabled', true)
            vals = $(this).val().split(",")
            iso2Code = vals[0];
            namecountry = vals[1];
            getprmean('/countries/pr/' + iso2Code)
        })
    })

function getprmean(url) {
    $.get(url)
        .then(function(data) {
            if (availabledata !== 0) {
                $("#nodata").fadeOut(500)
                $("#newcountry").fadeOut(500)
            }
            var availabledata = 0
            for (i in data[1]) {
                if (data[1][i].value !== null) {
                    var option = $('<option>');
                    option.text(data[1][i].date)
                    $("#start-date").append(option)
                    option.attr('value', data[1][i].date)
                    availabledata++
                }
            }
            if (availabledata == 0) {
                $(".headbox").hide(700).delay(2000).show(500)
                $("#nodata").text("No Data Availabe For This Country.").fadeIn(1000)
                $("#newcountry").text("Please Select A Different Country.").fadeIn(1000)
            }
            return data
        })



    .then(function(data) {
        $("#start-date").off("change").change(function() {
          console.log(o++);
          console.log("gdp",GDPchart);
            startdate = Number($(this).val());
            $("#end-date").empty();
            var option = $('<option>');
            $("#end-date").append(option)
            option.attr('disabled', true)
            sum = 0
            n = 0
            for (var i in data[1]) {
                if (data[1][i].value !== null && Number(data[1][i].date) >= startdate) {
                    var option = $('<option>');
                    option.text(data[1][i].date)
                    $("#end-date").append(option)
                    option.attr('value', data[1][i].date)
                    sum += Number(data[1][i].value)
                    n++
                }
            }
        })
        $("#end-date").off("change").change(function() {
            enddate = Number($(this).val());
            prchart = sum / n;
            console.log(prchart);
            getliveurl('/countries/live/'+iso2Code)
        })
    })

}
function getliveurl(url) {
    sumlivestock = 0;
    nlive = 0;
    $.get(url)
        .then(function(data) {
            console.log(url);
            for (i in data[1]) {
                if (Number(data[1][i].date) >= startdate && Number(data[1][i].date) <= enddate) {
                    sumlivestock += Number((data[1][i].value));
                    nlive++
                }
            }
            indexchart = sumlivestock / nlive;
        })
    indexchart = sumlivestock / nlive;
    getfoodurl('/countries/food/'+iso2Code);

}

function getfoodurl(url) {
    sumfood = 0;
    nfood = 0;
    $.get(url)
        .then(function(data) {
            console.log(url);
            for (i in data[1]) {
                if (Number(data[1][i].date) >= startdate && Number(data[1][i].date) <= enddate) {
                    sumfood += Number((data[1][i].value));
                    nfood++
                }
            }
            console.log(sumfood / nfood);
            foodchart = sumfood / nfood;
        })
    getgdpurl('/countries/gdp/'+iso2Code)
}

function getgdpurl(url) {
    insidegdparray = []
    outsidgdparray = []

    $.get(url)
        .then(function(data) {
            console.log(url);
            for (i in data[1]) {
                insidegdparray = []
                if (Number(data[1][i].date) >= startdate && Number(data[1][i].date) <= enddate) {
                    insidegdparray.unshift(Number(data[1][i].value))
                    insidegdparray.unshift(data[1][i].date)
                    outsidgdparray.unshift(insidegdparray)
                }
            }
            outsidgdparray.unshift(['date', namecountry])
            console.log(outsidgdparray);
            GDPchart = outsidgdparray
        })

    .catch(function(error) {
        console.log("error");
    });
    return $("#submit").removeAttr("disabled");
}

$("#country-form").submit(function(event) {
    event.preventDefault()

    iso3 = iso2Code
    result = [GDPchart, foodchart, indexchart, namecountry, iso3, prchart]

    console.log(result);

    //
    $(".background").hide();
    $(".result").show();
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        var data = google.visualization.arrayToDataTable(
            GDPchart
        );
        var options = {
            title: 'GDP Per Capita',
            vAxis: {
                title: 'US$'
            },
            hAxis: {
                title: 'Year',
                viewWindowMode: 'maximized',
            },
            legend: 'none',
            seriesType: 'bars',
        };
        var chart = new google.visualization.ComboChart(document.getElementById('chartgdp_div'));
        chart.draw(data, options);
    }
    google.charts.setOnLoadCallback(drawChartfood);

    function drawChartfood() {
        var data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ["Food Index", 0],
        ]);
        var options = {
            width: 600,
            height: 320,
            redFrom: 0,
            redTo: 15,
            yellowFrom: 15,
            yellowTo: 30,
            minorTicks: 10,
            max: 200
        };
        var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
        chart.draw(data, options);
        var i = 0
        var maxfood = foodchart
        setInterval(function() {
            if (i < maxfood) {
                i++
            }
        }, 10);
        setInterval(function() {
            data.setValue(0, 1, 0 + i);
            chart.draw(data, options);
        }, 100);
    }
    google.charts.setOnLoadCallback(drawChartlive);

    function drawChartlive() {
        var data = google.visualization.arrayToDataTable([
            ['Lebel', 'Value'],
            ["Livestock", 0],
        ]);
        var options = {
            width: 600,
            height: 320,
            redFrom: 0,
            redTo: 15,
            yellowFrom: 15,
            yellowTo: 30,
            minorTicks: 10,
            max: 200
        };
        var chart = new google.visualization.Gauge(document.getElementById('chart2_div'));
        chart.draw(data,
            options);
        var j = 0
        var maxlive = indexchart
        setInterval(function() {
            if (j < maxlive) {
                j++
            }
        }, 10);
        setInterval(function() {
            data.setValue(0, 1, 0 + j);
            chart.draw(data, options);
        }, 100);

    }

    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {
        console.log(prchart, namecountry);
        var data = google.visualization.arrayToDataTable([
            ['Country', 'Annual average precipitation'],
            [namecountry, prchart],
            ['low', 0],
            ['high', 2000]
        ]);
        var options = {
            region: iso3,
            colorAxis: {
                colors: ['#0b393f']
            },
        };
        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
        chart.draw(data, options);
    }
    $("body").animate({
        scrollTop: 500
    }, 1500);

    $("body").animate({
        scrollTop: 1000
    }, 2000);

    $(" body").animate({
        scrollTop: 1500
    }, 2500);
    $("body").animate({
        scrollTop: 2000
    }, 3000);
    $("body").mousemove(function() {
        $("body").stop(true)
    })
});
