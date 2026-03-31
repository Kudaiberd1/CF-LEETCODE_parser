import type { RequestHandler } from 'express';
import {
  visualCodeforcesPng,
  visualLeetCodePng,
} from '../../visual/visualHandlers';

export const getLeetCodeVisualPng: RequestHandler = (req, res) => {
  void visualLeetCodePng(req, res);
};

export const getCodeforcesVisualPng: RequestHandler = (req, res) => {
  void visualCodeforcesPng(req, res);
};
