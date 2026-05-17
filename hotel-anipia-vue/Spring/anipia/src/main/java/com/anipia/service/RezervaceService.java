package com.anipia.service;

import com.anipia.dto.Reservation;
import com.anipia.model.Rezervace;
import com.anipia.repository.RezervaceRepository;
import com.anipia.repository.ZakaznikRepository;
import com.anipia.repository.ZvireRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RezervaceService {

    private final RezervaceRepository repo;
    private final ZakaznikRepository zakaznikRepo;
    private final ZvireRepository zvireRepo;

    public RezervaceService(
            RezervaceRepository repo,
            ZakaznikRepository zakaznikRepo,
            ZvireRepository zvireRepo
    ) {
        this.repo = repo;
        this.zakaznikRepo = zakaznikRepo;
        this.zvireRepo = zvireRepo;
    }

    // CREATE
    public Rezervace addRezervace(Rezervace r) {
        return repo.save(r);
    }

    // USER VIEW (DTO)
    public List<Reservation> getByUser(Long zakaznikId) {
        return repo.findByZakaznikId(zakaznikId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ADMIN VIEW (DTO)
    public List<Reservation> getAll() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // DELETE
    public void deleteRezervace(Long id) {
        repo.deleteById(id);
    }

    // ===== MAPPING =====
    private Reservation toDTO(Rezervace r) {

        Reservation dto = new Reservation();

        dto.id = r.getId();
        dto.datumOd = r.getDatumOd();
        dto.datumDo = r.getDatumDo();
        dto.celkovaCena = r.getCelkovaCena();

        dto.zakaznikId = r.getZakaznikId();
        dto.petId = r.getPetId();
        dto.roomId = r.getRoomId();

        // CUSTOMER NAME (Jméno + Příjmení)
        zakaznikRepo.findById(r.getZakaznikId())
                .ifPresent(z -> dto.customerName = z.getJmeno() + " " + z.getPrijmeni());

        // PET NAME
        zvireRepo.findById(r.getPetId())
        .ifPresent(p -> {
            dto.petName = p.getJmeno();

            dto.petType = p.getDruh();
            dto.petBreed = p.getPlemeno();
            dto.petAge = p.getVek();
            dto.petHealth = p.getZdravotniStav();
            dto.petNote = p.getPoznamka();
        });

        return dto;
    }
}