const Skill = require("../models/skill.model");

exports.createSkill = async (req, res, next) => {
  try {
    //Verifier que le skill n'existe pas
    const nameToLowercase = req.body.name.toLowerCase();

    const foundSkill = await Skill.findOne({ name: nameToLowercase });
    if (foundSkill) {
      return next(new Error(`Skill with name ${nameToLowercase} already exists`));
    }
    //Création du skill
    const newSkill = new Skill({
      name: nameToLowercase,
    });
    await newSkill.save();
    res.send(newSkill);
  } catch (error) {
    return next(error);
  }
};

exports.getAllSkills = async (req, res, next) => {
  try {
    const allSkills = await Skill.find();
    return res.send(allSkills);
  } catch (error) {
    return next(error);
  }
};

exports.getSkill = async (req, res, next) => {
  try {
    const foundSkill = await Skill.findById(req.params.id);
    if (!foundSkill) {
      return next(new Error("User not found"));
    }
    res.send(foundSkill);
  } catch (error) {
    return next(error);
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedSkill) {
      return next(new Error("User not found"));
    }
    res.send(updatedSkill);
  } catch (error) {
    return next(error);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return next(new Error("User not found"));
    }
    res.send({ deletedSkill });
  } catch (error) {
    return next(error);
  }
};
