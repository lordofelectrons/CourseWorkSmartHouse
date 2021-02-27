package com.example.searchservice.repository;

import com.example.searchservice.domain.room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<room, Integer> { }