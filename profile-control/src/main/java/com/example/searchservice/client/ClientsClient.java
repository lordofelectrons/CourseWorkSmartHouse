package com.example.searchservice.client;

import com.example.searchservice.domain.Clients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@FeignClient(value = "authservice")
@RequestMapping("/client")
public interface ClientsClient {
    @GetMapping("/getall")
    Iterable<Clients> getAllClients();

    @GetMapping("/getby/{id}")
    Optional<Clients> getClientById(@PathVariable(name="id") int id);

    @GetMapping("/getby/name/{username}")
    Clients getClientByName(@PathVariable(name="username") String username);

    @PostMapping("/add")
    Clients createClient(@RequestBody Clients client);

    @DeleteMapping("/del/{id}")
    void deleteClient(@PathVariable(name="id") int id);
}
