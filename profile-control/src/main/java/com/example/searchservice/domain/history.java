package com.example.searchservice.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "history")
public class history {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="history_id", updatable = false, nullable = false)
    private Integer history_id;

    @Column(name ="datetime", nullable = false)
    private Timestamp datetime;

    @Column(name ="type", nullable = false)
    private Integer type;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Clients client_id;

    @Column(name ="data")
    private Integer data;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private room room_id;

    public history() {}
}
