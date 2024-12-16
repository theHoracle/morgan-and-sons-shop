// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import  { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Menu } from './collections/menu/Menu'
import { Category } from './collections/menu/Category'
import { Products } from './collections/Products'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Menu, Category, Products],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: { 
        media: true
      },
      bucket: process.env.SUPABASE_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID!,
          secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.SUPABASE_ENDPOINT!,
        region: process.env.SUPABASE_REGION,
        forcePathStyle: true,
        // ... Other S3 configuration
      },
    }),
  ],
})
