import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { trainingSessionValidationSchema } from 'validationSchema/training-sessions';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTrainingSessions();
    case 'POST':
      return createTrainingSession();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTrainingSessions() {
    const data = await prisma.training_session
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'training_session'));
    return res.status(200).json(data);
  }

  async function createTrainingSession() {
    await trainingSessionValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.performance_evaluation?.length > 0) {
      const create_performance_evaluation = body.performance_evaluation;
      body.performance_evaluation = {
        create: create_performance_evaluation,
      };
    } else {
      delete body.performance_evaluation;
    }
    const data = await prisma.training_session.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
