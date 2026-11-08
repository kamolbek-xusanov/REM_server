import 'dotenv/config'
import { ListingType, PrismaClient, PropertyStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()
const UPLOAD_DIR = join(process.cwd(), 'uploads')

function createPlaceholder(index: number, title: string) {
  const colors = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0891b2', '#4f46e5', '#65a30d']
  const color = colors[index % colors.length]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
    `<rect width="800" height="600" fill="${color}"/>` +
    `<text x="400" y="300" font-family="Arial, sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">${title}</text>` +
    `</svg>`
  const fileName = `seed-${index + 1}.svg`
  writeFileSync(join(UPLOAD_DIR, fileName), svg)
  return `/uploads/${fileName}`
}

async function main() {
  mkdirSync(UPLOAD_DIR, { recursive: true })

  const adminHash = await bcrypt.hash('Admin123', 10)
  const sellerHash = await bcrypt.hash('Seller123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: 'ADMIN' },
    create: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminHash,
      phone: '+998900000000',
      role: 'ADMIN',
    },
  })

  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@example.com' },
    update: {},
    create: {
      fullName: 'Seller One',
      email: 'seller1@example.com',
      passwordHash: sellerHash,
      phone: '+998901111111',
    },
  })

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@example.com' },
    update: {},
    create: {
      fullName: 'Seller Two',
      email: 'seller2@example.com',
      passwordHash: sellerHash,
      phone: '+998902222222',
    },
  })

  const categoryData = [
    { name: 'Kvartira', slug: 'kvartira' },
    { name: 'Uy', slug: 'uy' },
    { name: 'Ofis', slug: 'ofis' },
    { name: 'Yer', slug: 'yer' },
  ]

  const categories: Record<string, number> = {}
  for (const c of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    })
    categories[c.slug] = category.id
  }

  const properties = [
    {
      title: '3 xonali kvartira', description: 'Markazda, ta\'mirlangan, metroga yaqin',
      price: 85000, listingType: ListingType.SALE, address: 'Chilonzor 5', city: 'Toshkent',
      area: 72.5, rooms: 3, bathrooms: 1, category: 'kvartira', owner: seller1.id,
      status: PropertyStatus.APPROVED,
    },
    {
      title: '2 xonali kvartira ijaraga', description: 'Mebelli, texnika bilan',
      price: 500, listingType: ListingType.RENT, address: 'Yunusobod 10', city: 'Toshkent',
      area: 55, rooms: 2, bathrooms: 1, category: 'kvartira', owner: seller1.id,
      status: PropertyStatus.APPROVED,
    },
    {
      title: 'Katta hovli uy', description: 'Bog\'li hovli, garaj bor',
      price: 120000, listingType: ListingType.SALE, address: 'Registon ko\'chasi 3', city: 'Samarqand',
      area: 180, rooms: 5, bathrooms: 2, category: 'uy', owner: seller2.id,
      status: PropertyStatus.APPROVED,
    },
    {
      title: 'Studiya ijaraga', description: 'Eski shahar markazida, mebelli',
      price: 300, listingType: ListingType.RENT, address: 'Markaz 7', city: 'Buxoro',
      area: 30, rooms: 1, bathrooms: 1, category: 'kvartira', owner: seller2.id,
      status: PropertyStatus.APPROVED,
    },
    {
      title: 'Markazdagi ofis', description: 'Biznes markazda, konditsioner va internet',
      price: 1200, listingType: ListingType.RENT, address: 'Amir Temur 15', city: 'Toshkent',
      area: 90, rooms: 4, bathrooms: 1, category: 'ofis', owner: seller1.id,
      status: PropertyStatus.APPROVED,
    },
    {
      title: 'Dacha uchastkasi', description: 'Kichik uy va mevali bog\' bilan',
      price: 45000, listingType: ListingType.SALE, address: 'Chinoz ko\'chasi 21', city: 'Chirchiq',
      area: 600, rooms: 2, bathrooms: 1, category: 'yer', owner: seller2.id,
      status: PropertyStatus.APPROVED,
    },
    {
      title: '4 xonali uy', description: 'Yangi qurilgan, ta\'mir talab qilmaydi',
      price: 200000, listingType: ListingType.SALE, address: 'Chilonzor 12', city: 'Toshkent',
      area: 140, rooms: 4, bathrooms: 2, category: 'uy', owner: seller2.id,
      status: PropertyStatus.PENDING,
    },
    {
      title: '1 xonali kvartira Xiva', description: 'Ichan Qala yaqinida',
      price: 250, listingType: ListingType.RENT, address: 'Pahlavon Mahmud 4', city: 'Xiva',
      area: 38, rooms: 1, bathrooms: 1, category: 'kvartira', owner: seller1.id,
      status: PropertyStatus.PENDING,
    },
  ]

  let created = 0
  for (let i = 0; i < properties.length; i++) {
    const p = properties[i]

    const exists = await prisma.property.findFirst({
      where: { title: p.title, ownerId: p.owner },
    })
    if (exists) continue

    const url = createPlaceholder(i, p.title)

    await prisma.property.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        currency: 'USD',
        listingType: p.listingType,
        status: p.status,
        address: p.address,
        city: p.city,
        area: p.area,
        rooms: p.rooms,
        bathrooms: p.bathrooms,
        ownerId: p.owner,
        categoryId: categories[p.category],
        images: { create: [{ url, altText: p.title, sortOrder: 0 }] },
      },
    })
    created++
  }

  console.log(`Seed tayyor. Admin: ${admin.email}, yangi e'lonlar: ${created}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })