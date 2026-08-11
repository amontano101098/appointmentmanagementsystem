<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class AppointmentCancelled extends Mailable
{
    public $appointment;

    public function __construct($appointment)
    {
        $this->appointment = $appointment;
    }

    public function build()
    {
        return $this->subject('Your Appointment Has Been Cancelled')
            ->view('email.appointment_cancelled');
    }
}
