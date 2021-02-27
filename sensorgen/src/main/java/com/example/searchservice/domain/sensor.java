package com.example.searchservice.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "sensor")
public class sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="sensor_id", updatable = false, nullable = false)
    private Integer sensor_id;

    @Column(name ="type", nullable = false)
    private byte type;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private room roomid;

    @Column(name ="data", nullable = false)
    private Integer data;

    public sensor() {}
}
