export const API_BASE_URL = 'http://localhost:5000/api';
export const API_BASE_URL_DOWNLOAD = 'http://localhost:5000/api/users/download/';
export const API_BASE_URL_DOWNLOAD_ENTENTE = 'http://localhost:5000/api/students/ententeStage/';
export const ACCESS_TOKEN = 'accessToken';

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const ENTERPRISE_NAME_MIN_LENGTH = 4;
export const ENTERPRISE_NAME_MAX_LENGTH = 60;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const VALIDATION_SUCCESS = 'success';
export const TEXT_REQUEST_ERROR_COMMON = "Veuillez patienter... \nIl se peut que nous\n éprouvons des problèmes.";
export const TEXT_REQUEST_ERROR_TRYAGAIN = "Pardon! Quelque chose s'est mal passé. Veuillez réessayer!";
export const ERROR_EMAIL_ALREADY_REGISTER = "Cet e-mail est déjà enregistré";
export const ERROR_CONFIRM_PASSWORD = "Ces mots de passe ne se correspondent pas. Veuillez réessayer!";

// Champ formulaire SignUp
export const CHAMP_NOM = 'Nom';
export const CHAMP_NOM_ENTERPRISE = 'Nom de l\'entreprise';
export const CHAMP_PRENOM = 'Prénom';
export const CHAMP_EMAIL = 'Nouvel e-mail';
export const CHAMP_PASSWORD = "Mot de passe";
export const CHAMP_PASSWORD_DESCRIPTION = 'Mot de passe entre 6 à 20 charactères';
export const CHAMP_CONFIRM_PASSWORD = 'Confirmer le mot de passe';
export const CHAMP_TYPE_SCHOOL = "École";
export const CHAMP_TYPE_ENTERPRISE = "Entreprise";
export const CHAMP_ALREADY_REGISTER = " déjà enregistré ?";


// Status
export const STATUS_NONE = 'none';
export const STATUS_EN_APPROBATION = 'En approbation';
export const STATUS_APPROUVEE = 'Approuvé';

// Type formulaire
export const TYPE_FORM_SCHOOL = 'school';
export const TYPE_FORM_STUDENT= 'student';
export const TYPE_FORM_ENTERPRISE = 'entreprise';
export const TYPE_FORM_MONITOR = 'monitor';
export const TYPE_FORM_COORDINATOR = 'coordinator';

// Offers constants
export const MAX_CREATE_OFFERS = 3;
export const OFFER_LIST_SIZE = 20;

export const STUDENT_LIST_SIZE = 20;

export const STAGE_LIST_SIZE = 20;

export const APPLICATION_NAME = 'GetStaged';
export const PROGRAMME_MIN_LENGTH = 1;
export const PROGRAMME_MAX_LENGTH = 30;
export const PERIODE_MIN_SEMAINES_STAGE = 50;
export const DUREE_MIN_SEMAINES_STAGE = 11;
export const LONGUEUR_MIN_TITRE_POSTE = 4;
export const LONGUEUR_MAX_TITRE_POSTE = 30;
export const NOMBRE_POSTE_LENGTH = 3;
export const LONGUEUR_MIN_TAUX_HORAIRE = 1;
export const LONGUEUR_MIN_DESCRIPTION_MANDAT = 0;
export const LONGUEUR_MAX_DESCRIPTION_MANDAT = 300;
export const LONGUEUR_MIN_EXIGENCES = 0;
export const LONGUEUR_MAX_EXIGENCES = 300;
export const LONGUEUR_MAX_PERIODE = 50;

export const NOMBRE_QUESTIONS = 4;
export const NOMBRE_QUESTIONS_CHAMP_1 = 5;
export const NOMBRE_QUESTIONS_CHAMP_2 = 5;
export const NOMBRE_QUESTIONS_CHAMP_3 = 6;
export const NOMBRE_QUESTIONS_CHAMP_4 = 6;
export const NOMBRE_CHOIX_RECAP = 5;

export const TITRE_1 = "1. PRODUCTIVITÉ";
export const TITRE_2 = "2. QUALITÉ DU TRAVAIL";
export const TITRE_3 = "3. QUALITÉ DES RELATIONS INTERPERSONELLES";
export const TITRE_4 = "4. HABILETÉS PERSONELLES";
export const SOUS_TITRE_1 = "Capacité d'optimiser son rendement au travail";
export const SOUS_TITRE_2 = "Capacité de s'acquiter des tâches sous sa "+
"responsabilité en s'imposant personellement des normes de qualité";
export const SOUS_TITRE_3 = "Capacité d'établir des interrelations harmonieuses dans son milieu de travail";
export const SOUS_TITRE_4 = "Capacité de faire preuve d'attitudes ou de comportements matures et responsables";

export const QUESTION_1_A = 'planifier et organiser son travail de façon efficace';
export const QUESTION_1_B = 'comprendre rapidement les directives relatives à son travail';
export const QUESTION_1_C = 'maintenir un rythme de travail soutenu';
export const QUESTION_1_D = 'établir ses priorités';
export const QUESTION_1_E = 'respecter ses échéances';
export const QUESTION_2_A = 'respecter les mandats qui lui ont été confiés';
export const QUESTION_2_B = 'porter attention aux détails dans la réalisation de ses tâches';
export const QUESTION_2_C = "vérifier son travail, s'assurer que rien n'a été oublié";
export const QUESTION_2_D = 'rechercher des occasions de se perfectionner';
export const QUESTION_2_E = 'faire une bonne analyse des problèmes rencontrés';
export const QUESTION_3_A = 'établir facilement des contacts avec les gens';
export const QUESTION_3_B = "contribuer activement au travail d'équipe";
export const QUESTION_3_C = "s'adapter facilement à la culture de l'entreprise";
export const QUESTION_3_D = "accepter les critiques constructives";
export const QUESTION_3_E = "être respectueux envers les gens";
export const QUESTION_3_F = "faire preuve d'écoute active en essayant de comprendre le point de vue de l'autre";
export const QUESTION_4_A = "démontrer de l'intérêt et de la motivation au travail";
export const QUESTION_4_B = "exprimer clairement ses idées";
export const QUESTION_4_C = "faire preuve d'initiative";
export const QUESTION_4_D = "travailler de façon sécuritaire";
export const QUESTION_4_E = "démontrer un bon sens des responsabilités ne requérant qu'un minimum de supervision";
export const QUESTION_4_F = "être ponctuel et assidu à son travail";

export const TITRE_RECAP = "APPRÉCIATION GLOBALE DU STAGIAIRE";
export const CHOIX_RECAP_4 = "Les habiletés démontrées dépassent de beaucoup les attentes";
export const CHOIX_RECAP_3 = "Les habiletés démontrées dépassent les attentes";
export const CHOIX_RECAP_2 = "Les habiletés démontrées répondent pleinement aux attentes";
export const CHOIX_RECAP_1 = "Les habiletés démontrées répondent partiellement aux attentes";
export const CHOIX_RECAP_0 = "Les habiletés démontrées ne répondent pas aux attentes";
export const PRECISION_RECAP = "PRÉCISEZ VOTRE APPRÉCIATION: ";
export const PRECISION_DETAILS = "Précisions sur l'appréciation du stagiaire: "
export const DISCUSSION_RECAP = "Cette évaluation a été discutée avec le stagiaire: ";
export const NBHEURESRECAP = "Veuillez indiquer le nombre d'heures réel par semaine d'encadrement accordé au stagiaire: ";

export const TITRE_OUVERTURE = "L'ENTREPRISE AIMERAIT ACCUEILLIR CET ÉLÈVE POUR SON PROCHAIN STAGE: ";
export const QUESTION1_OUVERTURE = "La formation technique du stagiaire était-elle suffisante pour accomplir le mandat de stage?";
export const ATTESTATION_COUVERTURE = "J'atteste que les informations présentes sont correctes.";
export const COMMENTAIRE_MIN_LENGTH = 10;
export const COMMENTAIRE_MAX_LENGTH = 300;
export const FORMATION_MIN_LENGTH = 3;

export const NONAPPLICABLE = "*N/A = non applicable";
export const TITRE_FORMULAIRE = "FICHE D'ÉVALUATION DU STAGIAIRE";
export const NOMELEVE = "Nom de l'élève: ";
export const NOMPROGRAMME = "Programme d'études: ";
export const NOMENTREPRISE = "Nom de l'entreprise: ";
export const NOMSUPERVISEUR = "Non du superviseur: ";
export const FONCTION = "Fonction: ";
export const TELEPHONE = "Téléphone: ";
export const INDICATIONAIDE = "Veuillez cocher les comportements obeservés chez le stagiaire et formuler des commentaires s'il y a lieu.";
export const INDICATIONAIDE2 = "N/A = non applicable";

export const TITRE_VUE_EVAL = "Page de détail d'une évaluation";
export const TITRE_PDF_EVAL = "FICHE D'ÉVALUATION DU STAGIAIRE";
export const HEADER_PDF_EVAL = "Alternance Travail-études";
