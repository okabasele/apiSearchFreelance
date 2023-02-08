const Company = require("../models/company.model");
const Mission = require("../models/mission.model");
const Job = require("../models/job.model");
const Skill = require("../models/skill.model");

exports.createMission = async (req, res, next) => {
  try {
    //Verifier que le Job id et les Skills id existent
    const foundJob = await Job.findById(req.body.job);
    if (!foundJob) {
      return next(new Error(`Job with id ${req.body.job} does not exist.`));
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

    //création de la mission
    const newMission = new Mission({
      beginsAt: req.body.beginsAt,
      endsAt: req.body.endsAt,
      totalWage: req.body.totalWage,
      title: req.body.title,
      description: req.body.description,
      skills: foundSkills,
      job: foundJob._id,
    });

    const newMissionToSave = await newMission.save();

    //ajouter la mission a l'entreprise
    if (req.userToken.role == "company") {
      const foundCompany = await Company.findOne({ user: req.userToken.id });
      foundCompany.missions.push(newMissionToSave._id);
      await foundCompany.save();
    }
    return res.send({ mission: newMissionToSave, creator: req.userToken.id });
  } catch (error) {
    next(error);
  }
};

exports.addCandidateToMission = async (req, res, next) => {
  try {
    //Verifier l'id de l'utilisateur
    //Verifier que la mission est ouverte
    //Verifier si le tableau candidate n'est pas à 3
    //Si oui on renvoie une erreur
    //Sinon on ajoute l'id de l'utilisateur
  } catch (error) {
    next(error);
  }
};
