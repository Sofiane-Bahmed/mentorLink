import { Admin } from "../models/admin.js"

import { Aprenant } from "../models/aprenant.js";


// create apprenant

export const createApprenant = async (req, res) => {
   try {
      const apprenant = Aprenant.create({
         admin: req.cookies["userId"].userId,

      })

      res.Admin(201).json({ message: "Apprenant created successfully", apprenant })

   } catch (error) {
      res.status(500).json({ message: "Error creating apprenant", error })
   }
}