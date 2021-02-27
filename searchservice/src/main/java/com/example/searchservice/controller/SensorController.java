package com.example.searchservice.controller;

import com.example.searchservice.client.RoomClient;
import com.example.searchservice.domain.room;
import com.example.searchservice.domain.sensor;
import com.example.searchservice.repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RefreshScope
@RestController
@RequestMapping("/sensors")
public class SensorController {

    @Autowired
    private SensorRepository sensorRepository;
    @Autowired
    private RoomClient roomClient;

    @GetMapping("/getall/")
    public Iterable<sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    @GetMapping("/getby/{id}")
    public Optional<sensor> getSensorById(@PathVariable(name="id") int id) {
        return sensorRepository.findById(id);
    }

    @GetMapping("/getsensorsby/{id}")
    public List<sensor> getSensorsByRoomId(@PathVariable(name="id") int id) {
        Optional<room> room = roomClient.getRoomById(id);
        if(room.isEmpty()) { return null; }
        return sensorRepository.findAllByRoomid(room.get());
    }

    @PostMapping("/add")
    public sensor updateSensor(@RequestBody sensor sensor) {
        return sensorRepository.save(sensor);
    }

    @GetMapping("/add/{type}/{room_id}")
    public boolean createSensor(@PathVariable(name="room_id") int room_id, @PathVariable(name="type") byte type) {
        Optional<room> room = roomClient.getRoomById(room_id);
        if(room.isEmpty()) { return false; }
        Optional<sensor> presSensor = sensorRepository.findByRoomidAndType(room.get(), type);
        if(presSensor.isPresent()) {
            deleteSensor(presSensor.get().getSensor_id());
            return false;
        }
        sensor sensor = new sensor();
        sensor.setType(type);
        sensor.setRoomid(room.get());
        if(type == 1) {sensor.setData(20);}
        else if(type == 2) {sensor.setData(30);}
        sensorRepository.save(sensor);
        return true;
    }

    @DeleteMapping("/del/{id}")
    public void deleteSensor(@PathVariable(name="id") int id) {
        sensorRepository.deleteById(id);
    }
}
