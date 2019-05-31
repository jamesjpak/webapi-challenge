const express = require("express");

const router = express.Router();

const Projects = require("./projectModel");
const Actions = require("./actionModel");

// Get list of actions
router.get("/", (req, res) => {
    Actions
    .get()
      .then(actions => {
        if (actions) {
          res.status(200).json(actions);
        } else {
          res.status(404).json({ message: "Actions not found!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Error retrieving actions!"
        });
      });
  });
  
  
// Get list of actions for a project
router.get("/:id", validateProjectId, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(actions => {
      if (actions) {
        res.status(200).json(actions);
      } else {
        res.status(404).json({ message: "Project not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error retrieving actions!"
      });
    });
});


// Add action to a project
router.post("/:id"), validateProjectId, (req, res) => {

    const newAction = {
      description: req.body.description,
      notes: req.body.notes,
      project_id: req.params.id
    };

    Actions.insert(newAction)
      .then(action => {
        res.status(201).json(action);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "Error adding action" });
      });
  };


  // delete action
  router.delete("/:id", async (req, res) => {
    try {
      const count = await Actions.remove(req.params.id);
      if (count > 0) {
        res.status(200).json({ message: "Action deleted!" });
      } else {
        res.status(404).json({ message: "Action could not be found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error removing project"
      });
    }
  });


//  update an action

//   router.put("/:id", async (req, res) => {

//     try {
//       const action = await Actions.update(req.params.id, req.body.description, req.body.notes);
//       if (action) {
//         res.status(200).json(action);
//       } else {
//         res.status(404).json({ message: "The action could not be found" });
//       }
//     } catch (error) {
//         console.log(error)
//       res.status(500).json({
//         message: "Error updating the action"
//       });
//     }
//   });
  

// middleware for validating
function validateProjectId(req, res, next) {
  Projects.get(req.params.id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: "Not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error retrieving project" });
    });
}

module.exports = router;
