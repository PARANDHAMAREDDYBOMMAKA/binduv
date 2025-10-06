import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.allotmentCheck.deleteMany()
  await prisma.iPOCompany.deleteMany()

  // Seed IPO companies
  const companies = await Promise.all([
    prisma.iPOCompany.create({
      data: {
        name: 'Ami Organics Limited',
        sector: 'Chemicals',
        registrar: 'kfin',
        status: 'Hot',
        issuePrice: 610,
        lotSize: 24,
        openDate: new Date('2024-09-01'),
        closeDate: new Date('2024-09-05'),
        allotmentDate: new Date('2024-09-08'),
        listingDate: new Date('2024-09-14'),
      },
    }),
    prisma.iPOCompany.create({
      data: {
        name: 'Happiest Minds Technologies',
        sector: 'Technology',
        registrar: 'link-intime',
        status: 'New',
        issuePrice: 165,
        lotSize: 90,
        openDate: new Date('2024-09-02'),
        closeDate: new Date('2024-09-06'),
        allotmentDate: new Date('2024-09-09'),
        listingDate: new Date('2024-09-15'),
      },
    }),
    prisma.iPOCompany.create({
      data: {
        name: 'Route Mobile Limited',
        sector: 'Technology',
        registrar: 'kfin',
        status: 'Popular',
        issuePrice: 350,
        lotSize: 42,
        openDate: new Date('2024-09-03'),
        closeDate: new Date('2024-09-07'),
        allotmentDate: new Date('2024-09-10'),
        listingDate: new Date('2024-09-16'),
      },
    }),
    prisma.iPOCompany.create({
      data: {
        name: 'Chemcon Speciality Chemicals',
        sector: 'Chemicals',
        registrar: 'bigshare',
        status: 'Hot',
        issuePrice: 340,
        lotSize: 44,
        openDate: new Date('2024-09-04'),
        closeDate: new Date('2024-09-08'),
        allotmentDate: new Date('2024-09-11'),
        listingDate: new Date('2024-09-17'),
      },
    }),
    prisma.iPOCompany.create({
      data: {
        name: 'Angel One Limited',
        sector: 'Financial Services',
        registrar: 'link-intime',
        status: 'Trending',
        issuePrice: 306,
        lotSize: 49,
        openDate: new Date('2024-09-05'),
        closeDate: new Date('2024-09-09'),
        allotmentDate: new Date('2024-09-12'),
        listingDate: new Date('2024-09-18'),
      },
    }),
  ])

  console.log(`Seeded ${companies.length} companies`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
