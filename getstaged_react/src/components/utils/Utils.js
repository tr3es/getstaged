import axios from 'axios';
import {
    API_BASE_URL, ACCESS_TOKEN, OFFER_LIST_SIZE,
    STAGE_LIST_SIZE, STUDENT_LIST_SIZE
} from '../constants/Constants';
import ServiceAxios from "../documents/ServiceAxios";

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

//fonction pour la vue d'une evaluation de STAGE
export function getEvaluation(evaluationID) {
    return request({
        url: API_BASE_URL + "/EvaluationStagiaire/" + evaluationID,
        method: 'GET'
    });
}

export function getPeriode(periodeId) {
    console.log(periodeId);
    return request({
        url: API_BASE_URL + "/offers/Periodes/" + periodeId,
        method: 'GET'
    }).then((response) => {
        console.log(response);

    }).catch(error => {
        console.log(error);
    });
}

export function printablePeriode(periodeId) {
    console.log(periodeId);
    return (
        getPeriode(periodeId)
    ).catch(error => {
        console.log(error);
    });
}

export function studentAcceptedEmail(offerId, studentId) {
    console.log(offerId + " " + studentId);
    return fetch(API_BASE_URL + "/students/acceptedEmail?student=" + studentId + "&offer=" + offerId, {
        method: 'GET'
    }).then((response) => response.json())
        .catch(error => {
            console.log(error);
        });
}

export function ententeSigneeEmail(studentId) {
    return fetch(API_BASE_URL + "/students/ententeSigneeEmail?student=" + studentId, {
        method: 'GET'
    }).then((response) => response.json())
        .catch(error => {
            console.log(error);
        });
}

export function ententeSigneeEmailEntreprise(studentId) {
    return fetch(API_BASE_URL + "/entreprise/ententeSigneeEmail?student=" + studentId, {
        method: 'GET'
    }).then(
        (response) => response.json()
    ).catch(error => {
        console.log(error);
    })
}

// fonctions pour nouvelle offre
export function postOffre(offre) {
    console.log("TEST" + JSON.stringify(offre));
    return request({
        url: API_BASE_URL + "/VotreEntreprise",
        method: 'POST',
        body: JSON.stringify(offre),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
    });
}

export function postStage(studentId, offerId, stage) {
    console.log("TEST" + JSON.stringify(stage));
    return request({
        url: API_BASE_URL + "/students/stage?studentId=" + studentId + "&offerId=" + offerId,
        method: 'POST',
        body: JSON.stringify(stage),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
    });
}

//fonction pour l'EvaluationStagiaire
export function postEval(evaluation) {
    return request({
        url: API_BASE_URL + "/VotreEntreprise/EvaluationStagiaire",
        method: 'POST',
        body: JSON.stringify(evaluation),
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
            window.location.href = "/EvaluationStagiaire/" + response.id;
        }
    );
}

export function postEvalHTML(eval_id, html) {
    return request({
        url: API_BASE_URL + "/createEval/" + eval_id,
        method: 'POST',
        body: JSON.stringify(html),
        redirect: 'follow',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).catch(error => {
        console.log(error);
    });
}

export function downloadEval(eval_id) {
    axios({
        url: API_BASE_URL + '/downloadEval/' + eval_id,
        method: 'GET',
        responseType: 'blob',
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'eval.pdf');
        document.body.appendChild(link);
        link.click();
    })
}

export function downloadCV(student_id, nom) {
    axios({
        url: API_BASE_URL + '/users/download/' + student_id,
        method: 'GET',
        responseType: 'blob',
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'CV_' + nom + '.pdf');
        document.body.appendChild(link);
        link.click();
    })
}

export function postPDF(eval_id) {
    console.log("Test pdf");
    return request({
        url: API_BASE_URL + "/VotreEntreprise/EvalPDF/",
        method: 'POST',
        body: JSON.stringify(eval_id),
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        window.location.href = "/EvaluationStagiaire/1"
    });
}

export function postPeriode(periode) {
    return request({
        url: API_BASE_URL + "/offers/newPeriode",
        method: 'POST',
        body: JSON.stringify(periode),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
    }).catch(error => {
        console.log(console.error());
    })
}

export function updatePeriode(periode) {
    const boolactif = !periode.estActive;
    periode.estActive = boolactif;
    return request({
        url: API_BASE_URL + "/offers/updatePeriode",
        method: 'POST',
        body: JSON.stringify(periode),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
    }).catch(error => {
    })
}

export function studentMarkUpPeriode(studentId, periode) {
    return request({
        url: API_BASE_URL + "/students/periodeAvailable/" + periode.id + "/" + studentId,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
    }).catch(error => {
    })
}

export function studentMarkDownPeriode(studentId, periode) {
    return request({
        url: API_BASE_URL + "/students/periodeUnvailable/" + periode.id + "/" + studentId,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
    }).catch(error => {
    })
}

export function isStudentPeriodeAvailable(studentId, periode) {
    console.log(periode);
    let resp;
    return request({
        url: API_BASE_URL + "/students/isStudentPeriodeAvailable/" + periode + "/" + studentId,
        method: 'GET',
    });
}

export function getAllNotifications(userId) {
    return request({
        url: API_BASE_URL + "/notifications?userId=" + userId,
        method: 'GET'
    });
}

// Functions for offer requests
export function getAllOffers(page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/offers?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllPeriodes(page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/offers/allPeriodes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllPeriodesForStudent(studId, page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/offers/allPeriodesStudent?student=" + studId + "&page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllActivePeriodes(page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/offers/allActivePeriodes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllValidOffers(page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/offers/validOffers?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllValidOffersForStudent(studentId, page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/offers/validOffersForStudent?student=" + studentId + "&page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function validateOffer(id) {
    return request({
        url: API_BASE_URL + "/offers/validateOffer?id=" + id,
        method: 'PUT'
    });
}

export function approveApplyStudent(offerId, studentId) {
    return request({
        url: API_BASE_URL + "/coordinator/approveApply?offerId=" + offerId + "&studentId=" + studentId,
        method: 'PUT'
    });
}

export function refuseApplyStudent(offerId, studentId) {
    return request({
        url: API_BASE_URL + "/coordinator/refuseApply?offerId=" + offerId + "&studentId=" + studentId,
        method: 'PUT'
    });
}

export function getStudentsCoordinator() {
    return request({
        url: API_BASE_URL + "/coordinator/students",
        method: 'GET'
    });
}

export function getMonitorsCoordinator() {
    return request({
        url: API_BASE_URL + "/coordinator/monitors",
        method: 'GET'
    });
}

export function getEnterprisesCoordinator() {
    return request({
        url: API_BASE_URL + "/coordinator/enterprises",
        method: 'GET'
    });
}

export function blockUser(userId) {
    return request({
        url: API_BASE_URL + "/coordinator/blockUser?userId=" + userId,
        method: 'PUT'
    });
}

export function applyOnOffer(studentId, offerId) {
    return request({
        url: API_BASE_URL + "/students/applyOffer?offerId=" + offerId + "&studentId=" + studentId,
        method: 'PUT'
    });
}

// Functions for student requests
export function getAllStudents(page, size) {
    page = page || 0;
    size = size || STUDENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/students?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function checkStudentCvUpload(id) {
    return request({
        url: API_BASE_URL + "/students/checkStudentCvUpload?studentId=" + id,
        method: 'GET'
    });
}

// Functions for supervisors requests
export function getAllSupervisors(page, size) {
    page = page || 0;
    size = size || STUDENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/supervisors?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

// Functions for monitors requests
export function getAllMonitors(page, size) {
    page = page || 0;
    size = size || STUDENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/monitors?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function assignMonitor(studentId, monitorId) {
    return request({
        url: API_BASE_URL + "/students/assignMonitor?monitorId=" + monitorId + "&studentId=" + studentId,
        method: 'PUT'
    });
}

// Functions for enterprise
// Functions for offer requests
export function getAllEntrepriseOffers(page, size) {
    page = page || 0;
    size = size || OFFER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/entreprises/offers?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllEntrepriseStages(page, size) {
    page = page || 0;
    size = size || STAGE_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/entreprise/stages?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function deleteOffer(offerId) {
    return request({
        url: API_BASE_URL + "/offers/" + offerId,
        method: 'DELETE'
    });
}

export function uploadFileToServer(data, email, type) {
    console.log("File " + data.toString(), "Email " + email);
    if (type === "CV") {
        return ServiceAxios.getRestClient().post('/api/users/' + email, data);
    } else if (type === "ENTENTE") {
        return ServiceAxios.getRestClient().post('/api/students/ententeStage/' + email, data);
    } else if (type === "FICHESUIVIE") {
        return ServiceAxios.getRestClient().post('/api/monitors/students/ficheSuivie/' + email, data);
    } else if (type === "RAPPORTVISITE") {
        return ServiceAxios.getRestClient().post('/api/monitors/students/rapportVisite/' + email, data);
    } else if (type == "RAPPORT") {
        return ServiceAxios.getRestClient().post('/api/students/rapportStage/' + email, data);
    }
}

export function uploadFileToServerEntreprise(data, idStudent, type) {
    console.log("File " + data.toString(), "idStudent " + idStudent);
    if (type == "ENTENTE") {
        return ServiceAxios.getRestClient().post('/api/entreprise/ententeStage/' + idStudent, data);
    }
}
