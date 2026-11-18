import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";
import {userBalance} from "@/lib/data";
import {WishlistManager} from "./wishlist-manager";
export default async function WishlistPage(){const user=await requireUser();const [items,totals]=await Promise.all([prisma.wishlistItem.findMany({where:{userId:user.id},orderBy:[{priority:"desc"},{createdAt:"desc"}]}),userBalance(user.id)]);return <WishlistManager items={items.map(x=>({id:x.id,name:x.name,cost:x.cost,priority:x.priority}))} balance={totals.balance}/>}
