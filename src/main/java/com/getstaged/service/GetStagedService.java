package com.getstaged.service;

import com.getstaged.domain.*;
import com.getstaged.exception.AppException;
import com.getstaged.repository.CredentialRepository;
import com.getstaged.repository.RoleRepository;
import com.getstaged.repository.UserRepository;
import com.getstaged.security.RoleName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class GetStagedService {


    @Autowired
    private OfferService offerService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CredentialRepository credentialRepository;

    @Transactional
    public void getStaged(){

        // Save Role
        Role role = new Role(RoleName.ROLE_USER);
        if(roleService.existRoleName(role)){
            roleService.saveRole(role);
            roleService.saveRole(new Role(RoleName.ROLE_ADMIN));
            roleService.saveRole(new Role(RoleName.ROLE_COORDINATOR));
            roleService.saveRole(new Role(RoleName.ROLE_ANONYMOUS));
            roleService.saveRole(new Role(RoleName.ROLE_ENTERPRISE));
            roleService.saveRole(new Role(RoleName.ROLE_REPRESENTATIVE));
            roleService.saveRole(new Role(RoleName.ROLE_STUDENT));
            roleService.saveRole(new Role(RoleName.ROLE_MONITOR));
            roleService.saveRole(new Role(RoleName.ROLE_SUPERVISOR));
        }

        if (!credentialRepository.existsByEmail("admin@getstaged.com")){
            User user = null;
            Role roleEntity = null;
            user = new Coordinator(new Credential("admin@getstaged.com", "admin1"),
                    new Address("", "", "", "", ""), "Ivan",
                    "Nguemegne");

            roleEntity = roleRepository.findByName(RoleName.ROLE_COORDINATOR)
                    .orElseThrow(() -> new AppException("Coordinator Role not set."));
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new AppException("User Role not set."));
            user.getCredential().setPassword(passwordEncoder.encode(user.getCredential().getPassword()));
            user.setCreatedBy(user.getCredential().getEmail());
            user.getRoles().add(userRole);
            user.getRoles().add(roleEntity);
            userService.saveUserAddress(user.getAddress());
            userService.saveUserCredential(user.getCredential());
            User result = userService.saveUser(user);
        }

       /* boolean active = true;
        Long enterpriseId = new Long(2);

        Offer o1 = new Offer();
        o1.setTitrePoste("Programmeur JAVA (Spring)");
        o1.setDescriptionMandat("Une formation collégiale en informatique Compétence de base en analyse de données");
        o1.setExigences("Parler français ou anglais");
        o1.setTauxHoraire(new Double(20));
        o1.setNombrePoste(3);
        o1.setDuree(11);
        o1.setEntrepriseID(enterpriseId);
        o1.setActive(active);
        o1.setValid(false);
        o1.setCreatedBy("ALLO");

        Offer o2 = new Offer();
        o2.setTitrePoste("Programmeur PHP junior");
        o2.setDescriptionMandat("Conception d’interfaces et amélioration de l’expérience utilisateur");
        o2.setTauxHoraire(21.5);
        o2.setNombrePoste(4);
        o2.setDuree(10);
        o2.setExigences("Connaissance en PHP Parler et écrire en anglais.");
        o2.setActive(active);
        o2.setEntrepriseID(enterpriseId);
        o2.setCreatedBy("ALLO");

        Offer o3 = new Offer();
        o3.setTitrePoste("Programmeur C#");
        o3.setDescriptionMandat("Développement en backend sur une collection de données (Cloud).");
        o3.setExigences("Connaissances en dot.NET Être un ultra-Microsoft Parler français ou anglais");
        o3.setNombrePoste(2);
        o3.setDuree(10);
        o3.setTauxHoraire(32);
        o3.setActive(true);
        o3.setEntrepriseID(enterpriseId);
        o3.setCreatedBy("ALLO");

        Offer o4 = new Offer();
        o4.setTitrePoste("Programmeur Kotlin junior");
        o4.setDescriptionMandat("Développpement d'un site transactionnel fonctinnel");
        o4.setExigences("Parler français ou anglais");
        o4.setNombrePoste(1);
        o4.setTauxHoraire(20);
        o4.setDuree(10);
        o4.setActive(active);
        o4.setEntrepriseID(enterpriseId);
        o4.setCreatedBy("ALLO");

        Offer o5 = new Offer();
        o5.setTitrePoste("Programmeur Delphi");
        o5.setDescriptionMandat("Mise à jour du site web et analyse des résultats (Google Analytics) ");
        o5.setExigences("Connaissances en sécurité informatique SSL (atout)");
        o5.setNombrePoste(6);
        o5.setTauxHoraire(10);
        o5.setDuree(10);
        o5.setActive(active);
        o5.setEntrepriseID(enterpriseId);
        o5.setCreatedBy("ALLO");

        Offer o6 = new Offer();
        o6.setTitrePoste("Programmeur React");
        o6.setDescriptionMandat("Conception d'une iterface multi-utilisateur efficace et legit.");
        o6.setExigences("JavaScript, JSON, HTML5 et CSS Gestion de serveur Linux (atout)");
        o6.setNombrePoste(6);
        o6.setTauxHoraire(10);
        o6.setDuree(10);
        o6.setActive(active);
        o6.setEntrepriseID(enterpriseId);
        o6.setCreatedBy("ALLO");

        offerService.saveOffer(o1);
        offerService.saveOffer(o2);
        offerService.saveOffer(o3);
        offerService.saveOffer(o4);
        offerService.saveOffer(o5);
        offerService.saveOffer(o6);

        /*List<Offer> offers = offerService.findAll();

        List<Offer> offersJava = offerService.findByPositionIgnoreCaseContainingOrderByPosition("jav");
        for (Offer o: offersJava){
            logger.info(o.toString());
        }*/



    }
}
