package com.anipia.dto;

import java.time.LocalDate;

public class Reservation {
    public Long id;
    public LocalDate datumOd;
    public LocalDate datumDo;
    public Double celkovaCena;

    public Long zakaznikId;
    public Long petId;
    public Long roomId;

    public String customerName;
    public String petName;

    public String petType;
    public String petBreed;
    public Integer petAge;
    public String petHealth;
    public String petNote;
}
