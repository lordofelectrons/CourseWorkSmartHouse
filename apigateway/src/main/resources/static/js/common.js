var localKeyName = "smartHouseToken";
var actLight = 1;
var actTemp = 2;
var actHum = 3;
var createDeleteRoom = 4;
var createDeleteTempSens = 5;
var createDeleteTempDev = 6;
var createDeleteHumSens = 7;
var createDeleteHumDev = 8;

function getRoomPlate(name, light, id, temp, hum) {
    var ret = "<div class='informPlate'>" +
        "<div><b>" + name +"</b></div>" +
        "<div class='descrInsBlock'>Climate Control</div>" +
        "<div><i id='temp" + id + "'>Temp - undef℃</i></div>" +
        "<div><input type='range' min='16' max='28' step='1' class='rangeInputTemp' id='" + id + "rangeTemp" +"' value='" + temp + "' style='display: none;'><label class='tempVal' id='" + id + "labelTemp" +"' style='display: none;'>" + temp + "℃</label></div>" +
        "<div><i id='hum" + id + "'>Humidity - undef%</i></div>" +
        "<div><input type='range' min='10' max='80' step='2' class='rangeInputHum' id='" + id + "rangeHum" +"' value='" + hum + "' style='display: none;'><label class='humVal' id='" + id + "labelHum" +"' style='display: none;'>"+ hum + "%</label></div>";
    if(light) { ret += "<a class='light' id='" + id + "'>Light ON</a>"; }
    else { ret += "<a class='nolight' id='" + id + "'>Light OFF</a>"; }
    ret += "<a class='toRoomDetails' id='" + id + "roomDet" +"'>Open details...</a></div>";
    return ret;
}

function getRoomAdminPlate(name, id) {
    return "<div class='informPlate'>" +
        "<div><b>" + name +"</b></div>" +
        "<div class='descrInsBlock'>Control sensors/devices</div>" +
        "<a class='addSensor' id='" + id + "temp'>Add temp sens</a>" +
        "<a class='addSensor' id='" + id + "hum'>Add hum sens</a>" +
        "<a class='addDevice' id='" + id + "tempDev'>Add temp device</a>" +
        "<a class='addDevice' id='" + id + "humDev'>Add hum device</a>" +
        "<a class='delRoom' id='" + id + "roomDel" +"'>Delete room</a></div>" +
        "</div>"
}

function getNewRoomAdminBlock() {
    return "<div class='informPlate' style='width: 100%; text-align: center;'>" +
        "<div class='descrInsBlock'>Enter new room name</div><form id='newRoomForm'>" +
        "<div><input style='width: 50%; text-align: center;' required type='text' id='room_name' placeholder='room name'/></div>" +
        "<div><input style='width: 50%;' type='submit' value='Add'/></div>" +
        "</form></div>";
}

function getHistoryListBlock(username, body, time, room) {
    if(room === null) {
        return "<div style='border-bottom: 3px double black;'>" +
            "<div style='width: 100%'>User <b>" + username + "</b> " + body + "(at " + time + ")</div>" +
            "</div>";
    }
    return "<div style='border-bottom: 3px double black;'>" +
        "<div style='width: 100%'>User <b>" + username + "</b> " + body + "(at " + time + ") in " + room + "</div>" +
        "</div>";
}


function isAdmin() {
    var token = localStorage.getItem(localKeyName);
    if (token === null) {
        return false;
    }
    $.ajax({
        type: "POST",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/auth/isadmin",
        data: token,
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            if(data) { $('#goToAdmin').show(); }
            else { $('#goToAdmin').hide(); }
            return data;
        },
        error: function (e) {
            console.log("ERROR : ", e);
            return false;
        }
    });
}

function sendRegAjax() {
    var regUser = {};
    regUser["username"] = $("#username").val();
    regUser["first_name"] = $("#first_name").val();
    regUser["last_name"] = $("#last_name").val();
    regUser["email"] = $("#email").val();
    regUser["active"] = 1;
    regUser["password"] = $("#password").val();

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/auth/registration",
        data: JSON.stringify(regUser),
        dataType: 'json',
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            showRegLogBlock(0,1);
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function sendLogAjax() {
    var logUser = {};
    logUser["username"] = $("#usernameLog").val();
    logUser["password"] = $("#passwordLog").val();

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/auth/token",
        data: JSON.stringify(logUser),
        dataType: 'text',
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            showRegLogBlock(0,0);
            localStorage.setItem(localKeyName, data);
            checkCurrentUser();
        },
        error: function (e) {
            console.log("ERROR : ", e);
            $('#errorLog').html("Incorrect username or password!");

        }
    });
}

function showRegLogBlock(r, l) {
    if(r) $("#registrationBlock").show(); else $("#registrationBlock").hide();
    if(l) $("#loginBlock").show(); else $("#loginBlock").hide();
}

function checkCurrentUser() {
    var token = localStorage.getItem(localKeyName);
    if(token !== null) {
        $.ajax({
            type: "POST",
            headers: {"Authorization": 'Bearer ' + token},
            url: "/auth/getusername",
            data: token,
            dataType: 'text',
            cache: false,
            timeout: 10000,
            success: function (data) {
                console.log("SUCCESS : ", data);
                $("#currentUser").show();
                $("#noCurrentUser").hide();
                $("#currentUsername").html(data);
                refreshInfo();
            },
            error: function (e) {
                console.log("ERROR : ", e);
            }
        });
    } else {
        $("#currentUser").hide();
        $("#noCurrentUser").show();
    }
}

function saveAction(type, data, room_id) {
    var token = localStorage.getItem(localKeyName);
    if(token !== null) {
        $.ajax({
            type: "GET",
            headers: {"Authorization": 'Bearer ' + token},
            url: "/control/history/add/" + $('#currentUsername').text() + '/' + type + '/' + data + '/' + room_id,
            cache: false,
            timeout: 10000,
            success: function (data) {
                console.log("SUCCESS : ", data);
            },
            error: function (e) {
                console.log("ERROR : ", e);
            }
        });
    }
}