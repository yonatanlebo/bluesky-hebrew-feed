import { Kysely, MigrationProvider, sql } from 'kysely';

export const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return {
      '001': createTables,
      '002': addReplyColumns,
      '003': addLanguageColumn,
      '004': addAuthorColumn,
      '005': addIndexOnIndexedAtAndLanguage,
      '006': addIndexOnAuthor,
      '007': optimizeIndexes,
      '008': removeLanguageDefault,
    };
  },
};

const createTables = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable('post')
      .addColumn('uri', 'varchar', (col) => col.primaryKey())
      .addColumn('cid', 'varchar', (col) => col.notNull())
      .addColumn('indexedAt', 'varchar', (col) => col.notNull())
      .execute();

    await db.schema
      .createTable('sub_state')
      .addColumn('service', 'varchar', (col) => col.primaryKey())
      .addColumn('cursor', 'integer', (col) => col.notNull())
      .execute();
  },
};

const addReplyColumns = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .alterTable('post')
      .addColumn('replyRoot', 'varchar')
      .addColumn('replyTo', 'varchar')
      .execute();
  },
};

const addLanguageColumn = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .alterTable('post')
      .addColumn('language', 'varchar', (col) => col.notNull().defaultTo('iw'))
      .execute();
  },
};

const addAuthorColumn = {
  async up(db: Kysely<any>) {
    await db.schema.alterTable('post').addColumn('author', 'varchar').execute();

    await db
      .updateTable('post')
      .set({
        author: sql<string>`SUBSTRING("uri", 'at://(.*)/app.bsky.feed.post/.*')`,
      })
      .execute();

    await db.schema
      .alterTable('post')
      .alterColumn('author', (col) => col.setNotNull())
      .execute();
  },
};

const addIndexOnIndexedAtAndLanguage = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createIndex('post_indexedat_language_author_index')
      .on('post')
      .columns(['indexedAt', 'language'])
      .execute();
  },
};

const addIndexOnAuthor = {
  async up(db: Kysely<unknown>) {
    // To allow filtering by user, mainly for blocklist consideration feature
    await db.schema
      .createIndex('post_author_index')
      .on('post')
      .column('author')
      .execute();
  },
};

const optimizeIndexes = {
  async up(db: Kysely<unknown>) {
    // Feeds are effectively partitioned by language and on being posts or replies
    await db.schema
      .createIndex('post_language_replyto_index')
      .on('post')
      .columns(['language', 'replyTo'])
      .using('btree')
      .execute();

    // Cursors use indexedAt heavily, as well as ordering any feed query
    await db.schema
      .createIndex('post_indexedat_index')
      .on('post')
      .column('indexedAt')
      .using('btree')
      .execute();

    // Should not be needed anymore
    await db.schema.dropIndex('post_indexedat_language_author_index').execute();
  },
};

const removeLanguageDefault = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .alterTable('post')
      .alterColumn('language', (c) => c.dropDefault())
      .execute();
  },
};
