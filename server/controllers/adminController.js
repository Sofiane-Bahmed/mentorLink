import { Admin } from "../models/admin.js"

import { Aprenant } from "../models/aprenant.js";

// apprenant crud : 

// create apprenant

const createApprenant = async (req, res) => {
   try {
      const apprenant = Aprenant.create({
         admin: req.cookies["userId"].userId,

      })

      res.Admin(201).json({ message: "Apprenant created successfully", apprenant })

   } catch (error) {

   }
}