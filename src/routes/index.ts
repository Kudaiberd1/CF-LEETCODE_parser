import { Router } from 'express';
import codeforcesRouter from './codeforces.routes';
import contestRouter from './contest.routes';
import discussionRouter from './discussion.routes';
import legacyRouter from './legacy.routes';
import metaRouter from './meta.routes';
import problemRouter from './problem.routes';
import reviewRouter from './review.routes';
import userRouter from './user.routes';

const apiRouter = Router();

apiRouter.use(metaRouter);
apiRouter.use(discussionRouter);
apiRouter.use(problemRouter);
apiRouter.use(contestRouter);
apiRouter.use(codeforcesRouter);
apiRouter.use(reviewRouter);
apiRouter.use(userRouter);
apiRouter.use(legacyRouter);

export default apiRouter;
