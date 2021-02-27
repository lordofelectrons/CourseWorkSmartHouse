package com.example.apigateway.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping("/")
    public String main() {
        return "mainpage";
    }

    @GetMapping("/admin")
    public String admin() {
        return "adminpage";
    }
}