import { Router, Response, Request } from 'express';
import { getHomepageImageUrls } from '../controllers/dbController';

// init router
const router = Router();

console.log('Entering API router');

router.get('/homepageImageUrls', getHomepageImageUrls, (_, res: Response) => {

  const { homepageImageUrls } = res.locals
  // console.log('api.ts/homepageImageUrls', homepageImageUrls)
  res.status(200).json(homepageImageUrls);

})


export { router };