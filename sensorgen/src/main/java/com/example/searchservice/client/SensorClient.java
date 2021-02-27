package com.example.searchservice.client;

import com.example.searchservice.domain.sensor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@FeignClient(value = "searchservice")
@RequestMapping("/sensors")
public interface SensorClient {
    @GetMapping("/getall/")
    Iterable<sensor> getAllSensors();

    @GetMapping("/getby/{id}")
    Optional<sensor> getSensorById(@PathVariable(name = "id") int id);

    @GetMapping("/getsensorsby/{id}")
    List<sensor> getSensorsByRoomId(@PathVariable(name = "id") int id);

    @PostMapping("/add")
    sensor updateSensor(@RequestBody sensor sensor);

    @GetMapping("/add/{type}/{room_id}")
    boolean createSensor(@PathVariable(name="room_id") int room_id, @PathVariable(name="type") byte type);

    @DeleteMapping("/del/{id}")
    void deleteSensor(@PathVariable(name = "id") int id);
}