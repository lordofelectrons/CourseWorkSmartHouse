package com.example.searchservice.controller;

import com.example.searchservice.client.SensorClient;
import com.example.searchservice.domain.sensor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RefreshScope
@RestController
public class SensorController {

    @Autowired
    private SensorClient sensorClient;

    @GetMapping("/getall/")
    public Iterable<sensor> getAllSensors() {
        Iterable<sensor> sensors = sensorClient.getAllSensors();
        for (sensor sens : sensors) {
            boolean needSave = true;
            switch (sens.getType()) {
                case 1:
                    if (sens.getData() > sens.getRoomid().getNeedtemp()) {
                        sens.setData(sens.getData() - 1);
                    } else if (sens.getData() < sens.getRoomid().getNeedtemp()){
                        sens.setData(sens.getData() + 1);
                    } else { needSave = false; }
                    break;
                case 2:
                    if (sens.getData() > sens.getRoomid().getNeedhum()) {
                        sens.setData(sens.getData() - 1);
                    } else if (sens.getData() < sens.getRoomid().getNeedhum()) {
                        sens.setData(sens.getData() + 1);
                    } else { needSave = false; }
                    break;
            }
            if(needSave) {
                sensorClient.updateSensor(sens);
            }
        }
        return sensors;
    }

    @GetMapping("/getby/{id}")
    public Optional<sensor> getSensorById(@PathVariable(name="id") int id) {
        return sensorClient.getSensorById(id);
    }

    @GetMapping("/getsensorsby/{id}")
    public List<sensor> getSensorsByRoomId(@PathVariable(name="id") int id) {
        Iterable <sensor> sensors = sensorClient.getAllSensors();
        List<sensor> retSensors = new ArrayList<>();
        for (sensor sens : sensors) {
            if(sens.getRoomid().getRoom_id() == id) {
                retSensors.add(sens);
            }
        }
        return retSensors;
    }

    @PostMapping("/add")
    public sensor updateSensor(@RequestBody sensor sensor) {
        return sensorClient.updateSensor(sensor);
    }

    @GetMapping("/add/{type}/{room_id}")
    public boolean createSensor(@PathVariable(name="room_id") int room_id, @PathVariable(name="type") byte type) {
        return sensorClient.createSensor(room_id, type);
    }

    @DeleteMapping("/del/{id}")
    public void deleteSensor(@PathVariable(name="id") int id) {
        sensorClient.deleteSensor(id);
    }
}
