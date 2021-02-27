var stompClient;

$(document).ready(function () {

    showRegLogBlock(0,0);
    checkCurrentUser();

    $(".login").on('click', function() {
        showRegLogBlock(0,1);
        return false;
    });

    $(".registration").on('click', function() {
        showRegLogBlock(1,0);
        return false;
    });

    $('#signup').on('submit', function(event) {
        event.preventDefault();
        sendRegAjax();
        return false;
    });

    $('#login').on('submit', function(event) {
        event.preventDefault();
        sendLogAjax();
        return false;
    });

    $('#currentUser').on('submit', function(event) {
        event.preventDefault();
        localStorage.removeItem(localKeyName);
        checkCurrentUser();
        refreshInfo();
        return false;
    });

    $('#someinf').on('input', function() {
        console.log($('#someinf').html());
    });
    connect();
});

function connect() {
    var socket = new SockJS('http://localhost:8086/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (sensors) {
            receive(JSON.parse(sensors["body"]));
        });
        setInterval(function() { refreshSensData(); }, 10000);
    });
}

function refreshSensData() {
    stompClient.send("/app/hello");
}

function receive(sensors) {
    sensors.forEach(function (sens) {
        if(sens["type"] === 1) {
            $("#temp" + sens["roomid"]["room_id"]).html("Temp - " + sens["data"] + "℃");
        } else if(sens["type"] === 2) {
            $("#hum" + sens["roomid"]["room_id"]).html("Humidity - " + sens["data"] + "%");
        }
    });
}

function refreshInfo() {
    updateRoomInfo();
}

function updateRoomInfo() {
    var token = localStorage.getItem(localKeyName);
    if(token !== null) {
        $.ajax({
            type: "GET",
            headers: {"Authorization": 'Bearer ' + token},
            url: "/control/room/getall",
            cache: false,
            timeout: 10000,
            success: function (data) {
                console.log("SUCCESS : ", data);
                var rooms = "";
                data.forEach(function (item) {
                    rooms += getRoomPlate(item["name"], item["light"], item["room_id"], item["needtemp"], item["needhum"]);
                });
                $('#multiContainer').html(rooms);
                setTimeout(function () { refreshSensData(); }, 100);
                setInterval(refreshSensData, 5000);
                setTimeout(function () { setLightHandler(); }, 100);
                setTimeout(function () { setRangeDetHandler(); updateDeviceInfo(); }, 100);
            },
            error: function (e) {
                console.log("ERROR : ", e);
            }
        });
    } else {
        $('#multiContainer').html('');
        $('#goToAdmin').hide();
    }
    isAdmin();
}

function updateDeviceInfo() {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/search/devices/getall/",
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            data.forEach(function (item) {
                var str = "rangeHum";
                if(item["type"] === 1) { str = "rangeTemp"; }
                var elem = '#' + item["roomid"]["room_id"] + str;
                $(elem).show();
                str = "labelHum";
                if(item["type"] === 1) { str = "labelTemp"; }
                elem = '#' + item["roomid"]["room_id"] + str;
                $(elem).show();
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function setRangeDetHandler() {
    $('.rangeInputTemp').on('change', function (event) {
        var id = event.target.id.replace('rangeTemp', '');
        var labelTempVal = $("#" + event.target.id).val();
        saveAction(actTemp, labelTempVal, id);
        setPreferences(id, labelTempVal, $("#" + id + "rangeHum").val());
    });
    $('.rangeInputHum').on('change', function (event) {
        var id = event.target.id.replace('rangeHum', '');
        var labelHumVal = $("#" + event.target.id).val();
        saveAction(actHum, labelHumVal, id);
        setPreferences(id, $("#" + id + "rangeTemp").val(), labelHumVal);
    });
    $('.rangeInputTemp').on('input change', function (event) {
        var id = event.target.id.replace('rangeTemp', '');
        var labelTempVal = $("#" + event.target.id).val();
        $("#" + id + "labelTemp").text(labelTempVal + '℃');
    });
    $('.rangeInputHum').on('input change', function (event) {
        var id = event.target.id.replace('rangeHum', '');
        var labelHumVal = $("#" + event.target.id).val();
        $("#" + id + "labelHum").text(labelHumVal + '%');
    });
    $('.toRoomDetails').on('click', function (event) {
        toRoomDetails(event.target.id.replace('roomDet', ''));
    });
}

function setPreferences(id, needtemp, needhum) {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/control/room/updateneeded/" + id + '/' + needtemp + '/' + needhum,
        cache: false,
        timeout: 10000,
        success: function (data) {},
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function toRoomDetails(id) {
    var token = localStorage.getItem(localKeyName);
    var element;
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/control/room/getby/" + id.toString(),
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            element = "<div class='descrInsBlock' style='font-size: 40px'><i>Room name:"+ data["name"] + "</i></div>";
            $.ajax({
                type: "GET",
                headers: {"Authorization": 'Bearer ' + token},
                url: "/sensor/getsensorsby/" + id.toString(),
                cache: false,
                timeout: 10000,
                success: function (data) {
                    console.log("SUCCESS : ", data);
                    var iter = 0;
                    data.forEach(function (item) {
                        iter++;
                        var type;
                        if(item["type"] === 1) {
                            type = "temperature";
                        } else {
                            type = "humidity";
                        }
                        element += "<div style='font-size: 30px; width: 100%;'><b>Sensor №" + iter + " type:</b></div>" +
                        "<div style='font-size: 24px; width: 100%; border-bottom: 1px solid black;'>" + type + "</div>";
                    });
                    if(iter === 0) {
                        element += "<div style='font-size: 30px'><b>List empty!</b></div>";
                    }
                    $('#multiContainer').html(element);
                },
                error: function (e) {
                    console.log("ERROR : ", e);
                }
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function setLightHandler() {
    $(".light, .nolight").on('click', function(event) {
        changeLight(event.target);
    });
}

function changeLight(elem) {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/control/room/changelight/" + elem.id.toString(),
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            if(data) {
                elem.className = "light";
                elem.innerHTML = "Light ON";
                saveAction(actLight, 1, elem.id.toString());
            } else {
                elem.className = "nolight";
                elem.innerHTML = "Light OFF";
                saveAction(actLight, 0, elem.id.toString());
            }
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}