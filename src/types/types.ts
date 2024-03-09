import { IncomingMessage, Server, ServerResponse } from "http";

export type ServerType = Server<typeof IncomingMessage, typeof ServerResponse>;

export type userType = {
  name: string;
  id: string;
  socketId?: string;
  image?: string;
};
