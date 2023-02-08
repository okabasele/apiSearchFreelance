const Company = require("../models/company.model");
const Mission = require("../models/mission.model");
const Job = require("../models/job.model");
const Skill = require("../models/skill.model");
const Freelance = require("../models/freelance.model");

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

exports.addCandidatesToMission = async (req, res, next) => {
  try {
    //Verifier que la mission existe
    const foundMission = await Mission.findById(req.params.id);
    if (!foundMission){
      return next(new Error(`Mission with id ${req.params.id} does not exist.`));
    }
    //Verifier que la mission est ouverte
    if (!foundMission.isOpen){
      return next(new Error(`Mission with id ${req.params.id} is closed.`));     
    }

    
    //Créer un Set avec des id uniques pour éviter les doublons
    const uniqueCandidatesIdsSet = new Set(req.body.candidates);
    const uniqueCandidatesIds = Array.from(uniqueCandidatesIdsSet);

    //Verifier s'il y a de la place dans la mission
    const availablePlace = 3- foundMission.candidates.length;    

    //Verifier si le tableau candidates n'est pas à 3
    if (uniqueCandidatesIds.length > availablePlace){
      return next(new Error(`Mission with id ${req.params.id} only have ${availablePlace} remaining applications.`));     

    }

    //Verifier les candidats deja presents dans la mission
    const candidatesAlreadyInMission = []
   const isCandidatAlreadyInMission = foundMission.candidates.some((candidateId)=> {
    const isAlreadyInMission = uniqueCandidatesIds.includes(candidateId.toString()) 
    if(isAlreadyInMission) {
      candidatesAlreadyInMission.push(candidateId.toString())
    }
    return isAlreadyInMission
   })
    if (isCandidatAlreadyInMission) {
      return next(new Error(`Mission with id ${req.params.id} already have the candidates ${candidatesAlreadyInMission.join(' and ')}.`));     
    }
    //Verifier le tableau d'id user des freelances a ajouter
    const candidatesPromises = uniqueCandidatesIds.map(async (freelanceId) => {
      try {
        const foundFreelance = await Freelance.findById(freelanceId);
        if (!foundFreelance) {
          throw new Error(`freelance with id ${freelanceId} does not exist.`);
        }
        return foundFreelance._id;
      } catch (error) {
        throw error;
      }
    });

    const foundFreelances = await Promise.all(candidatesPromises);
    foundMission.candidates = foundFreelances;
    await foundMission.save();
    res.send(foundMission)
  } catch (error) {
    next(error);
  }
};