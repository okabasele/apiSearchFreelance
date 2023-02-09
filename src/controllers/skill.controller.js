const Skill = require("../models/skill.model");

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
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body
    );
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
    res.send({deletedSkill});
  } catch (error) {
    return next(error);
  }
};
