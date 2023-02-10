const Company = require("../models/company.model");
const Mission = require("../models/mission.model");
const Job = require("../models/job.model");
const Skill = require("../models/skill.model");
const Freelance = require("../models/freelance.model");
const { sendMail } = require("../utils/sendMail");

const Status = {
  Pending: "pending",
  Confirmed: "confirmed",
};

const Answer = {
  Yes: "yes",
  No: "no",
};

exports.createMission = async (req, res, next) => {
  try {
    if (req.userToken.isAdmin) {
      return next("Only companies can create missions.");
    }
    //Trouver l'entreprise qui a crée la mission
    const foundCompany = await Company.findOne({ user: req.userToken.id });

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
      company: foundCompany._id,
    });

    const newMissionToSave = await newMission.save();

    //ajouter la mission a l'entreprise
    foundCompany.missions.push(newMissionToSave._id);
    await foundCompany.save();

    return res.send({ mission: newMissionToSave });
  } catch (error) {
    next(error);
  }
};

exports.addCandidatesToMission = async (req, res, next) => {
  try {
    //Verifier que la mission existe
    const foundMission = await Mission.findById(req.params.id)
      .populate({ path: "job", select: "name" })
      .populate({
        path: "company",
        select: "name",
      });
    if (!foundMission) {
      return next(
        new Error(`Mission with id ${req.params.id} does not exist.`)
      );
    }
    //Verifier que la mission est ouverte
    if (!foundMission.isOpen) {
      return next(new Error(`Mission with id ${req.params.id} is closed.`));
    }

    //Créer un Set avec des id uniques pour éviter les doublons
    const uniqueCandidatesIdsSet = new Set(req.body.candidates);
    const uniqueCandidatesIds = Array.from(uniqueCandidatesIdsSet);

    //Verifier s'il y a de la place dans la mission
    const availablePlace = 3 - foundMission.candidates.length;

    //Verifier si le tableau candidates n'est pas à 3
    if (uniqueCandidatesIds.length > availablePlace) {
      return next(
        new Error(
          `Mission with id ${req.params.id} only have ${availablePlace} remaining applications.`
        )
      );
    }

    //Verifier les candidats deja presents dans la mission
    const candidatesAlreadyInMission = [];
    const isCandidatAlreadyInMission = foundMission.candidates.some(
      ({ freelance }) => {
        const isAlreadyInMission = uniqueCandidatesIds.includes(
          freelance.toString()
        );
        if (isAlreadyInMission) {
          candidatesAlreadyInMission.push(freelance.toString());
        }
        return isAlreadyInMission;
      }
    );
    if (isCandidatAlreadyInMission) {
      return next(
        new Error(
          `Mission with id ${
            req.params.id
          } already have the candidates ${candidatesAlreadyInMission.join(
            " and "
          )}.`
        )
      );
    }
    //Verifier le tableau d'id des freelances a ajouter
    const candidatesPromises = uniqueCandidatesIds.map(async (freelanceId) => {
      try {
        const foundFreelance = await Freelance.findById(freelanceId).populate({
          path: "user",
          select: "email",
        });
        if (!foundFreelance) {
          throw new Error(`freelance with id ${freelanceId} does not exist.`);
        }
        //return foundFreelance._id;
        return { freelance: foundFreelance, status: Status.Pending };
      } catch (error) {
        throw error;
      }
    });

    const foundFreelances = await Promise.all(candidatesPromises);

    foundMission.candidates = foundFreelances.map((foundFreelance) => ({
      freelance: foundFreelance.freelance._id,
      status: foundFreelance.status,
    }));

    await foundMission.save();

    //Envoyer les mails aux candidats et à l'entreprise qui a crée la mission
    foundFreelances.forEach(({ freelance }) =>
      sendMail(
        freelance.user.email,
        `Proposition d'offre pour le poste de ${foundMission.job.name}`,
        `L'entreprise ${foundMission.company.name} souhaite vous proposez le poste de ${foundMission.job.name}.`
      )
    );
    res.send(foundMission);
  } catch (error) {
    next(error);
  }
};

exports.answerToMission = async (req, res, next) => {
  try {
    //Verifier que la mission existe
    const foundMission = await Mission.findById(req.params.id)
      .populate({ path: "job", select: "name" })
      .populate({
        path: "company",
        select: "name",
      });

    if (!foundMission) {
      throw new Error(`Mission with id ${foundMission._id} does not exist.`);
    }
    //Récuperer le freelance
    const allFreelances = await Freelance.find().populate({
      path: "user",
      select: ["_id", "firstname", "lastname"],
    });
    const foundFreelance = allFreelances.find((freelance) => {
      if (freelance.user._id.toString() === req.userToken.id) {
        return freelance;
      }
      return;
    });

    if (!foundFreelance) {
      throw new Error(
        `Freelance with user id ${req.userToken.id} does not exist.`
      );
    }

    //Vérifier si le freelance est dans la mission
    const isCandidatAlreadyInMission = foundMission.candidates.some(
      ({ freelance }) => freelance.toString() === foundFreelance._id.toString()
    );

    if (!isCandidatAlreadyInMission) {
      throw new Error(
        `Freelance with id ${foundFreelance._id} is not in Mission with id ${foundMission._id}.`
      );
    }
    //Verifier si le freelance a déja répondu
    const isCandidatAlreadyAnswered = foundMission.candidates.some(
      ({ freelance, status }) =>
        freelance.toString() === foundFreelance._id.toString() &&
        status === Status.Confirmed
    );
    if (isCandidatAlreadyAnswered) {
      throw new Error(
        `Freelance with id ${foundFreelance._id} already answered to Mission with id ${foundMission._id}.`
      );
    }
    if (req.body.answer.toLowerCase() === Answer.Yes) {
      //Si le candidat accepte, on change le status
      foundMission.candidates = foundMission.candidates.map(
        ({ freelance, status }) => {
          if (freelance.toString() === foundFreelance._id.toString()) {
            return { freelance, status: Status.Confirmed };
          }
          return { freelance, status };
        }
      );
      //On sauvegarde le changement
      await foundMission.save();

      //On notifie l'entreprise de la réponse du candidat
      const foundCompany = await Company.findById(
        foundMission.company
      ).populate({
        path: "user",
        select: "email",
      });
      await sendMail(
        foundCompany.user.email,
        `Réponse d'un candidat pour la mission ${foundMission.title}`,
        `Le candidat ${foundFreelance.user.firstname} ${foundFreelance.user.lastname} a accepté l'offre de la mission ${foundMission.title}`
      );
    } else if (req.body.answer.toLowerCase() === Answer.No) {
      //Si le candidat refuse, on le supprime de la mission
      foundMission.candidates = foundMission.candidates.filter(
        ({ freelance }) =>
          freelance.toString() !== foundFreelance._id.toString()
      );
      //On sauvegarde le changement
      await foundMission.save();

      //On notifie l'entreprise de la réponse du candidat
      const foundCompany = await Company.findById(
        foundMission.company
      ).populate({
        path: "user",
        select: "email",
      });
      await sendMail(
        foundCompany.user.email,
        `Réponse d'un candidat pour la mission ${foundMission.title}`,
        `Malheureusement, le candidat ${foundFreelance.user.firstname} ${foundFreelance.user.lastname} a refusé l'offre de la mission ${foundMission.title}`
      );
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

exports.closeMission = async (req, res, next) => {
  try {
    //Verifier que la mission existe
    const foundMission = await Mission.findById(req.params.id);
    if (!foundMission) {
      return next(
        new Error(`Mission with id ${req.params.id} does not exist.`)
      );
    }
    //Verifier que la mission est ouverte
    if (!foundMission.isOpen) {
      return next(
        new Error(`Mission with id ${req.params.id} is already closed.`)
      );
    }
    foundMission.isOpen = false;
    await foundMission.save();
    return res.send({
      message: `Mission with id ${req.params.id} is closed successfully.`,
      mission: foundMission,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllMissions = async (req, res, next) => {
  try {
    const allMisions = await Mision.find()
      .populate({ path: "skills", select: "name" })
      .populate({ path: "job", select: "name" })
      .populate({ path: "candidates", select: ["firstname", "lastname"] });
    return res.send(allMisions);
  } catch (error) {
    return next(error);
  }
};

exports.getMission = async (req, res, next) => {
  try {
    //Recuperer l'entreprise qui a crée la mission
    const foundCompany = await Company.findOne().populate({
      path: "missions",
      select: "_id",
      match: { _id: { $eq: req.params.id } },
    });
    //Si c'est pas l'admin ou l'entreprise qui a crée la mission on renvoie une erreur
    if (
      !req.userToken.isAdmin &&
      foundCompany.user._id.toString() !== req.userToken.id
    ) {
      return next(new Error("Not authorized."));
    }
    const foundMission = await Mission.findById(req.params.id);
    if (!foundMission) {
      return next(new Error("Mission not found"));
    }
    res.send(foundMission);
  } catch (error) {
    return next(error);
  }
};

exports.updateMission = async (req, res, next) => {
  try {
    //Recuperer l'entreprise qui a crée la mission
    const foundCompany = await Company.findOne().populate({
      path: "missions",
      select: "_id",
      match: { _id: { $eq: req.params.id } },
    });
    //Si c'est pas l'admin ou l'entreprise qui a crée la mission on renvoie une erreur
    if (
      !req.userToken.isAdmin &&
      foundCompany.user._id.toString() !== req.userToken.id
    ) {
      return next(new Error("Not authorized."));
    }
    const updatedMission = await foundMission.update(req.params.id, req.body);
    if (!updatedMission) {
      return next(new Error("Mission not found"));
    }
    res.send(updatedMission);
  } catch (error) {
    return next(error);
  }
};

exports.deleteMission = async (req, res, next) => {
  try {
    //Si c'est pas l'admin ou l'entreprise qui a crée la mission on renvoie une erreur
    if (
      !req.userToken.isAdmin &&
      foundCompany.user._id.toString() !== req.userToken.id
    ) {
      return next(new Error("Not authorized."));
    }
    //Supprimer la mission
    const deletedMission = await Mission.findByIdAndDelete(req.params.id);
    if (!deletedMission) {
      return next(new Error("Mission not found"));
    }
    //Supprimer la mission de l'entreprise
    const deleteFromCompany = await Company.findById(deletedMission.company);
    deleteFromCompany.missions = deleteFromCompany.missions.filter(
      ({ _id }) => _id.toString() !== req.params.id
    );
    deleteFromCompany.save();

    res.send({ deletedMission });
  } catch (error) {
    return next(error);
  }
};
