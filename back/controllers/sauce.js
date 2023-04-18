const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  req.body.sauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    mainPepper: req.body.sauce.mainPepper,
    usersLiked: [],
    usersDisliked: [],
    userId: req.body.sauce.userId
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: "Item saved successfully!"
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
      likes: 0,
      dislikes: 0,
      mainPepper: req.body.sauce.mainPepper,
      usersLiked: [],
      usersDisliked: [],
      userId: req.body.sauce.userId
    };
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      imageUrl: req.body.imageUrl,
      mainPepper: req.body.mainPepper,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
      userId: req.body.userId
    };
  }

  Sauce.updateOne({ _id: req.params.id }, sauce).then(
    () => {
      res.status(201).json({
        message: "Item updated successfully!"
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      switch (req.body.like) {
        case -1:
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            sauce.usersDisliked.push(req.body.userId)
            sauce.dislikes = sauce.usersDisliked.length
          }
          break;
        case 0:
          if (sauce.usersDisliked.includes(req.body.userId)) {
            //sauce.usersDisliked = sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1)
            sauce.usersDisliked = sauce.usersDisliked.filter( u => u != req.body.userId )
            sauce.dislikes = sauce.usersDisliked.length

          }
          else if (sauce.usersLiked.includes(req.body.userId)) {
            //sauce.usersLiked = sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1)
            sauce.usersLiked = sauce.usersLiked.filter( u => u != req.body.userId )
            sauce.likes = sauce.usersLiked.length

          }
          break;
        case 1:
          if (!sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.push(req.body.userId)
            sauce.likes = sauce.usersLiked.length
          }
          break;
      }
      Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
          res.status(201).json({
            message: "Item updated successfully!"
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    });
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images')[1];
      fs.unlink('images/' + filename, () => {
        if (!sauce) {
          return res.status(404).json({
            error: new Error('No such sauce')
          });
        }
        if (sauce.userId !== req.auth.userId) {
          return res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        Sauce.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: "Item Deleted!"
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      })
    });
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      return res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      return res.status(400).json({
        error: error
      });
    }
  );
};