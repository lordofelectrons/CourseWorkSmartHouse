package com.example.searchservice.controller;

import com.example.searchservice.client.SensorClient;
import com.example.searchservice.domain.sensor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @Autowired
    SensorClient sensorClient;

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Iterable<sensor> getSens(){
        return sensorClient.getAllSensors();
    }
}