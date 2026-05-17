package com.anipia.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.anipia.model.Zakaznik;
import com.anipia.repository.ZakaznikRepository;

// Servisní vrstva pro práci se zákazníky.
@Service
public class ZakaznikService {

    @Autowired
    private ZakaznikRepository zakaznikRepository;

    // Encoder pro bezpečné ukládání hesel pomocí BCrypt algoritmu.
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /*
      Registruje nového zákazníka do systému.
      
      Provádí kontrolu, zda email již není v databázi.
      Pokud je email unikátní, heslo je zašifrováno a uživatel je uložen.
     
      @param zakaznik objekt zákazníka obsahující registrační údaje
      @return uložený zákazník
      @throw Exception pokud již existuje uživatel se stejným emailem
    */
    public Zakaznik register(Zakaznik zakaznik) throws Exception {
        if (zakaznikRepository.findByEmail(zakaznik.getEmail()).isPresent()) {
            throw new Exception("Email is already exists");
        }

        // Hash hesla
        zakaznik.setHeslo(passwordEncoder.encode(zakaznik.getHeslo()));

        return zakaznikRepository.save(zakaznik);
    }

    /*
     Přihlášení zákazníka do systému.
      
     Ověřuje existenci uživatele podle emailu a následně kontroluje správnost hesla.
     Heslo se porovnává pomocí BCrypt hashovacího algoritmu.
     
     @param email - email uživatele
     @param heslo - heslo zadané uživatelem
     @return nalezený zákazník při úspěšném přihlášení
     @throws Exception pokud uživatel neexistuje nebo je heslo nesprávné
     */
    public Zakaznik login(String email, String heslo) throws Exception {
        Optional<Zakaznik> opt = zakaznikRepository.findByEmail(email);
        if (opt.isEmpty()) {
            throw new Exception("User with this email does not exist");
        }
        Zakaznik zakaznik = opt.get();

        // Porovnani hesel
        if (!passwordEncoder.matches(heslo, zakaznik.getHeslo())) {
            throw new Exception("Incorrect password");
        }

        return zakaznik;
    }
}

