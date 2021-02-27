package com.example.searchservice.client;

import com.example.searchservice.domain.room;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@FeignClient(value = "profile-control")
@RequestMapping("/room")
public interface RoomClient {
    @GetMapping("/getall")
    Iterable<room> getAllRooms();

    @GetMapping("/changelight/{id}")
    boolean changeLight(@PathVariable(name="id") int id);

    @GetMapping("/updateneeded/{id}/{temp}/{hum}")
    boolean updateNeeded(@PathVariable(name="id") Integer id, @PathVariable(name="temp") Integer temp, @PathVariable(name="hum") Integer hum);

    @GetMapping("/getby/{id}")
    Optional<room> getRoomById(@PathVariable(name="id") int id);

    @PostMapping("/add")
    room createRoom(@RequestBody room room);

    @DeleteMapping("/del/{id}")
    String deleteRoom(@PathVariable(name="id") int id);
}
