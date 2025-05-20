import { getCurrentUser } from "@/app/actions/getCurrentUser"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
export default async function Test() {
  const user = await getCurrentUser()
  return (<div>
    
    <div className="flex flex-col ">
    email:
    {user?.emailAddresses[0].emailAddress}
    </div>
   <div>
    first name:
    {user?.firstName}
    <br />
    last name:
    {user?.lastName}
   </div>
   <div>

    <Image src={user?.imageUrl || ""} alt="User Image" width={100} height={100} />
   </div>
   <div>
    user id:
    {user?.id}
   </div>
   <div>
    username:
    {user?.username}
    <br />
    created at:
    {user?.createdAt}
   </div>
   <UserButton />
    </div>)
}