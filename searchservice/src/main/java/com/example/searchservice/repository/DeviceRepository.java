package com.example.searchservice.repository;

import com.example.searchservice.domain.device;
import com.example.searchservice.domain.room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<device, Integer> {
    List<device> findAllByRoomid(room room);
    Optional<device> findByRoomidAndType(room room, byte type);
}