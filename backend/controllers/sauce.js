const Sauce = require("../models/Sauce");
const fs = require("fs"); // file system, package qui permet de modifier et/ou supprimer des fichiers

// création, modification, suppression et récupération sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const userId = res.locals.userId;
  
    const sauce = new Sauce({
      userId: userId, 
      name: sauceObject.name, 
      manufacturer: sauceObject.manufacturer, 
      description: sauceObject.description, 
      heat: sauceObject.heat,
      mainPepper: sauceObject.mainPepper, 
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
  
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce sauvegardée" }))
      .catch((error) => res.status(400).json({ error }));
    console.log(sauce);
  };

function getImageUrl(req) {
  return `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
}
exports.modifySauce = (req, res, next) => {
  const userId = res.locals.userId;
  const sauceId = req.params.id;
  let sauce = req.body;
  let image;

  if (req.file) {
    sauce = JSON.parse(req.body.sauce);
    image = getImageUrl(req);
  }

  const updateFields = {};

  if (sauce.name) {
    updateFields.name = sauce.name;
  }
  if (sauce.heat) {
    updateFields.heat = sauce.heat;
  }
  if (sauce.manufacturer) {
    updateFields.manufacturer = sauce.manufacturer;
  }
  if (sauce.description) {
    updateFields.description = sauce.description;
  }

  if (image) {
    updateFields.imageUrl = image;
  }

  const updateQuery = { $set: updateFields };

  Sauce.updateOne({ _id: sauceId, userId: userId }, updateQuery)
    .then(() => res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) =>
      res.status(400).json({ error: "Échec de la modification de la sauce." })
    );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce supprimée" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const currentUser = res.locals.userId;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "Sauce non trouvée." });
      }

      const alreadyLiked = sauce.usersLiked.includes(currentUser);
      const alreadyDisliked = sauce.usersDisliked.includes(currentUser);
      let message = "Action réussie.";

      if (like === 1) {
        if (alreadyLiked) {
          message = "Vous avez déjà liké cette sauce.";
        } else if (alreadyDisliked) {
          sauce.dislikes -= 1;
          sauce.usersDisliked = sauce.usersDisliked.filter(
            (userId) => userId !== currentUser
          );
        } else {
          message = "Vous aimez cette sauce.";
        }
        sauce.likes += 1;
        sauce.usersLiked.push(currentUser);
      } else if (like === -1) {
        if (alreadyDisliked) {
          message = "Vous avez déjà disliké cette sauce.";
        } else if (alreadyLiked) {
          sauce.likes -= 1;
          sauce.usersLiked = sauce.usersLiked.filter(
            (userId) => userId !== currentUser
          );
        } else {
          message = "Vous n'aimez pas cette sauce.";
        }
        sauce.dislikes += 1;
        sauce.usersDisliked.push(currentUser);
      } else {
        if (alreadyLiked) {
          sauce.likes -= 1;
          sauce.usersLiked = sauce.usersLiked.filter(
            (userId) => userId !== currentUser
          );
        } else if (alreadyDisliked) {
          sauce.dislikes -= 1;
          sauce.usersDisliked = sauce.usersDisliked.filter(
            (userId) => userId !== currentUser
          );
        }
        message = "Vous êtes neutre sur cette sauce.";
      }

      sauce
        .save()
        .then(() => {
          res.status(200).json({ message });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
