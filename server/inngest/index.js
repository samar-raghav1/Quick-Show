import { Inngest } from "inngest";
import User from '../models/User.js';
import connectDB from "../config/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });



// Inngest functon to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({event}) =>{
    // await connectDB()
    const{id, first_name, last_name, email_addresses, image_url} = event.data
    const userData = {
        _id: id,
        email:email_addresses[0].email_address,
        name: first_name + " " + last_name,
        image: image_url
    }
    await User.create(userData)
    console.log("User created from Clerk:", userData);

  }
)
// Inngest functon to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({event}) =>{
// await connectDB()
    const {id} = event.data;
    await User.findByIdAndDelete(id)
    }
   
)
// Inngest functon to update user from database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },

    async ({event}) =>{
      // await connectDB();

    const{id, first_name, last_name, email_addresses, image_url} = event.data
    const userData = {
        _id: id,
        email:email_addresses[0].email_address,
        name: first_name + " " + last_name,
        image: image_url
    }
    await User.findByIdAndUpdate(id, userData)
  }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];