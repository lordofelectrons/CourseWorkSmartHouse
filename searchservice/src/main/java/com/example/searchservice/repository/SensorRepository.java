package com.example.searchservice.repository;

import com.example.searchservice.domain.room;
import com.example.searchservice.domain.sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorRepository extends JpaRepository<sensor, Integer> {
    List<sensor> findAllByRoomid(room room);
    Optional<sensor> findByRoomidAndType(room room, byte type);
}