import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database tables...')

  // Delete all allotment checks first (due to foreign key constraint)
  const deletedChecks = await prisma.allotmentCheck.deleteMany()
  console.log(`Deleted ${deletedChecks.count} allotment check records`)

  // Delete all IPO companies
  const deletedCompanies = await prisma.iPOCompany.deleteMany()
  console.log(`Deleted ${deletedCompanies.count} IPO company records`)

  console.log('Database cleared successfully!')
  console.log('System now using 100% scraped data from registrars.')
}

main()
  .catch((e) => {
    console.error('Error clearing database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
