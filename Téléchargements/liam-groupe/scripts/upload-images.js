import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Import the image map from siteData
const siteDataPath = path.join(projectRoot, 'src', 'data', 'siteData.js')
// Read the file to extract the imageMap
const content = readFileSync(siteDataPath, 'utf-8')

// Parse the imageMap object from the file
const imageMapMatch = content.match(/const imageMap = ({[\s\S]*?});\n\nexport/)
if (!imageMapMatch) {
  console.error('Could not find imageMap in siteData.js')
  process.exit(1)
}

// Eval the image map (safe since it's our own code)
const imageMap = eval('(' + imageMapMatch[1] + ')')

const total = Object.keys(imageMap).length
let uploaded = 0
let failed = 0

async function uploadAll() {
  console.log(`Uploading ${total} images to Cloudinary...\n`)

  for (const [seed, localPath] of Object.entries(imageMap)) {
    const fullPath = path.join(projectRoot, 'public', localPath.replace(/^\//, ''))

    if (!existsSync(fullPath)) {
      console.warn(`  ⚠ File not found: ${fullPath} — skipping`)
      failed++
      continue
    }

    try {
      const result = await cloudinary.uploader.upload(fullPath, {
        public_id: seed,
        folder: 'liam-groupe',
        overwrite: true,
        resource_type: 'image',
      })
      uploaded++
      process.stdout.write(`  ✓ ${seed.padEnd(35)} → ${result.secure_url}\n`)
    } catch (err) {
      console.error(`  ✗ ${seed} — ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone! ${uploaded}/${total} uploaded, ${failed} failed.`)
  console.log('\nUse the following Cloudinary URL format in your siteData.js:')
  console.log('https://res.cloudinary.com/dwmrzp61c/image/upload/v1/liam-groupe/{seed}')
}

uploadAll().catch(console.error)
