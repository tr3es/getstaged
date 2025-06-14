export function getSampleStage(){
  const stage = {
      offre: {
        offre_ID: {
          value: 1
        },
        entrepriseID: {
          value: 1
        },
        programme: {
          value: 'Informatique'
        },
        periode: {
          value: 'Été 2018'
        },
        duree: {
          value: 12
        },
        titrePoste: {
          value: 'Analyste-Programmeur'
        },
        nombrePoste: {
          value: 2
        },
        horaireTravail: {
          value: '8 a 5 lundi'
        },
        tauxHoraire: {
          value: '12$'
        },
        descriptionMandat: {
          value: 'programmer du web'
        },
        exigences: {
          value: 'ceci est une exigence'
        }
      },
      etudiant: {
        etudiant_id: {
          value: '1'
        },
        adresse:{
          address_id: {
            value: 1
          },
          address: {
            value: '555'
          },
          city: {
            value: 'Lasalle'
          },
          country: {
            value: 'Canada'
          },
          postalCode: {
            value: 'T0T0T0'
          },
          state: {
            value: 'Québec'
          }
        },
        lastName: {
          value: 'Janvier'
        },
        gender: {
          value: 'Homme'
        },
        firstName: {
          value: 'Yann '
        },
        email: {
          value: 'tititoto@email.com'
        }
      },
      entreprise: {
        entreprise_id: {
          value: '1'
        },
        adresse:{
          address_id: {
            value: 2
          },
          address: {
            value: '333'
          },
          city: {
            value: 'Lasalle'
          },
          country: {
            value: 'Canada'
          },
          postalCode: {
            value: 'T0T0T0'
          },
          state: {
            value: 'Québec'
          }
        },
        lastName: {
          value: 'Dubois'
        },
        gender: {
          value: 'Homme'
        },
        firstName: {
          value: 'Patrice'
        },
        email: {
          value: 'patrice@email.com'
        },
        nomEntreprise: {
          value: 'Microsoft Montreal Inc. '
        },
        telephone: {
          value: '514-514-5514'
        }
      }

  }
  return stage;
}
