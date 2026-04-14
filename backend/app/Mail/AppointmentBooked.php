<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class AppointmentBooked extends Mailable
{
    public $appointment;

    public function __construct($appointment)
    {
        $this->appointment = $appointment;
    }

    public function build()
    {
        return $this->subject('New Appointment Booked')
            ->view('emails.appointment');
    }
}