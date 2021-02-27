package com.example.searchservice.controller;

import com.example.searchservice.client.ClientsClient;
import com.example.searchservice.domain.Clients;
import com.example.searchservice.domain.history;
import com.example.searchservice.domain.room;
import com.example.searchservice.repository.HistoryRepository;
import com.example.searchservice.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Optional;

@RefreshScope
@RestController
@RequestMapping("/history")
public class HistoryController {

    @Autowired
    private HistoryRepository historyRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ClientsClient clientsClient;

    @GetMapping("/getall")
    public Iterable<history> getAllHistory() { return historyRepository.findAll(); }

    @GetMapping("/getby/{id}")
    public Optional<history> getHistoryById(@PathVariable(name="id") int id) {
        return historyRepository.findById(id);
    }

    @GetMapping("/add/{client_name}/{type}/{data}/{room_id}")
    public history createHistory(@PathVariable(name="client_name") String client_name, @PathVariable(name="type") int type,
        @PathVariable(name="data") int data, @PathVariable(name="room_id") int room_id) {
        Clients client = clientsClient.getClientByName(client_name);
        history history = new history();
        history.setClient_id(client);
        history.setType(type);
        history.setData(data);
        Optional<room> room = roomRepository.findById(room_id);
        if(room.isEmpty()) { return null; }
        history.setRoom_id(room.get());
        history.setDatetime(new Timestamp(System.currentTimeMillis()));
        return historyRepository.save(history);
    }

    @DeleteMapping("/del/{id}")
    public void deleteHistory(@PathVariable(name="id") int id) {
        historyRepository.deleteById(id);
    }
}
