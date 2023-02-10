const Job = require("../models/job.model");

exports.createJob = async (req, res, next) => {
  try {
    //Verifier que le job n'existe pas
    const nameToLowercase = req.body.name.toLowerCase();

    const foundJob = await Job.findOne({ name: nameToLowercase });
    if (foundJob) {
      return next(new Error(`Job with name ${nameToLowercase} already exists`));
    }

    //Tableau de promesses
    const skillsPromises = req.body.skills.map(async (skillId) => {
      try {
        const foundSkill = await Skill.findById(skillId);
        if (!foundSkill) {
          throw new Error(`Skill with id ${skillId} does not exist.`);
        }
        return foundSkill._id;
      } catch (error) {
        throw error;
      }
    });

    const foundSkills = await Promise.all(skillsPromises);
    //Création du job
    const newJob = new Job({
      name: nameToLowercase,
      skills: foundSkills,
    });
    await newJob.save();
    res.send(newJob);
  } catch (error) {
    return next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const allJobs = await Job.find();
    return res.send(allJobs);
  } catch (error) {
    return next(error);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const foundJob = await Job.findById(req.params.id);
    if (!foundJob) {
      return next(new Error("User not found"));
    }
    res.send(foundJob);
  } catch (error) {
    return next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedJob) {
      return next(new Error("User not found"));
    }
    res.send(updatedJob);
  } catch (error) {
    return next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return next(new Error("User not found"));
    }
    res.send({ deletedJob });
  } catch (error) {
    return next(error);
  }
};
