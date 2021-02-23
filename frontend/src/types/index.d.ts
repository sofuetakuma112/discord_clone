export type Chat = {
  _id: string;
  name: string;
  message: string;
  created: Date;
  channelId: string;
  channel_id?: string;
};

export type Channel = {
  name: string;
  id: string;
  categoryId: string;
};

export type BackgroundStyle = {
  background: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type User = {
  _id: string;
  socketId?: string;
  name: string;
  email?: string;
  password?: string;
  isAnonumous: string;
};
