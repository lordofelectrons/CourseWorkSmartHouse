package com.example.authservice.repository;

import com.example.authservice.domain.Clients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Clients, Integer> {
    Clients findByUsername(String username);
}