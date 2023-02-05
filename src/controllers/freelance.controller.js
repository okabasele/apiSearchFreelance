const Freelance = require("../models/freelance.model");
const User = require("../models/user.model");
const Job = require("../models/job.model");
const Skill = require("../models/skill.model");

exports.register = async (req, res, next) => {
  try {
    //Verifier que l'utilisateur n'existe pas et que le job id et skills id existent
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) {
      return next(new Error("User already exists"));
    }
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
    //création de l'utilisateur
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      postcode: req.body.postcode,
      phone: req.body.phone,
    });
    const newUserToSave = await newUser.save();

    //création du freelance
    const newFreelance = new Freelance({
      dailyWage: req.body.dailyWage,
      yearsExp: req.body.yearsExp,
      skills: foundSkills,
      job: foundJob._id,
      user: newUserToSave._id,
    });

    const newFreelanceToSave = await newFreelance.save();
    return res.send(newFreelanceToSave);
  } catch (err) {
    return next(err);
  }
};
