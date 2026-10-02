import { defineMiddleware } from 'astro:middleware';
import { ownerBoundary } from './server/ownerAuth';

export const onRequest = defineMiddleware((context, next) => ownerBoundary(context.request, next));
