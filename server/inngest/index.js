import { Inngest } from "inngest";
import User from '../models/User.js';
import connectDB from "../config/db.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../config/nodemailer.js";

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
const releaseSeatsAndDeleteBooking=inngest.createFunction(
  {id:'release-seats-dalete-booking'},
  {event:'app/checkpayment'},
  async({event,step})=>{
    const tenMinuteslater=new Date(Date.now()+10*60*1000);
    await step.sleepUntil('wait-for-10-minutes',tenMinuteslater);

    await step.run('check-payment-status',async()=>{
      const bookingId=event.data.bookingId;
      const booking =await Booking.findById(bookingId)

      if(!booking.isPaid){
        const show =await Show.findById(booking.show);
        booking.bookedSeats.forEach(()=>{
          delete show.occupiedSeats[seat]
        });
        show.markModified('occupiedSeats')
        await show.save()
        await Booking.findByIdAndDelete(booking._id)
      }
    })
  }
)

//function to send email when user books a show
const sendBookingConfirmationEmail=inngest.createFunction({
  id:"send-booking-confirmation-email"
},
{event:'app/show.booked'},
async({event,step})=>{
  const {bookingId}=event.data;
  const booking=await Booking.findById(bookingId).populate({
    path:"show",
    populate:{path:"movie",model:"Movie"}
  }).populate('user')

  await sendEmail({
    to:booking.user.email,
    subject:`Payment Confirmation :"${booking.show.movie.title}" booked!`,
    body:`<div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>Hi ${booking.user.name},</h2>
                <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
                <p>
                    <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
                    <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
                </p>
                <p>Enjoy the show! 🍿</p>
                <p>Thanks for booking with us!<br/>— QuickShow Team</p>
            </div>`
  })
})
// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];