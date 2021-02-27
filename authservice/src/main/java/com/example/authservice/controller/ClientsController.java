package com.example.authservice.controller;

import com.example.authservice.domain.Clients;
import com.example.authservice.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RefreshScope
@RestController
@RequestMapping("/client")
public class ClientsController {
    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/getall")
    public Iterable<Clients> getAllClients() { return clientRepository.findAll(); }

    @GetMapping("/getby/{id}")
    public Optional<Clients> getClientById(@PathVariable(name="id") int id) { return clientRepository.findById(id); }

    @GetMapping("/getby/name/{username}")
    public Clients getClientByName(@PathVariable(name="username") String username) { return clientRepository.findByUsername(username); }

    @PostMapping("/add")
    public Clients createClient(@RequestBody Clients client) {
        return clientRepository.save(client);
    }

    @DeleteMapping("/del/{id}")
    public void deleteClient(@PathVariable(name="id") int id) {
        clientRepository.deleteById(id);
    }
}
