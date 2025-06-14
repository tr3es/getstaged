package com.getstaged;

import com.getstaged.service.GetStagedService;
import com.getstaged.storage.StorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import com.getstaged.storage.StorageService;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
@EntityScan(basePackageClasses = {
        GetStagedApplication.class,
        Jsr310JpaConverters.class
})
public class GetStagedApplication {
    @PostConstruct
    void init(){
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GetStagedApplication.class, args);
    }

    @Autowired
    GetStagedService getStagedService;

    @Autowired
    StorageService storageService;

    @Bean
    CommandLineRunner init (StorageService storageService){
        return (args) -> {
            storageService.init();
            getStagedService.getStaged();
        };
    }
}
