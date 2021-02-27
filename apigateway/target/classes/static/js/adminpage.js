var findStr = null;
var preloadedData;

$(document).ready(function () {

    showRegLogBlock(0,0);
    checkCurrentUser();
    loadAdminInfo();

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
        updateRoomInfo();
        return false;
    });

    $('#someinf').on('input', function() {
        findStr = $('#someinf').val();
        updateHistory();
    });
});

function refreshInfo() {
    loadAdminInfo();
}

function loadAdminInfo() {
    var token = localStorage.getItem(localKeyName);
    if (token === null) {
        $("#multiContainer").html("You are not authorized to view this page!");
        return 0;
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
            if(data) {
                loadRoomAdminInfo();
            } else {
                $("#multiContainer").html("You have no admin access!");
            }
            getHistory();
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function loadRoomAdminInfo() {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/control/room/getall",
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            var insert = getNewRoomAdminBlock();
            data.forEach(function (item) {
                insert += getRoomAdminPlate(item["name"], item["room_id"]);
            });
            $("#multiContainer").html(insert);
            setTimeout(function () { adminHandlers(); updateSensorInfo(); updateDeviceInfo(); }, 100);
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function updateSensorInfo() {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/search/sensors/getall/",
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            data.forEach(function (item) {
                var str = "hum";
                if(item["type"] === 1) { str = "temp"; }
                var elem = '#' + item["roomid"]["room_id"] + str;
                $(elem).addClass("delSensor");
                $(elem).removeClass("addSensor");
                $(elem).html("Del " + str + " sens");
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
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
                var str = "humDev";
                if(item["type"] === 1) { str = "tempDev"; }
                var elem = '#' + item["roomid"]["room_id"] + str;
                $(elem).addClass("delDevice");
                $(elem).removeClass("addDevice");
                $(elem).html("Del " + str.replace('Dev','') + " device");
            });
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function adminHandlers() {
    $('#newRoomForm').on('submit', function () {
        event.preventDefault();
        var newRoom = {};
        newRoom["light"] = false;
        newRoom["name"] = $("#room_name").val();
        newRoom["needtemp"] = 20;
        newRoom["needhum"] = 30;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/control/room/add",
            data: JSON.stringify(newRoom),
            dataType: 'json',
            cache: false,
            timeout: 10000,
            success: function (data) {
                console.log("SUCCESS : ", data);
                $("#room_name").val("");
                saveAction(createDeleteRoom, 1, data["room_id"]);
                loadAdminInfo();
            },
            error: function (e) {
                console.log("ERROR : ", e);
            }
        });
    });
    $('.addSensor').on('click', function(event) {
        var str = '';
        if(event.target.id.includes("temp")) {
            str = "temp";
            sendCreateDeleteTempHumSens(event.target.id.replace(str,''), 1, event.target, str);
        } else if(event.target.id.includes("hum")) {
            str = "hum";
            sendCreateDeleteTempHumSens(event.target.id.replace(str,''), 2, event.target, str);
        }
    });
    $('.addDevice').on('click', function(event) {
        var str = '';
        if(event.target.id.includes("tempDev")) {
            str = "tempDev";
            sendCreateDeleteTempHumDevices(event.target.id.replace(str,''), 1, event.target, str);
        } else if(event.target.id.includes("humDev")) {
            str = "humDev";
            sendCreateDeleteTempHumDevices(event.target.id.replace(str,''), 2, event.target, str);
        }
    });
    $('.delRoom').on('click', function (event) {
        sendDeleteRoom(event.target.id.replace('roomDel', ''));
    });
}

function sendCreateDeleteTempHumSens(id, type, target, str) {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/search/sensors/add/" + type + '/' + id,
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            if(data) {
                target.className = "delSensor";
                target.innerHTML = "Del " + str + " sens";
                if(type === 1) {
                    saveAction(createDeleteTempSens, 1, id);
                } else {
                    saveAction(createDeleteHumSens, 1, id);
                }
            } else {
                target.className = "addSensor";
                target.innerHTML = "Add " + str + " sens";
                if(type === 1) {
                    saveAction(createDeleteTempSens, 0, id);
                } else {
                    saveAction(createDeleteHumSens, 0, id);
                }
            }
            setTimeout(function () { getHistory(); }, 100);
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function sendCreateDeleteTempHumDevices(id, type, target, str) {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/search/devices/add/" + type + '/' + id,
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            if(data) {
                target.className = "delDevice";
                target.innerHTML = "Del " + str.replace('Dev','') + " device";
                if(type === 1) {
                    saveAction(createDeleteTempDev, 1, id);
                } else {
                    saveAction(createDeleteHumDev, 1, id);
                }
            } else {
                target.className = "addDevice";
                target.innerHTML = "Add " + str.replace('Dev','') + " device";
                if(type === 1) {
                    saveAction(createDeleteTempDev, 0, id);
                } else {
                    saveAction(createDeleteHumDev, 0, id);
                }
            }
            setTimeout(function () { getHistory(); }, 100);
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function sendDeleteRoom(id) {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "DELETE",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/control/room/del/" + id,
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            loadRoomAdminInfo();
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function getHistory() {
    var token = localStorage.getItem(localKeyName);
    $.ajax({
        type: "GET",
        headers: {"Authorization": 'Bearer ' + token},
        url: "/control/history/getall/",
        cache: false,
        timeout: 10000,
        success: function (data) {
            console.log("SUCCESS : ", data);
            preloadedData = data;
            updateHistory();
        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

function updateHistory() {
    var ins = "";
    if(findStr !== null) { findStr = findStr.toLowerCase(); }
    preloadedData.forEach(function (item) {
        var body = "";
        if(item["type"] === actLight) {
            body += " switched light ";
            if(item["data"]) { body += "ON "; }
            else { body += "OFF "; }
        } else if(item["type"] === actTemp) {
            body += " changed temp to " + item["data"] + '℃ ';
        } else if(item["type"] === actHum) {
            body += " changed hum to " + item["data"] + '% ';
        } else if(item["type"] === createDeleteRoom) {
            if(item["data"]) { body += " performed CREATE ROOM "; }
        } else if(item["type"] === createDeleteTempSens) {
            if(item["data"]) { body += " added temp sensor "; }
            else { body += " deleted temp sensor "; }
        } else if(item["type"] === createDeleteTempDev) {
            if(item["data"]) { body += " added temp device "; }
            else { body += " deleted temp device "; }
        } else if(item["type"] === createDeleteHumSens) {
            if(item["data"]) { body += " added hum sensor "; }
            else { body += " deleted hum sensor "; }
        } else if(item["type"] === createDeleteHumDev) {
            if(item["data"]) { body += " added hum device "; }
            else { body += " deleted hum device "; }
        }
        var date = new Date(item["datetime"]).toLocaleString();
        if(findStr === null || item["client_id"]["username"].toLowerCase().includes(findStr) || body.toLowerCase().includes(findStr) || date.toLowerCase().includes(findStr) || item["room_id"]["name"].toLowerCase().includes(findStr)) {
            ins += getHistoryListBlock(item["client_id"]["username"], body, date, item["room_id"]["name"]);
        }
    });
    $('#forHistory').html(ins);
}