<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class BookingCancelled extends Mailable
{
    public $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function build()
    {
        return $this->subject('Your Booking Has Been Cancelled')
            ->view('email.booking_cancelled');
    }
}
