import express from "express";
import { studentMap } from "./student";
const router = express.Router();

router.get("/Student/:id", (req, res) => {
    const {
        params: { id },
    } = req;

    if (studentMap.has(id)) {
        res.send({ body: studentMap.get(id) });
    } else {
        res.sendStatus(404);
    }
});

router.get("/Student/:id/v1", (req, res) => {
    const {
        params: { id },
    } = req;

    if (studentMap.has(id)) {
        res.status(302).send(studentMap.get(id));
    } else {
        res.sendStatus(400);
    }
});

export default router;
