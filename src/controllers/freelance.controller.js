const Freelance = require("../models/freelance.model");
const User = require("../models/user.model");
const Job = require("../models/job.model");
const Skill = require("../models/skill.model");
const { sendMail } = require("../utils/sendMail");

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

    //Envoie de l'email au freelance et à l'admin
    const foundAdmin = await User.findOne({ isAdmin: true });
    sendMail(
      newUser.email,
      "Inscription réussi dans APISEARCHFREELANCE",
      `Bienvenue dans notre application ${newUser.firstname} ${newUser.lastname}.`
    );
    sendMail(
      foundAdmin.email,
      "Inscription d'un freelance",
      `Le freelance ${newUser.email} a crée son compte.`
    );

    return res.send(newFreelanceToSave);
  } catch (err) {
    return next(err);
  }
};

exports.getAllFreelances = async (req, res, next) => {
  try {
    const allFreelances = await Freelance.find()
      .populate({ path: "skills", select: "name" })
      .populate({ path: "job", select: "name" })
      .populate({ path: "user", select: ["firstname", "lastname", "city"] });
    return res.send(allFreelances);
  } catch (error) {
    return next(error);
  }
};

exports.filterFreelances = async (req, res, next) => {
  try {
    const filterArray = req.body.search.toLowerCase().split(" ");

    //Récuperer que les champs utiles
    const allFreelances = await Freelance.find()
      .populate({ path: "skills", select: "name" })
      .populate({ path: "job", select: "name" })
      .populate({ path: "user", select: ["firstname", "lastname", "city"] });

    //Appliquer le filtre
    const filteredFreelances = allFreelances.filter((freelance) => {
      // console.log(freelance.skills.map(skill => skill.name).join(' '))
      return (
        filterArray &&
        (filterArray.includes(
          freelance.skills.map((skill) => skill.name).join(" ")
        ) ||
          filterArray.includes(freelance.job.name) ||
          filterArray.includes(freelance.user.firstname) ||
          filterArray.includes(freelance.user.lastname) ||
          filterArray.includes(freelance.user.city))
      );
    });
    res.send(filteredFreelances);
  } catch (error) {
    return next(error);
  }
};

exports.getFreelance = async (req, res, next) => {
  try {
    const foundFreelance = await Freelance.findById(req.params.id);
    if (!foundFreelance) {
      return next(new Error("User not found"));
    }
    res.send(foundFreelance);
  } catch (error) {
    return next(error);
  }
};

exports.updateFreelance = async (req, res, next) => {
  try {
    const foundFreelance = await Freelance.findById(req.params.id);
    if (
      !req.userToken.isAdmin &&
      req.userToken.id !== foundFreelance.user._id
    ) {
      return next(new Error("Not authorized."));
    }
    const updatedFreelance = await Freelance.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedFreelance) {
      return next(new Error("User not found"));
    }
    res.send(updatedFreelance);
  } catch (error) {
    return next(error);
  }
};

exports.deleteFreelance = async (req, res, next) => {
  try {
    const foundFreelance = await Freelance.findById(req.params.id);
    if (
      !req.userToken.isAdmin &&
      req.userToken.id !== foundFreelance.user._id
    ) {
      return next(new Error("Not authorized."));
    }
    const deletedFreelance = await Freelance.findByIdAndDelete(req.params.id);
    if (!deletedFreelance) {
      return next(new Error("User not found"));
    }
    const deletedUser = await User.findByIdAndDelete(deletedFreelance.user._id);
    res.send({ deletedFreelance, deletedUser });
  } catch (error) {
    return next(error);
  }
};
