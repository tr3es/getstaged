package com.getstaged.service;

import com.getstaged.domain.*;
import com.getstaged.repository.CVRepository;
import com.getstaged.repository.EntenteStageRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

public class DBFileStorageServiceTest {

    @InjectMocks
    DBFileStorageService dbFileStorageService;

    @Mock
    CVRepository cvRepository;

    @Mock
    EntenteStageRepository ententeStageRepository;

    @Before
    public void setUp() throws Exception {

        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void storeCV() {
        Long id = 1000L;
        byte[] temp = new byte[0] ;
        CV cv01 = new CV(id,"Test", "test@gmail.com","test_file",
                "file", temp,  "");
        when(dbFileStorageService.storeCV(cv01, "dsada.pdf")).thenReturn(cv01);
        CV cv02 = dbFileStorageService.storeCV(cv01, "dsada.pdf");
        assertSame(cv01, cv02);
    }

    @Test
    public void getCV() {
        Long id = 1000L;
        byte[] temp = new byte[0] ;
        CV cv01 = new CV(id,"Test", "test@gmail.com","test_file",
                "file", temp,  "");
        when(cvRepository.save(cv01)).thenReturn(cv01);
        assertSame(cvRepository.save(cv01), cv01);
    }

    @Test
    public void getEntente() {
        Long id = 1000L;
        byte[] temp = new byte[0] ;
        EntenteStage entente01 = new EntenteStage(new Student(new Credential("",""),new Address("","","","",""), "", ""), "","",new byte[0], "test@gmail.com");
        when(ententeStageRepository.save(entente01)).thenReturn(entente01);
        EntenteStage ententeStage02 = ententeStageRepository.save(entente01);
        assertSame(entente01, ententeStage02);
    }
}