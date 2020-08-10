import express from "express";
import { isValidStudent, studentMap } from "./student";
const router = express.Router();
router.put("/Student", express.json(), (req, res) => {
    const { body } = req;

    if (!isValidStudent(body)) {
        res.sendStatus(300);
        return;
    }

    if (studentMap.has(body.id)) res.status(210);
    else res.status(201);
    studentMap.set(body.id, body);
    res.send({ body });
});

router.put("/Student/:id", express.json(), (req, res) => {
    const { body } = req;

    if (!isValidStudent(body)) {
        res.sendStatus(400);
        return;
    }

    if (studentMap.has(body.id)) res.status(200);
    else res.status(201);
    studentMap.set(body.id, body);
    res.send({ body });
});

export default router;
