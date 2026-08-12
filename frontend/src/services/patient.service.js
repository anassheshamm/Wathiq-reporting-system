import api from "./api";

const patientService = {
  // ===========================
  // Get All Patients (With Search)
  // ===========================
  async getAllPatients(search = "") {
    const queryString = search ? `?search=${search}` : "";
    const response = await api.get(`/patients${queryString}`);
    return response.data;
  },

  // ===========================
  // Get Patients (Used by Team Leader / Dashboard)
  // ===========================
  getPatients(search = "") {
    const queryString = search ? `?search=${search}` : "";
    return api.get(`/patients${queryString}`);
  },

  // ===========================
  // Get Dashboard Stats
  // ===========================
  getDashboardStats() {
    return api.get("/patients/dashboard");
  },

  // ===========================
  // Get Patient By ID
  // ===========================
  async getPatientById(id) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // ===========================
  // Create Patient
  // ===========================
  async createPatient(form) {
    const payload = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      nationalId: form.nationalId,
      gender: form.gender,
      nationality: form.nationality,
      occupation: form.occupation,
      maritalStatus: form.maritalStatus,
      dateOfBirth: form.dateOfBirth,
      phone: form.phone,
      alternativePhone: form.alternativePhone,
      emergencyContactPhone: form.emergencyContactPhone,
      emergencyContactRelation: form.emergencyContactRelation,
      email: form.email,
      address: form.address,
    };

    console.log("Patient Payload:", payload);

    const response = await api.post("/patients", payload);
    return response.data;
  },

  // ===========================
  // Update Patient
  // ===========================
  async updatePatient(id, form) {
    const payload = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      nationalId: form.nationalId,
      gender: form.gender,
      nationality: form.nationality,
      occupation: form.occupation,
      maritalStatus: form.maritalStatus,
      dateOfBirth: form.dateOfBirth,
      phone: form.phone,
      alternativePhone: form.alternativePhone,
      emergencyContactPhone: form.emergencyContactPhone,
      emergencyContactRelation: form.emergencyContactRelation,
      email: form.email,
      address: form.address,
    };

    const response = await api.patch(`/patients/${id}`, payload);
    return response.data;
  },

  // ===========================
  // Delete Patient
  // ===========================
  async deletePatient(id) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

export default patientService;   