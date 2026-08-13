
import patientService from "./patient.service.js";

class PatientController {
  async create(req, res, next) {
    try {
      const patient = await patientService.create({
        ...req.body,
        doctor: req.user._id,
      });

      res.status(201).json({
        success: true,
        message: "Patient created successfully.",
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

async getAll(req, res, next) {
  try {
    const patients = await patientService.getAll(
      req.user,
      req.query.search
    );

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
}

//   async getById(req, res, next) {
//     try {
//       const patient = await patientService.findById(req.params.id);

//       res.status(200).json({
//         success: true,
//         data: patient,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

  async getById(req, res, next) {
  try {
    const data = await patientService.getById(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async update(req, res, next) {
  try {
    const patient =
      await patientService.update(
        req.params.id,
        req.body,
        req.user
      );

    return res.status(200).json({
      success: true,
      message:
        "Patient updated successfully.",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

async delete(req, res, next) {
  try {
    await patientService.delete(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

async getDashboardStats(req, res, next) {
  try {
    const stats = await patientService.getDashboardStats(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

}

export default new PatientController();