package com.example.searchservice.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "room")
public class room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="room_id", updatable = false, nullable = false)
    private Integer room_id;

    @Column(name ="light", nullable = false)
    private boolean light;

    @Column(name ="name", nullable = false)
    private String name;

    public room() {}
}
