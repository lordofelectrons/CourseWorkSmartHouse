package com.example.searchservice.controller;

import com.example.searchservice.domain.room;
import com.example.searchservice.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RefreshScope
@RestController
@RequestMapping("/room")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/getall")
    public Iterable<room> getAllRooms() { return roomRepository.findAll(); }

    @GetMapping("/changelight/{id}")
    public boolean changeLight(@PathVariable(name="id") int id) {
        Optional<room> room = roomRepository.findById(id);
        if(room.isEmpty()) {
            return false;
        }
        room.get().setLight(!room.get().isLight());
        roomRepository.save(room.get());
        return room.get().isLight();
    }

    @GetMapping("/updateneeded/{id}/{temp}/{hum}")
    public boolean updateNeeded(@PathVariable(name="id") Integer id, @PathVariable(name="temp") Integer temp, @PathVariable(name="hum") Integer hum) {
        Optional<room> room = roomRepository.findById(id);
        if(room.isEmpty()) {
            return false;
        }
        room.get().setNeedtemp(temp);
        room.get().setNeedhum(hum);
        roomRepository.save(room.get());
        return true;
    }

    @GetMapping("/getby/{id}")
    public Optional<room> getRoomById(@PathVariable(name="id") int id) {
        return roomRepository.findById(id);
    }

    @PostMapping("/add")
    public room createRoom(@RequestBody room room) {
        return roomRepository.save(room);
    }

    @DeleteMapping("/del/{id}")
    public String deleteRoom(@PathVariable(name="id") int id) {
        String ret = roomRepository.findById(id).get().getName();
        roomRepository.deleteById(id);
        return ret;
    }
}
