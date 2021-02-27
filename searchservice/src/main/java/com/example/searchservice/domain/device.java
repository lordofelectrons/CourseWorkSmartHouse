package com.example.searchservice.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "device")
public class device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="device_id", updatable = false, nullable = false)
    private Integer device_id;

    @Column(name ="type", nullable = false)
    private byte type;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private room roomid;

    public device() {}
}
