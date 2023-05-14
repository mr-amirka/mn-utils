import {fn} from "../global";

type IMiddleware = (ctx: any, next: fn) => any;
type IRoute = (path: string, middleware: IMiddleware) => IMiddleware;
type IMount = (path: string, middleware: IMiddleware) => IMiddleware;
interface IChainInstnace {
  (ctx: any, next: fn): any;
  use: (middleware: IMiddleware) => IChainInstnace;
  mount: (path: string, middleware: IMiddleware) => IChainInstnace;
  route: (path: string, middleware: IMiddleware) => IChainInstnace;
}
type IChain = () => IChainInstnace;
type IRest = (methods: {[method: string]: IMiddleware}) => IMiddleware;
type IMethod = (path: string | IMiddleware, middleware?: IMiddleware) => IRouterInstnace;
interface IRouterInstnace extends IChainInstnace {
  get: IMethod;
  post: IMethod;
  put: IMethod;
  del: IMethod;
  head: IMethod;
  trace: IMethod;
  options: IMethod;
  patch: IMethod;
  connect: IMethod;
}
interface IRouter {
  (): IRouterInstnace;
  Route: IRoute;
  Mount: IMount;
  Chain: IChain;
  Rest: IRest;
}

declare function routerProvider(): IRouter;
export = routerProvider;
