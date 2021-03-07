import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {

    async execute(request: Request, respose: Response) {
        
        const { survey_id } = request.params;
        
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        
        const surveyUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        });

        const detractor = surveyUsers.filter(
            survey => survey.value >= 0 && survey.value <= 6
        ).length;

        const promotors = surveyUsers.filter(
            survey => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveyUsers.filter(
            survey => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveyUsers.length;

        const calculate = Number((((promotors - detractor) / totalAnswers) * 100)).toFixed(2);

        return respose.json({
            detractor,
            promotors,
            passive,
            totalAnswers,
            nps: calculate
        });
    }
}

export { NpsController }