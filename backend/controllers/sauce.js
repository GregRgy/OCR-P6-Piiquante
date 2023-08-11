const Sauce = require('../models/Sauce');
const fs = require('fs'); // file system, package qui permet de modifier et/ou supprimer des fichiers

// création, modification, suppression et récupération sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; 
    const userId = res.locals.userId;
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,     
    });
    sauce.save() 
    .then( () => res.status(201).json({ message: 'Sauce sauvegardée'}))
    .catch( error => res.status(400).json({ error }))
    console.log(sauce);
};

exports.modifySauce = (req, res, next) => {
    const sauceId = req.params.id;

    // Vérifiez l'authentification de l'utilisateur ici

    // Parsez les données JSON de la clé "sauce"
    const sauceData = JSON.parse(req.body.sauce);

    const sauceObject = {
        name: sauceData.name,
        manufacturer: sauceData.manufacturer,
        description: sauceData.description,
        mainPepper: sauceData.mainPepper,
        // ... Ajoutez d'autres propriétés ici
    };

    if (req.file) {
        sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    Sauce.updateOne({ _id: sauceId }, sauceObject)
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error: "Échec de la modification de la sauce." }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => {
    Sauce.deleteOne({_id: req.params.id}) 
    .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))
    .catch(error => res.status(400).json({ error}))
    });
};

exports.getAllSauces = (req, res, next) => { 
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => {  
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};

exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const currentUser = res.locals.userId;
    const sauceId = req.params.id;

    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
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
                    sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId !== currentUser);
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
                    sauce.usersLiked = sauce.usersLiked.filter(userId => userId !== currentUser);
                } else {
                    message = "Vous n'aimez pas cette sauce.";
                }
                sauce.dislikes += 1;
                sauce.usersDisliked.push(currentUser);
            } else {
                if (alreadyLiked) {
                    sauce.likes -= 1;
                    sauce.usersLiked = sauce.usersLiked.filter(userId => userId !== currentUser);
                } else if (alreadyDisliked) {
                    sauce.dislikes -= 1;
                    sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId !== currentUser);
                }
                message = "Vous êtes neutre sur cette sauce.";
            }

            sauce.save()
                .then(() => {
                    res.status(200).json({ message });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};