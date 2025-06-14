package com.getstaged.service;

import com.getstaged.domain.CV;
import com.getstaged.domain.EntenteStage;
import com.getstaged.domain.FicheSuivie;
import com.getstaged.domain.RapportVisite;
import com.getstaged.domain.RapportStage;
import com.getstaged.repository.CVRepository;
import com.getstaged.exception.StorageException;
import com.getstaged.exception.StorageFileNotFoundException;
import com.getstaged.repository.EntenteStageRepository;
import com.getstaged.repository.RapportStageRepository;
import java.util.Optional;
import com.getstaged.repository.FicheSuivieRepository;
import com.getstaged.repository.RapportVisiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DBFileStorageService {

    @Autowired
    private CVRepository cvRep;
    @Autowired
    private EntenteStageRepository ententeStageRepository;
    @Autowired
    private RapportVisiteRepository rapportVisiteRepository;
    @Autowired
    private FicheSuivieRepository ficheSuivieRepository;

    @Autowired
    private RapportStageRepository rapportStageRepository;

    private void checkName(String fileName) {
        if (fileName.contains("..")) {
            throw new StorageException("Sorry! Filename contains invalid chars " + fileName);
        }
    }

    public CV storeCV(CV cv, String fileName) {
        checkName(fileName);
        return cvRep.save(cv);
    }


    public CV getCV(Long id) {
        return cvRep.findById(id).
                orElseThrow(() -> new StorageFileNotFoundException("File not found with id " + id));
    }

    public EntenteStage getEntente(Long id) {
        return ententeStageRepository.findByStudentId(id).
                orElseThrow(() -> new StorageFileNotFoundException("File not found with id " + id));
    }

    public Optional<RapportStage> getRapport(Long id) {
        return rapportStageRepository.findByStudentId(id);
    }
}
