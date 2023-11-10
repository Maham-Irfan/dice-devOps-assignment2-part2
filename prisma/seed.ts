import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main(){
    const category1 = await prisma.category.upsert(
        {
            where:{
                id:1,
            },
            update:{},
            create:{
                name:"Pencil Boxes",
                stock:10
            }
        }
    )
    const category2 = await prisma.category.upsert(
        {
            where:{
                id:2,
            },
            update:{},
            create:{
                name:"Erasers",
                stock:50
            }
        }
    )

    
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});