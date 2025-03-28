import { Generated, GeneratedAlways } from 'kysely';

export type DatabaseSchema = {
  post: PostSchema;
  sub_state: SubStateSchema;
  notified_users: NotifiedUsersSchema;
  filtered_users: FilteredUsersSchema;
};

export type PostSchema = {
  uri: string;
  author: string;
  cid: string;
  indexedAt: string;
  createdAt?: string;
  effectiveTimestamp: Generated<string>;
  replyRoot?: string;
  replyTo?: string;
  language: string;
};

export type FilteredUsersSchema = {
  did: string;
};

export type SubStateSchema = {
  service: string;
  cursor: string;
};

export type NotifiedUsersSchema = {
  did: string;
  notifiedAt: GeneratedAlways<Date>;
};
