import { router } from "./context";
import { urlRouter } from "./url";

export const trpcRouter = router({ // nested routers can be added here
    url: urlRouter
})