import { withRedirectByRole } from "./middlewares/withRedirectByRole";
import { stackMiddlewares } from "./middlewares/stackMiddlewares";

const middlewares = [withRedirectByRole];

export default stackMiddlewares(middlewares);
