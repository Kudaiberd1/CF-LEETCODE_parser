import { Router } from 'express';
import { getApiOverview } from '../http/controllers/meta.controller';

const metaRouter = Router();

metaRouter.get('/', getApiOverview);

export default metaRouter;
