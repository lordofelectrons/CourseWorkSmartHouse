package com.example.searchservice.client;

import com.example.searchservice.domain.sensor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "sensorgen")
public interface SensorClient {
    @GetMapping("/getall/")
    Iterable<sensor> getAllSensors();
}
