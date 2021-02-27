package com.example.searchservice.repository;

import com.example.searchservice.domain.history;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryRepository extends JpaRepository<history, Integer> { }