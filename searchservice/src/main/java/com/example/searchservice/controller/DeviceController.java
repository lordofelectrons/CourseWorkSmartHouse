package com.example.searchservice.controller;

import com.example.searchservice.client.RoomClient;
import com.example.searchservice.domain.device;
import com.example.searchservice.domain.room;
import com.example.searchservice.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RefreshScope
@RestController
@RequestMapping("/devices")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private RoomClient roomClient;

    @GetMapping("/getall/")
    public Iterable<device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @GetMapping("/getby/{id}")
    public Optional<device> getDeviceById(@PathVariable(name="id") int id) {
        return deviceRepository.findById(id);
    }

    @GetMapping("/getsensorsby/{id}")
    public List<device> getDevicesByRoomId(@PathVariable(name="id") int id) {
        Optional<room> room = roomClient.getRoomById(id);
        if(room.isEmpty()) { return null; }
        return deviceRepository.findAllByRoomid(room.get());
    }

    @PostMapping("/add")
    public device updateDevice(@RequestBody device device) {
        return deviceRepository.save(device);
    }

    @GetMapping("/add/{type}/{room_id}")
    public boolean createDevice(@PathVariable(name="room_id") int room_id, @PathVariable(name="type") byte type) {
        Optional<room> room = roomClient.getRoomById(room_id);
        if(room.isEmpty()) { return false; }
        Optional<device> presDevice = deviceRepository.findByRoomidAndType(room.get(), type);
        if(presDevice.isPresent()) {
            deleteDevice(presDevice.get().getDevice_id());
            return false;
        }
        device device = new device();
        device.setType(type);
        device.setRoomid(room.get());
        deviceRepository.save(device);
        return true;
    }

    @DeleteMapping("/del/{id}")
    public void deleteDevice(@PathVariable(name="id") int id) {
        deviceRepository.deleteById(id);
    }
}
